import { polygonMumbai, polygon } from '@wagmi/core/chains';

export const CHAIN_CONFIG = { 80001: polygonMumbai, 137: polygon }[process.env.REACT_APP_CHAIN_ID];

export const NFT_FACTORY_ADDRESS = process.env.REACT_APP_ADDRESS_NFT_FACTORY;

export const CATEGORIES = { celebrity_items: 'celebrity items', artwork: 'artwork', modern_art: 'modern art' };
export const CATEGORIES_KEYS = Object.keys(CATEGORIES);

export const CATEGORY_KEY = CATEGORIES_KEYS.reduce((acc, key) => {
  acc[CATEGORIES[key]] = key;
  return acc;
}, {});

export const STABLECOIN_ADDRESS = {
  USDT: process.env.REACT_APP_ADDRESS_USDT,
  USDC: process.env.REACT_APP_ADDRESS_USDC
};

export const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
export const WALLET_CONNECT_PROJECT_ID = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

export const MaxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
