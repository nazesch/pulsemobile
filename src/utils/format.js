// Exchange rates from XE.com (as of reference date)
const EXCHANGE_RATES = {
  USD: { USD: 1, COP: 3775.58, EUR: 0.8564 },
  COP: { USD: 0.00026486, COP: 1, EUR: 0.00022683 },
  EUR: { USD: 1.1676, COP: 4408.33, EUR: 1 },
}

export function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount
  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency]
  if (!rate) return amount
  return amount * rate
}

export function formatCurrency(amount, currency = 'USD') {
  const currencyMap = {
    USD: { code: 'USD', symbol: '$', locale: 'en-US' },
    COP: { code: 'COP', symbol: '$', locale: 'es-CO' },
    EUR: { code: 'EUR', symbol: '€', locale: 'en-US' }, // Use en-US to ensure € appears before number
  }

  const config = currencyMap[currency] || currencyMap.USD

  // For EUR, manually format to ensure symbol is always before the number
  if (currency === 'EUR') {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
    return `€${formatted}`
  }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount)
}

