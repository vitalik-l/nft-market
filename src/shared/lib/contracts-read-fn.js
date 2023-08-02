import { readContracts } from '@wagmi/core';
import { nftAbi } from '../abi';

export const contractsReadFn = (params) => async (addresses) => {
  if (!addresses) return {};
  const results = await readContracts({
    contracts: addresses?.map((address) => ({
      address,
      abi: nftAbi,
      ...params
    }))
  });
  return addresses?.reduce((acc, address, index) => {
    acc[address] = results[index];
    return acc;
  }, {});
};
