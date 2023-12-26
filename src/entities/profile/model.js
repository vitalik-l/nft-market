import { createGate } from 'effector-react';
import { combine, createEffect, createStore, sample } from 'effector';
import { contractsReadFn } from '../../shared/lib/contracts-read-fn';
import { walletModel } from '../wallet/model';
import { collectionsModel } from '../collections';
import { logFxError } from '../../shared/lib/log-fx-error';
import { buyNftModel } from '../../features/buy-nft';

export const ProfileGate = createGate();

const nftBalancesFx = createEffect(({ account, addresses }) => {
  console.log(account, addresses)
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
  source: [walletModel.$account, collectionsModel.$items, ProfileGate.status],
  filter: ([account, items, gateOpen]) => gateOpen && !!account?.address && !!Object.keys(items?.byAddress)?.length,
  fn: ([account, items]) => ({ account: account?.address, addresses: Object.keys(items?.byAddress) }),
  target: nftBalancesFx
});

const $pending = combine([nftBalancesFx.pending], (states) => states.some(Boolean));

export const profileModel = {
  $accountNftBalances,
  $accountNfts,
  nftBalancesFx,
  $pending
};
