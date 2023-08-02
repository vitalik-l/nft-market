import { createEvent, sample } from 'effector';
import { collectionsModel } from '../entities/collections';
import { walletModel } from '../entities/wallet/model';

export const appReady = createEvent();

sample({
  source: appReady,
  target: [collectionsModel.collectionsListFx, walletModel.init]
});
