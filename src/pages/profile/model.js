import { createGate } from 'effector-react';
import { combine, createEffect, createStore, sample } from 'effector';
import { contractsReadFn } from '../../shared/lib/contracts-read-fn';
import { walletModel } from '../../entities/wallet/model';
import { collectionsModel } from '../../entities/collections';
import { logFxError } from '../../shared/lib/log-fx-error';
import { buyNftModel } from '../../features/buy-nft';

const ProfileGate = createGate();

const nftBalancesFx = createEffect(({ account, addresses }) => {
  return contractsReadFn({ functionName: 'balanceOf', args: [account] })(addresses);
});
nftBalancesFx.fail.watch(logFxError('nftBalancesFx'));

const $nftBalances = createStore({}).on(nftBalancesFx.done, (state, { params, result }) => {
  return {
    ...state,
    [params?.account]: {
      ...state?.[params?.account],
      ...result
    }
  };
});

const $accountNftBalances = combine(walletModel.$account, $nftBalances, (account, nftBalances) => {
  return nftBalances?.[account?.address] ?? {};
});

const $accountNfts = $accountNftBalances.map((accountNftBalances) => {
  const addresses = [];
  for (const [nftAddress, { result, status }] of Object.entries(accountNftBalances)) {
    if (status === 'success' && Number(result) > 0) {
      addresses.push(nftAddress);
    }
  }
  return addresses;
});

// fetch balances when open a profile page
sample({
  source: [walletModel.$account, collectionsModel.$collections, ProfileGate.status],
  filter: ([account, collections, gateStatus]) => gateStatus && !!account?.address && !!collections?.addresses?.length,
  fn: ([account, collections]) => ({ account: account?.address, addresses: collections?.addresses }),
  target: nftBalancesFx
});

const $pending = combine([collectionsModel.collectionsListFx.pending, nftBalancesFx.pending], (states) =>
  states.some(Boolean)
);

// fetch balances when bought nft
sample({
  source: walletModel.$account,
  clock: buyNftModel.mintStatus.done,
  fn: (account, { params }) => ({ account: account?.address, addresses: [params?.nftAddress] }),
  target: nftBalancesFx
});

export const profileModel = {
  $accountNftBalances,
  ProfileGate,
  $accountNfts,
  nftBalancesFx,
  $pending
};
