import { createGate } from 'effector-react';
import { combine, createEvent, createStore } from 'effector';
import { collectionsModel } from '../../entities/collections';
import { sort } from '../../shared/lib/sort-utils';

export const SORT_TYPES = {
  PRICE_ASC: 'PRICE_ASC',
  PRICE_DESC: 'PRICE_DESC',
  POPULAR_ASC: 'POPULAR_ASC',
  POPULAR_DESC: 'POPULAR_DESC'
};

export const SORT_TYPE_KEYS = Object.keys(SORT_TYPES);

const NftCardsGate = createGate();

const orderChanged = createEvent();

const $order = createStore(SORT_TYPES.POPULAR_DESC).on(orderChanged, (_, data) => data);

const $activeCategory = NftCardsGate.state.map((state) => state?.activeTab);

const $sortedItems = combine(
  collectionsModel.$items,
  collectionsModel.$priceDollar,
  collectionsModel.$tokenIds,
  $activeCategory,
  $order,
  (items, priceDollar, tokenIds, activeCategory, order) => {
    const itemsToSort = items.byCategory?.[activeCategory]?.map((item) => {
      const address = item?.attributes?.address;
      return {
        address,
        price: Number(priceDollar[address]?.result) || 0,
        tokenId: Number(tokenIds[address]?.result) || 0
      };
    });
    if (!itemsToSort) return [];
    const desc = order?.split?.('_')?.reverse()?.[0] === 'DESC';
    const source = {
      [SORT_TYPES.PRICE_ASC]: 'price',
      [SORT_TYPES.PRICE_DESC]: 'price',
      [SORT_TYPES.POPULAR_DESC]: 'tokenId',
      [SORT_TYPES.POPULAR_ASC]: 'tokenIds'
    }[order];
    return sort(itemsToSort, source, desc)?.map((item) => item?.address);
  }
);

export const nftCardsModel = {
  NftCardsGate,
  $order,
  $sortedItems,
  orderChanged
};
