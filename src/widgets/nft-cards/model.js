import { createGate } from 'effector-react';
import { combine, createEvent, createStore } from 'effector';
import { collectionsModel } from '../../entities/collections';
import { sort } from '../../shared/lib/sort-utils';
import { CATEGORIES } from '../../shared/config';

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
  collectionsModel.$collections,
  collectionsModel.$priceDollar,
  collectionsModel.$tokenIds,
  $activeCategory,
  $order,
  (collections, priceDollar, tokenIds, activeCategory, order) => {
    const itemsToSort = collections.categoriesAddresses?.[activeCategory]?.map((address) => {
      return {
        address,
        price: Number(priceDollar[address]?.result) || 0,
        tokenId: Number(tokenIds[address]?.result) || 0
      };
    });
    if (!itemsToSort) return collections.categoriesAddresses;
    const desc = order?.split?.('_')?.reverse()?.[0] === 'DESC';
    const source = {
      [SORT_TYPES.PRICE_ASC]: 'price',
      [SORT_TYPES.PRICE_DESC]: 'price',
      [SORT_TYPES.POPULAR_DESC]: 'tokenId',
      [SORT_TYPES.POPULAR_ASC]: 'tokenIds'
    }[order];
    const activeItems = sort(itemsToSort, source, desc)?.map((item) => item?.address);
    return {
      ...collections.categoriesAddresses,
      [activeCategory]: activeItems
    };
  }
);

const $items = combine(
  collectionsModel.$collections,
  {
    priceDollar: collectionsModel.$priceDollar,
    tokenIds: collectionsModel.$tokenIds
  },
  (collections, { order }) => {
    const sortItems = (items) => {
      return [...items].sort();
    };
  }
);

export const nftCardsModel = {
  NftCardsGate,
  $order,
  $sortedItems,
  $items,
  orderChanged
};
