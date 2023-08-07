import { readContracts } from '@wagmi/core';
import { nftAbi } from '../abi';

export const contractsReadFn = (params) => async (addresses) => {
  if (!addresses) return {};
  // don't read from mocked addresses
  const realAddresses = addresses?.filter((address) => !address?.startsWith('fake'));
  const results = await readContracts({
    contracts: realAddresses?.map((address) => ({
      address,
      abi: nftAbi,
      ...params
    }))
  });
  return realAddresses?.reduce((acc, address, index) => {
    acc[address] = results[index];
    return acc;
  }, {});
};
