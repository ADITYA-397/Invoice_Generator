import React from 'react';
import { CurrencyCode, InvoiceData } from '../types/invoice';
import { CURRENCIES } from '../utils/currency';
import { ACCENT_THEMES } from '../constants/initialData';
import { DollarSign, Calendar, Percent, Palette, CheckCircle2 } from 'lucide-react';

interface QuickControlsProps {
  invoice: InvoiceData;
  onChange: (updated: Partial<InvoiceData>) => void;
}

export const QuickControls: React.FC<QuickControlsProps> = ({ invoice, onChange }) => {
  const handleCurrencyChange = (code: CurrencyCode) => {
    onChange({ currency: code });
  };

  const handleDuePreset = (days: number, termsName: string) => {
    const issueTime = invoice.issueDate ? new Date(invoice.issueDate).getTime() : Date.now();
    const newDueDate = new Date(issueTime + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    onChange({
      dueDate: newDueDate,
      paymentTerms: termsName,
    });
  };

  const handleTaxPreset = (tax: number) => {
    onChange({ taxPercent: tax });
  };

  const handleDiscountPreset = (discount: number) => {
    onChange({ discountPercent: discount });
  };

  return (
    <div className="no-print w-full bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-xs mb-4 sm:mb-6 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 min-w-0">
        {/* 1. Currency Selector */}
        <div className="space-y-1.5 min-w-0">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Currency</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {(['USD', 'EUR', 'GBP', 'INR', 'CAD'] as CurrencyCode[]).map((curr) => {
              const info = CURRENCIES[curr];
              const isSelected = invoice.currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleCurrencyChange(curr)}
                  className={`h-8 px-2 sm:px-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono mr-1">{info.symbol}</span>
                  <span>{curr}</span>
                </button>
              );
            })}
            <select
              value={invoice.currency}
              onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
              className="h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-[90px] flex-1 sm:flex-initial"
              aria-label="More Currencies"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CHF">CHF (CHF)</option>
            </select>
          </div>
        </div>

        {/* 2. Due Date Presets */}
        <div className="space-y-1.5 min-w-0">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Payment Terms Preset</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {[
              { label: 'Receipt', days: 0, term: 'Due on Receipt' },
              { label: 'Net 15', days: 15, term: 'Net 15' },
              { label: 'Net 30', days: 30, term: 'Net 30' },
              { label: 'Net 60', days: 60, term: 'Net 60' },
            ].map((p) => {
              const isSelected = invoice.paymentTerms === p.term;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleDuePreset(p.days, p.term)}
                  className={`h-8 px-2 sm:px-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Financial Presets (Tax & Discount) */}
        <div className="space-y-1.5 min-w-0">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Percent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Tax & Discount Quick Sets</span>
          </label>
          <div className="space-y-2 min-w-0">
            {/* Tax Row */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-xs font-medium text-slate-500 w-8 sm:w-9 shrink-0">Tax:</span>
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                {[0, 8.25, 10, 18, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleTaxPreset(rate)}
                    className={`h-7 px-2 text-xs rounded-md transition-colors cursor-pointer border ${
                      invoice.taxPercent === rate
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Row */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-xs font-medium text-slate-500 w-8 sm:w-9 shrink-0">Disc:</span>
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                {[0, 5, 10, 15].map((disc) => (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => handleDiscountPreset(disc)}
                    className={`h-7 px-2 text-xs rounded-md transition-colors cursor-pointer border ${
                      invoice.discountPercent === disc
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {disc}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Accent Palette & Invoice Status */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Accent & Status</span>
            </span>
            <span className="flex items-center gap-1 font-normal text-slate-400 capitalize">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{invoice.status}</span>
            </span>
          </div>
          <div className="space-y-2 min-w-0">
            {/* Color Swatches */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {ACCENT_THEMES.map((theme) => {
                const isSelected = invoice.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onChange({ themeId: theme.id })}
                    title={theme.name}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center shrink-0 ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-xs' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: theme.hex }}
                  />
                );
              })}
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-xs text-slate-500 shrink-0">Status:</span>
              <select
                value={invoice.status}
                onChange={(e) => onChange({ status: e.target.value as InvoiceData['status'] })}
                className="h-7 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2 text-slate-800 hover:bg-slate-100 cursor-pointer focus:outline-none flex-1 sm:flex-initial min-w-[90px]"
                aria-label="Invoice Status"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
