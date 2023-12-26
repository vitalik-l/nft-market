const localizeNumber = (value, options) =>
  Number(value || 0).toLocaleString('en', {
    maximumFractionDigits: 20,
    ...options
  });

export const usd = (value, digits = 0) =>
  localizeNumber(value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
