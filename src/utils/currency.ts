import { CurrencyCode, CurrencyConfig, LineItem } from '../types/invoice';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
};

export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const isZeroDecimal = currencyCode === 'JPY';

  const formattedNumber = Math.abs(amount).toLocaleString(config.locale, {
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  });

  const sign = amount < 0 ? '-' : '';

  if (currencyCode === 'EUR') {
    return `${sign}${formattedNumber} €`;
  }
  if (currencyCode === 'GBP') {
    return `${sign}£${formattedNumber}`;
  }
  if (currencyCode === 'INR') {
    return `${sign}₹${formattedNumber}`;
  }
  if (currencyCode === 'CAD') {
    return `${sign}CA$${formattedNumber}`;
  }
  if (currencyCode === 'AUD') {
    return `${sign}A$${formattedNumber}`;
  }
  if (currencyCode === 'JPY') {
    return `${sign}¥${formattedNumber}`;
  }
  if (currencyCode === 'CHF') {
    return `${sign}CHF ${formattedNumber}`;
  }

  return `${sign}$${formattedNumber}`;
}

export function calculateInvoiceSummary(
  items: LineItem[],
  discountPercent: number = 0,
  taxPercent: number = 0,
  shippingFee: number = 0
) {
  // Subtotal of line items
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  // Discount applied to subtotal
  const discountRate = Math.max(0, Number(discountPercent) || 0) / 100;
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  // Tax applied to discounted subtotal
  const taxRate = Math.max(0, Number(taxPercent) || 0) / 100;
  const taxAmount = Math.round(subtotalAfterDiscount * taxRate * 100) / 100;

  // Shipping or adjustment
  const shipping = Math.max(0, Number(shippingFee) || 0);

  // Grand Total
  const total = Math.round((subtotalAfterDiscount + taxAmount + shipping) * 100) / 100;

  return {
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    shipping,
    total,
  };
}
