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
    <div className="no-print w-full bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Currency Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Currency</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['USD', 'EUR', 'GBP', 'CAD'] as CurrencyCode[]).map((curr) => {
              const info = CURRENCIES[curr];
              const isSelected = invoice.currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
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
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400"
              aria-label="More Currencies"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CHF">CHF (CHF)</option>
            </select>
          </div>
        </div>

        {/* Due Date Presets */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Payment Terms Preset</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
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
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
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

        {/* Financial Presets (Tax & Discount) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <Percent className="w-3.5 h-3.5 text-slate-400" />
            <span>Tax & Discount Quick Sets</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">Tax:</span>
              {[0, 8.25, 10, 20].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleTaxPreset(rate)}
                  className={`px-1.5 py-0.5 text-xs rounded transition-colors cursor-pointer border ${
                    invoice.taxPercent === rate
                      ? 'bg-slate-800 text-white border-slate-800 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-slate-500">Disc:</span>
              {[0, 5, 10].map((disc) => (
                <button
                  key={disc}
                  type="button"
                  onClick={() => handleDiscountPreset(disc)}
                  className={`px-1.5 py-0.5 text-xs rounded transition-colors cursor-pointer border ${
                    invoice.discountPercent === disc
                      ? 'bg-slate-800 text-white border-slate-800 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {disc}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accent Palette & Invoice Status */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Accent Color</span>
            </span>
            <span className="flex items-center gap-1 font-normal text-slate-400 capitalize">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{invoice.status}</span>
            </span>
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {ACCENT_THEMES.map((theme) => {
                const isSelected = invoice.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onChange({ themeId: theme.id })}
                    title={theme.name}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: theme.hex }}
                  />
                );
              })}
            </div>

            <select
              value={invoice.status}
              onChange={(e) => onChange({ status: e.target.value as InvoiceData['status'] })}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
              aria-label="Invoice Status"
            >
              <option value="draft">Status: Draft</option>
              <option value="pending">Status: Pending</option>
              <option value="paid">Status: Paid</option>
              <option value="overdue">Status: Overdue</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
