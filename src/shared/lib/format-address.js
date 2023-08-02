export const formatAddress = (address, lengthStart = 5, lengthEnd = 3) => {
  if (!address) return '';
  return `${address.slice(0, lengthStart)}...${address.slice(address.length - lengthEnd)}`;
};
