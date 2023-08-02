import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { readContract, prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core';
import { erc20Abi, nftAbi } from '../../../shared/abi';
import { MaxUint256, STABLECOIN_ADDRESS } from '../../../shared/config';
import { logFxError } from '../../../shared/lib/log-fx-error';
import { walletModel } from '../../../entities/wallet/model';
import { createGate } from 'effector-react';
import { collectionsModel } from '../../../entities/collections';

const BuyNftGate = createGate();

const allowanceFx = createEffect(async ({ currency = 'USDT', accountAddress, nftAddress }) => {
  return readContract({
    abi: erc20Abi,
    address: STABLECOIN_ADDRESS[currency],
    args: [accountAddress, nftAddress],
    functionName: 'allowance'
  });
});
allowanceFx.fail.watch(logFxError('allowanceFx'));

const approveFx = createEffect(async ({ nftAddress, currency, amount }) => {
  const { request } = await prepareWriteContract({
    address: STABLECOIN_ADDRESS[currency],
    abi: erc20Abi,
    functionName: 'approve',
    args: [nftAddress, amount || MaxUint256]
  });
  const { hash } = await writeContract(request);
  return waitForTransaction({ hash });
});
approveFx.fail.watch(logFxError('approveFx'));

const mintFx = createEffect(async ({ nftAddress, currency, amount }) => {
  const { request } = await prepareWriteContract({
    address: nftAddress,
    abi: nftAbi,
    functionName: 'mint',
    args: [amount, STABLECOIN_ADDRESS[currency]]
  });
  const { hash } = await writeContract(request);
  return waitForTransaction({ hash });
});
mintFx.fail.watch(logFxError('mintFx'));

const $approvedKv = createStore({}).on(allowanceFx.done, (state, { params, result }) => {
  return {
    ...state,
    [params.accountAddress]: {
      ...state[params.accountAddress],
      [STABLECOIN_ADDRESS[params.currency]]: Number(result) > 0
    }
  };
});

const closeMintErrorToast = createEvent();

const $mintErrorToast = createStore(null)
  .on(mintFx.fail, (_, { error }) => error?.shortMessage)
  .reset(closeMintErrorToast);

const $approved = combine([BuyNftGate.state, walletModel.$account, $approvedKv], ([state, account, approvedKv]) => {
  return !!approvedKv?.[account?.address]?.[STABLECOIN_ADDRESS[state?.currency]];
});

// call allowance when the page params changed
sample({
  source: [BuyNftGate.state, walletModel.$account, $approvedKv],
  filter: ([state, account, approvedKv]) =>
    !!state?.nftAddress &&
    !!account?.address &&
    approvedKv?.[account?.address]?.[STABLECOIN_ADDRESS[state?.currency]] == null,
  fn: ([state, account]) => ({
    nftAddress: state?.nftAddress,
    accountAddress: account?.address,
    currency: state?.currency
  }),
  target: allowanceFx
});

// refetch allowance once approve is done
sample({
  clock: approveFx.done,
  source: walletModel.$account,
  fn: (account, { params }) => ({
    accountAddress: account?.address,
    nftAddress: params?.nftAddress,
    currency: params?.currency
  }),
  target: allowanceFx
});

// refetch tokenId once minted
sample({
  source: mintFx.done,
  fn: ({ params }) => [params.nftAddress],
  target: collectionsModel.tokenIdFx
});

export const buyNftModel = {
  $approved,
  allowanceFx,
  approveFx,
  mintFx,
  BuyNftGate,
  $mintErrorToast,
  closeMintErrorToast
};
