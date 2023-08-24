import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { readContract } from '@wagmi/core';
import { erc20Abi, nftAbi } from '../../../shared/abi';
import { MaxUint256, STABLECOIN } from '../../../shared/config';
import { logFxError } from '../../../shared/lib/log-fx-error';
import { walletModel } from '../../../entities/wallet/model';
import { createGate } from 'effector-react';
import { collectionsModel } from '../../../entities/collections';
import { $tx, txFulfilled, writeContractFx } from '../../../shared/lib/wagmi-effector';
import { createFxStatus } from './create-fx-status';

const BuyNftGate = createGate();

const allowanceFx = createEffect(async ({ currency = 'USDT', accountAddress, nftAddress }) => {
  return readContract({
    abi: erc20Abi,
    address: STABLECOIN[currency],
    args: [accountAddress, nftAddress],
    functionName: 'allowance'
  });
});
allowanceFx.fail.watch(logFxError('allowanceFx'));

const mint = writeContractFx.prepend(({ nftAddress, currency, amount }) => ({
  address: nftAddress,
  abi: nftAbi,
  functionName: 'mint',
  args: [amount, STABLECOIN[currency]]
}));

const mintStatus = createFxStatus('mint');

const approve = writeContractFx.prepend(({ nftAddress, currency, amount }) => ({
  address: STABLECOIN[currency],
  abi: erc20Abi,
  functionName: 'approve',
  args: [nftAddress, amount || MaxUint256]
}));

const approveStatus = createFxStatus('approve');

const $approvedKv = createStore({}).on(allowanceFx.done, (state, { params, result }) => {
  return {
    ...state,
    [params.accountAddress]: {
      ...state[params.accountAddress],
      [STABLECOIN[params.currency]]: Number(result) > 0
    }
  };
});

const closeMintErrorToast = createEvent();

const $mintErrorMessage = createStore(null)
  .on(mintStatus.fail, (_, { error }) => error?.shortMessage)
  .reset(closeMintErrorToast);

const $approved = combine([BuyNftGate.state, walletModel.$account, $approvedKv], ([state, account, approvedKv]) => {
  return !!approvedKv?.[account?.address]?.[STABLECOIN[state?.currency]];
});

// call allowance when the page params changed
sample({
  source: [BuyNftGate.state, walletModel.$account, $approvedKv],
  filter: ([state, account, approvedKv]) =>
    !!state?.nftAddress && !!account?.address && approvedKv?.[account?.address]?.[STABLECOIN[state?.currency]] == null,
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
    currency: STABLECOIN[address]
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
  $approved,
  allowanceFx,
  approve,
  approveStatus,
  mint,
  mintStatus,
  BuyNftGate,
  $mintErrorMessage,
  closeMintErrorToast
};
