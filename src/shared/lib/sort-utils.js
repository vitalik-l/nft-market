const compareBasic = (a, b) => (a === b ? 0 : a > b ? 1 : -1);

const basic = (rowA = {}, rowB = {}, source = '') => {
  let a = rowA[source];
  let b = rowB[source];

  a = typeof a === 'string' ? a.toLowerCase() : a;
  b = typeof b === 'string' ? b.toLowerCase() : b;

  return compareBasic(a, b);
};

export const sort = (arr = [], source = '', desc = false) => {
  console.log('sort', arr, source, desc)
  return [...arr].sort((a, b) => {
    const int = basic(a, b, source);
    if (int !== 0) {
      return desc ? -int : int;
    }
  });
};
