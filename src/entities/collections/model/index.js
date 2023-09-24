import { createEffect, createEvent, createStore, sample } from 'effector';
import { logFxError } from 'shared/lib/log-fx-error';
import { useStoreMap, useUnit } from 'effector-react';
import { contractsReadFn } from '../../../shared/lib/contracts-read-fn';
import { backendApi } from '../../../shared/api/backend';
import { $locale } from '../../../shared/i18n';
import { toast } from '../../../shared/ui-kit/toast';
import { configModel } from '../../../shared/config/model';

const categoriesFx = createEffect(backendApi.getCategories);
sample({
  source: categoriesFx.fail,
  fn: () => ({ type: 'error', content: 'Failed to get categories', title: 'Server Error' }),
  target: toast
});

const $categories = createStore([]).on(categoriesFx.doneData, (_, response) => {
  return response?.data ?? [];
});

// const itemsFx = createEffect(({ locale, chain, category }) =>
//   backendApi.getItems({ locale, chainId: chain?.id, categoryId: category?.id })
// );

const $items = createStore({ byCategory: {}, byAddress: {} }).on(categoriesFx.done, (state, payload) => {
  const byAddress = { ...state.byAddress };
  const byCategory = { ...state.byCategory };
  payload.result?.data?.forEach((category) => {
    const items = category?.attributes?.items?.data;
    byCategory[category?.attributes?.slug] = items;
    items.forEach((item) => {
      const address = item?.attributes?.address?.toLowerCase();
      if (!address) return;
      byAddress[address] = {
        category,
        ...item
      };
    });
  });
  return {
    byCategory,
    byAddress
  };
});

// const runItemsFxOnCategory = (categorySlugClock) => {
//   sample({
//     clock: categorySlugClock,
//     source: { locale: $locale, categories: collectionsModel.$categories, chain: configModel.$chain, items: $items },
//     filter: ({ items }, categorySlug) => !items.byCategory[categorySlug],
//     fn: ({ locale, categories, chain }, categorySlug) => ({
//       locale,
//       chain,
//       category: categories.find((item) => item.attributes.slug === categorySlug)
//     }),
//     target: collectionsModel.itemsFx
//   });
// };

const priceDollarFx = createEffect(contractsReadFn({ functionName: 'priceDollar' }));
priceDollarFx.fail.watch(logFxError('priceDollarFx'));

const amountLimitFx = createEffect(contractsReadFn({ functionName: 'amountLimit' }));
amountLimitFx.fail.watch(logFxError('amountLimitFx'));

const tokenIdFx = createEffect(contractsReadFn({ functionName: 'tokenId' }));
tokenIdFx.fail.watch(logFxError('tokenIdFx'));

const $priceDollar = createStore({}).on(priceDollarFx.doneData, (state, data) => ({
  ...state,
  ...data
}));

const $amountLimit = createStore({}).on(amountLimitFx.doneData, (state, data) => ({
  ...state,
  ...data
}));

const $tokenIds = createStore({}).on(tokenIdFx.doneData, (state, data) => ({
  ...state,
  ...data
}));

sample({
  source: $items,
  filter: ({ byAddress }) => !!Object.keys(byAddress)?.length,
  fn: ({ byAddress }) => Object.keys(byAddress),
  target: [priceDollarFx, amountLimitFx, tokenIdFx]
});

const useItemByAddress = (address) => useStoreMap($items, (items) => items.byAddress[address] ?? {});

const usePriceDollar = (address) => {
  const value = useStoreMap($priceDollar, (priceDollar) => {
    return Number(priceDollar[address?.toLowerCase()]?.result) || 0;
  });
  const isLoading = useUnit(priceDollarFx.pending);
  return { value, isLoading };
};

const useAmountLimit = (address) => {
  const value = useStoreMap($amountLimit, (amountLimit) => Number(amountLimit[address?.toLowerCase()]?.result) || 0);
  const isLoading = useUnit(amountLimitFx.pending);
  return { value, isLoading };
};

const useTokenId = (address) => {
  const tokenId = useStoreMap($tokenIds, (tokenIds) => tokenIds[address?.toLowerCase()]);
  const isLoading = useUnit(tokenIdFx.pending);
  const isError = !!tokenId?.error;
  return { isLoading, error: tokenId?.error, isError, value: Number(tokenId?.result) || 0 };
};

sample({
  source: [$locale, configModel.$chain],
  filter: ([locale, chain]) => !!locale && !!chain,
  fn: ([locale, chain]) => ({ locale, chainEntityId: chain.id }),
  target: categoriesFx
});

export const collectionsModel = {
  priceDollarFx,
  amountLimitFx,
  $priceDollar,
  $amountLimit,
  useItemByAddress,
  usePriceDollar,
  useAmountLimit,
  $tokenIds,
  useTokenId,
  tokenIdFx,
  $categories,
  $items,
  categoriesFx
};
