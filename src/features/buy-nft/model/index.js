import { combine, createEffect, createEvent, createStore, sample, split } from 'effector';
import { readContract } from '@wagmi/core';
import { erc20Abi, nftAbi } from '../../../shared/abi';
import { MaxUint256 } from '../../../shared/config';
import { logFxError } from '../../../shared/lib/log-fx-error';
import { walletModel } from '../../../entities/wallet/model';
import { createGate } from 'effector-react';
import { collectionsModel } from '../../../entities/collections';
import { writeContractFx } from '../../../shared/lib/wagmi-effector';
import { createFxStatus } from './create-fx-status';
import { agreementModel } from '../../../entities/agreement';
import { configModel } from '../../../shared/config/model';
import { formatEther, parseEther } from 'viem';

const BuyNftGate = createGate();

const allowanceFx = createEffect(async ({ currency = 'USDT', accountAddress, nftAddress }) => {
  return readContract({
    abi: erc20Abi,
    address: configModel.stablecoin?.[currency],
    args: [accountAddress, nftAddress],
    functionName: 'allowance'
  });
});
allowanceFx.fail.watch(logFxError('allowanceFx'));

const mint = writeContractFx.prepend(({ nftAddress, currency, amount }) => ({
  address: nftAddress,
  abi: nftAbi,
  functionName: 'mint',
  args: [amount, configModel.stablecoin?.[currency]]
}));

const mintStatus = createFxStatus('mint');

const approve = createEvent();

const approveFx = writeContractFx.prepend(({ nftAddress, currency, amount }) => ({
  address: configModel.stablecoin?.[currency],
  abi: erc20Abi,
  functionName: 'approve',
  args: [nftAddress, amount || MaxUint256]
}));

const approveStatus = createFxStatus('approve');

const closeErrorToast = createEvent();

const $errorMessage = createStore(null)
  .on(mintStatus.fail, (_, { error }) => error?.shortMessage)
  .on(approveStatus.fail, (_, { error }) => error?.shortMessage)
  .reset(closeErrorToast);

sample({
  clock: approve,
  source: agreementModel.$confirmed,
  filter: (confirmed) => !!confirmed,
  fn: (_, params) => params,
  target: approveFx
});

sample({
  clock: approve,
  source: agreementModel.$confirmed,
  filter: (confirmed) => !confirmed,
  fn: (_, params) => ({ fn: 'approve', params }),
  target: agreementModel.open
});

sample({
  clock: agreementModel.confirm,
  source: agreementModel.$key,
  filter: ({ fn }) => fn === 'approve',
  fn: ({ params }) => params,
  target: approveFx
});

const $allowanceKv = createStore({}).on(allowanceFx.done, (state, { params, result }) => {
  const stablecoin = configModel.stablecoin?.[params.currency];
  return {
    ...state,
    [params.accountAddress]: {
      ...state[params.accountAddress],
      [stablecoin]: { ...state?.[params.accountAddress]?.[stablecoin], [params.nftAddress]: formatEther(result) }
    }
  };
});

const $allowance = combine([BuyNftGate.state, walletModel.$account, $allowanceKv], ([state, account, approvedKv]) => {
  return approvedKv?.[account?.address]?.[configModel.stablecoin?.[state?.currency]]?.[state?.nftAddress];
});

// call allowance when the page params changed
sample({
  source: [BuyNftGate.state, walletModel.$account, $allowanceKv],
  filter: ([state, account, approvedKv]) =>
    !!state?.nftAddress &&
    !!account?.address &&
    approvedKv?.[account?.address]?.[configModel.stablecoin?.[state?.currency]] == null,
  fn: ([state, account]) => ({
    nftAddress: state?.nftAddress,
    accountAddress: account?.address,
    currency: state?.currency
  }),
  target: allowanceFx
});

// refetch allowance once approve is done
sample({
  source: walletModel.$account,
  clock: approveStatus.done,
  fn: (account, { address, args }) => ({
    accountAddress: account?.address,
    nftAddress: args?.[0],
    currency: configModel.stablecoin?.[address]
  }),
  target: allowanceFx
});

// refetch tokenId once minted
sample({
  source: mintStatus.done,
  fn: ({ address }) => [address],
  target: collectionsModel.tokenIdFx
});

export const buyNftModel = {
  $allowance,
  allowanceFx,
  approve,
  approveStatus,
  mint,
  mintStatus,
  BuyNftGate,
  $errorMessage,
  closeErrorToast
};
