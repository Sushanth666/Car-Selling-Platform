// Currency Conversion Utility for Apex Atelier India
// Base currency: INR (₹)
// Target currencies: INR (₹), USD ($), EUR (€), AED (د.إ)

export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rate: 1, // 1 INR = 1 INR
    format: (amount) => {
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
      } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} Lakh`;
      }
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 0.0116, // 1 INR ~ 0.0116 USD (86.2 INR per USD)
    format: (amount) => {
      const inUsd = amount * 0.0116;
      if (inUsd >= 1000000) {
        return `$${(inUsd / 1000000).toFixed(2)}M`;
      } else if (inUsd >= 1000) {
        return `$${(inUsd / 1000).toFixed(0)}K`;
      }
      return `$${Math.round(inUsd).toLocaleString('en-US')}`;
    }
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rate: 0.0108, // 1 INR ~ 0.0108 EUR (92.5 INR per EUR)
    format: (amount) => {
      const inEur = amount * 0.0108;
      if (inEur >= 1000000) {
        return `€${(inEur / 1000000).toFixed(2)}M`;
      } else if (inEur >= 1000) {
        return `€${(inEur / 1000).toFixed(0)}K`;
      }
      return `€${Math.round(inEur).toLocaleString('de-DE')}`;
    }
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rate: 0.0425, // 1 INR ~ 0.0425 AED (23.5 INR per AED)
    format: (amount) => {
      const inAed = amount * 0.0425;
      if (inAed >= 1000000) {
        return `AED ${(inAed / 1000000).toFixed(2)}M`;
      } else if (inAed >= 1000) {
        return `AED ${(inAed / 1000).toFixed(0)}K`;
      }
      return `AED ${Math.round(inAed).toLocaleString()}`;
    }
  }
};

export function formatPriceByCurrency(amountInInr, currencyCode = 'INR') {
  if (!amountInInr) return 'P.O.R.';
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  return currency.format(amountInInr);
}
