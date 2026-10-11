export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY' | 'CHF';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export type PaymentMethod = 'bank' | 'stripe' | 'paypal' | 'custom';

export interface PaymentDetails {
  method: PaymentMethod;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  stripeLink: string;
  paypalEmail: string;
  customNotes: string;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  taxId: string;
  website: string;
  logo: string | null;
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  taxId: string;
}

export interface AccentTheme {
  id: string;
  name: string;
  primary: string; // e.g. 'bg-slate-900 text-white'
  border: string;
  badge: string;
  text: string;
  hex: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  currency: CurrencyCode;
  business: BusinessInfo;
  client: ClientInfo;
  items: LineItem[];
  discountPercent: number;
  taxPercent: number;
  shippingFee: number;
  notes: string;
  terms: string;
  paymentDetails: PaymentDetails;
  themeId: string;
  enableSignature: boolean;
  signatureName: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: InvoiceData;
}
