import { createEffect, createStore, sample } from 'effector';
import { readContract, readContracts } from '@wagmi/core';
import { NFT_FACTORY_ADDRESS } from 'shared/config';
import { galleryFactoryAbi, nftAbi } from 'shared/abi';
import { logFxError } from 'shared/lib/log-fx-error';
import { useStoreMap, useUnit } from 'effector-react';
import { ghStatically } from '../../../shared/lib/gh-statically';
import { contractsReadFn } from '../../../shared/lib/contracts-read-fn';

const parseMetadata = (data) => {
  return {
    category: data?.category,
    name: {
      en: data?.name?.en,
      fr: data?.name?.fr,
      es: data?.name?.es
    },
    descriptionShort: {
      en: data?.descriptionShort?.en,
      fr: data?.descriptionShort?.fr,
      es: data?.descriptionShort?.es
    },
    description: {
      en: data?.description?.en,
      fr: data?.description?.fr,
      es: data?.description?.es
    },
    media:
      data?.media?.map?.((item) => ({
        url: item?.url,
        type: item?.type
      })) ?? []
  };
};

const collectionsListFx = createEffect(async () => {
  const instances = await readContract({
    address: NFT_FACTORY_ADDRESS,
    abi: galleryFactoryAbi,
    functionName: 'getInstances'
  });
  const tokenURIResults = await readContracts({
    contracts: instances?.map?.((address) => ({
      address,
      abi: nftAbi,
      functionName: 'tokenURI',
      args: [0]
    }))
  });
  const metadataUri =
    tokenURIResults
      ?.map((item, index) => ({ ...item, address: instances[index] }))
      ?.filter((item) => item.status === 'success') ?? [];
  const metadataResults = await Promise.allSettled(
    metadataUri.map((item) => fetch(ghStatically(item.result)).then((res) => res.json()))
  );
  const addresses = [];
  const metadata = {};
  const categories = new Map();
  for (let i = 0; i < metadataResults?.length; i++) {
    const { status, value } = metadataResults[i];
    if (status === 'fulfilled' && value?.disabled !== true) {
      const { address, result: tokenURI } = metadataUri[i];
      const category = value.category;
      if (category) {
        const categoryAddresses = categories.get(category) ?? [];
        if (!categoryAddresses?.length) {
          categories.set(category, categoryAddresses);
        }
        categoryAddresses.push(address);
      }
      addresses.push(address);
      metadata[address] = {
        ...parseMetadata(value),
        address,
        tokenURI
      };
    }
  }
  return {
    addresses,
    metadata,
    categories: Array.from(categories.keys()),
    categoriesAddresses: Object.fromEntries(categories)
  };
});
collectionsListFx.fail.watch(logFxError('collectionsListFx'));

const priceDollarFx = createEffect(contractsReadFn({ functionName: 'priceDollar' }));
priceDollarFx.fail.watch(logFxError('priceDollarFx'));

const amountLimitFx = createEffect(contractsReadFn({ functionName: 'amountLimit' }));
amountLimitFx.fail.watch(logFxError('amountLimitFx'));

const tokenIdFx = createEffect(contractsReadFn({ functionName: 'tokenId' }));
tokenIdFx.fail.watch(logFxError('tokenIdFx'));

const $collections = createStore({ addresses: [], metadata: {}, categories: [], categoriesAddresses: {} }).on(
  collectionsListFx.doneData,
  (_, data) => data
);
const $priceDollar = createStore({}).on(priceDollarFx.doneData, (_, data) => data);
const $amountLimit = createStore({}).on(amountLimitFx.doneData, (_, data) => data);
const $tokenIds = createStore({}).on(tokenIdFx.doneData, (state, data) => ({ ...state, ...data }));

sample({
  source: $collections,
  fn: ({ addresses }) => addresses,
  target: [priceDollarFx, amountLimitFx, tokenIdFx]
});

const useMetadata = (address) => useStoreMap($collections, (collections) => collections.metadata[address] ?? {});
const usePriceDollar = (address) => {
  const value = useStoreMap($priceDollar, (priceDollar) => Number(priceDollar[address]?.result));
  const isLoading = useUnit(priceDollarFx.pending);
  return { value, isLoading };
};
const useAmountLimit = (address) => {
  const value = useStoreMap($amountLimit, (amountLimit) => Number(amountLimit[address]?.result));
  const isLoading = useUnit(amountLimitFx.pending);
  return { value, isLoading };
};
const useTokenId = (address) => {
  const tokenId = useStoreMap($tokenIds, (tokenIds) => tokenIds[address]);
  const isLoading = useUnit(tokenIdFx.pending);
  const isError = !!tokenId?.error;
  return { isLoading, error: tokenId?.error, isError, value: Number(tokenId?.result) || 0 };
};

export const collectionsModel = {
  $collections,
  collectionsListFx,
  priceDollarFx,
  amountLimitFx,
  $priceDollar,
  $amountLimit,
  useMetadata,
  usePriceDollar,
  useAmountLimit,
  $tokenIds,
  useTokenId,
  tokenIdFx
};
