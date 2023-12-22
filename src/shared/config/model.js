import { createEffect, createEvent, createStore, sample } from 'effector';
import { backendApi } from '../api/backend';
import { toast } from '../ui-kit/toast';

const stablecoin = {};

const init = createEvent();
const chainFx = createEffect(backendApi.getChain);
const $chain = createStore(null).on(chainFx.doneData, (_, response) => response);

sample({
  source: chainFx.fail,
  fn: () => ({ type: 'error', content: 'Failed to get chain', title: 'Server Error' }),
  target: toast
});

chainFx.doneData.watch((chain) => {
  const { usdtAddress, usdcAddress } = chain?.attributes?.config?.data?.attributes ?? {};
  stablecoin.USDT = usdtAddress;
  stablecoin.USDC = usdcAddress;
  stablecoin[usdtAddress] = 'USDT';
  stablecoin[usdcAddress] = 'USDC';
});

sample({
  source: chainFx.doneData,
  filter: (result) => !result,
  fn: () => ({ type: 'error', content: `Chain not found`, title: 'Not Found' }),
  target: toast
});

sample({
  clock: init,
  target: chainFx
});

export const configModel = {
  stablecoin,
  chainFx,
  init,
  $chain
};
