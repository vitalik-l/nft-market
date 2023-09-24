import { createEvent, sample } from 'effector';
import { collectionsModel } from '../entities/collections';
import { walletModel } from '../entities/wallet/model';
import { configModel } from '../shared/config/model';
import { initWeb3Api } from '../shared/api/web3';
import { watchAccount, watchNetwork } from '@wagmi/core';

export const appReady = createEvent();

sample({
  source: appReady,
  target: [configModel.init]
});

sample({
  clock: configModel.chainFx.done,
  target: collectionsModel.init
});

configModel.$chain.watch((chain) => {
  if (chain) {
    const chainConfig = chain?.attributes?.config?.data?.attributes;
    initWeb3Api({
      chainId: chain?.attributes?.chainId,
      alchemyApiKey: chainConfig?.alchemyApiKey,
      walletConnectProjectId: chainConfig?.walletConnectProjectId
    });
    watchAccount(walletModel.accountChanged);
    watchNetwork(walletModel.networkChanged);
  }
});
