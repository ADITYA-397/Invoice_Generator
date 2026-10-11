import React, { useState } from 'react';
import { InvoiceData, LineItem, PaymentMethod } from '../types/invoice';
import { CURRENCIES, formatCurrency, calculateInvoiceSummary } from '../utils/currency';
import { ACCENT_THEMES } from '../constants/initialData';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Building2,
  Calendar,
  CreditCard,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface InvoiceSheetProps {
  invoice: InvoiceData;
  onChange: (updated: Partial<InvoiceData>) => void;
  onOpenLogoModal: () => void;
}

export const InvoiceSheet: React.FC<InvoiceSheetProps> = ({
  invoice,
  onChange,
  onOpenLogoModal,
}) => {
  const [activePaymentTab, setActivePaymentTab] = useState<PaymentMethod>(invoice.paymentDetails.method || 'bank');

  // Summary calculations
  const { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total } =
    calculateInvoiceSummary(
      invoice.items,
      invoice.discountPercent,
      invoice.taxPercent,
      invoice.shippingFee
    );

  const activeTheme = ACCENT_THEMES.find((t) => t.id === invoice.themeId) || ACCENT_THEMES[0];

  // Line Item Handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item_${Date.now()}`,
      description: '',
      quantity: 1,
      rate: 0,
    };
    onChange({ items: [...invoice.items, newItem] });
  };

  const handleUpdateItem = (index: number, updates: Partial<LineItem>) => {
    const updatedItems = invoice.items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onChange({ items: updatedItems });
  };

  const handleDeleteItem = (index: number) => {
    if (invoice.items.length <= 1) {
      // keep at least 1 row with blank fields
      onChange({
        items: [{ id: `item_${Date.now()}`, description: '', quantity: 1, rate: 0 }],
      });
      return;
    }
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    onChange({ items: updatedItems });
  };

  const handleDuplicateItem = (index: number) => {
    const itemToClone = invoice.items[index];
    const cloned: LineItem = {
      ...itemToClone,
      id: `item_${Date.now()}`,
    };
    const updatedItems = [...invoice.items];
    updatedItems.splice(index + 1, 0, cloned);
    onChange({ items: updatedItems });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= invoice.items.length) return;
    const itemsCopy = [...invoice.items];
    const [moved] = itemsCopy.splice(index, 1);
    itemsCopy.splice(targetIndex, 0, moved);
    onChange({ items: itemsCopy });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setActivePaymentTab(method);
    onChange({
      paymentDetails: {
        ...invoice.paymentDetails,
        method,
      },
    });
  };

  return (
    <div className="w-full flex justify-center pb-20">
      {/* Paper Invoice Container */}
      <div className="print-invoice-sheet w-full max-w-[860px] bg-white rounded-2xl border border-slate-200/90 shadow-xl print:shadow-none print:border-none p-8 sm:p-12 transition-all">
        {/* ======================================================== */}
        {/* HEADER SECTION: Business Name, Logo, Invoice #, Dates, Client */}
        {/* ======================================================== */}
        <div className="border-b border-slate-100 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Left Header: Business Logo & Details */}
            <div className="space-y-3 max-w-sm w-full">
              {/* Logo / Brand Mark */}
              <div className="flex items-center gap-3">
                {invoice.business.logo ? (
                  <div className="relative group inline-block">
                    <img
                      src={invoice.business.logo}
                      alt={invoice.business.name || 'Business Logo'}
                      referrerPolicy="no-referrer"
                      className="h-14 w-auto max-w-[200px] object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={onOpenLogoModal}
                      className="no-print absolute inset-0 bg-slate-900/60 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenLogoModal}
                    className="no-print flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-slate-900 hover:border-slate-800 hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>+ Add Business Logo</span>
                  </button>
                )}
              </div>

              {/* Business Name */}
              <div>
                <input
                  type="text"
                  value={invoice.business.name}
                  onChange={(e) =>
                    onChange({
                      business: { ...invoice.business, name: e.target.value },
                    })
                  }
                  placeholder="Your Business Name"
                  className="w-full text-2xl font-bold text-slate-900 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-400 focus:bg-slate-50/50 rounded-lg px-2 py-1 -mx-2 focus:outline-none transition-colors"
                />
              </div>

              {/* Business Contact Lines */}
              <div className="space-y-1 text-xs text-slate-600">
                <input
                  type="text"
                  value={invoice.business.address}
                  onChange={(e) =>
                    onChange({
                      business: { ...invoice.business, address: e.target.value },
                    })
                  }
                  placeholder="Street Address"
                  className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                />
                <input
                  type="text"
                  value={invoice.business.cityStateZip}
                  onChange={(e) =>
                    onChange({
                      business: { ...invoice.business, cityStateZip: e.target.value },
                    })
                  }
                  placeholder="City, State, ZIP Code"
                  className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={invoice.business.email}
                    onChange={(e) =>
                      onChange({
                        business: { ...invoice.business, email: e.target.value },
                      })
                    }
                    placeholder="billing@yourbusiness.com"
                    className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={invoice.business.phone}
                    onChange={(e) =>
                      onChange({
                        business: { ...invoice.business, phone: e.target.value },
                      })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
                {invoice.business.taxId && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Tax ID / VAT:</span>
                    <input
                      type="text"
                      value={invoice.business.taxId}
                      onChange={(e) =>
                        onChange({
                          business: { ...invoice.business, taxId: e.target.value },
                        })
                      }
                      placeholder="e.g. US-EIN-94-3829104"
                      className="text-xs font-mono text-slate-700 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1 py-0.5 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Header: Document Title & Metadata */}
            <div className="sm:text-right space-y-3 min-w-[240px]">
              <div className="flex sm:justify-end items-center gap-3">
                <span
                  className="text-3xl font-extrabold tracking-tight"
                  style={{ color: activeTheme.hex }}
                >
                  INVOICE
                </span>
                {invoice.status === 'paid' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PAID
                  </span>
                )}
              </div>

              {/* Invoice Number */}
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Invoice #:
                </span>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => onChange({ invoiceNumber: e.target.value })}
                  placeholder="INV-001"
                  className="font-mono font-semibold text-sm text-slate-900 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-2 py-0.5 text-left sm:text-right w-36 focus:outline-none"
                />
              </div>

              {/* Dates Grid */}
              <div className="space-y-1.5 text-xs">
                <div className="flex sm:justify-end items-center gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 no-print" />
                    <span>Issue Date:</span>
                  </span>
                  <input
                    type="date"
                    value={invoice.issueDate}
                    onChange={(e) => onChange({ issueDate: e.target.value })}
                    className="font-mono text-xs text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-2 py-0.5 focus:outline-none"
                  />
                </div>

                <div className="flex sm:justify-end items-center gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 no-print" />
                    <span>Due Date:</span>
                  </span>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => onChange({ dueDate: e.target.value })}
                    className="font-mono text-xs font-semibold text-slate-900 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-2 py-0.5 focus:outline-none"
                  />
                </div>

                <div className="flex sm:justify-end items-center gap-2">
                  <span className="text-slate-500 font-medium">Terms:</span>
                  <input
                    type="text"
                    value={invoice.paymentTerms}
                    onChange={(e) => onChange({ paymentTerms: e.target.value })}
                    placeholder="Net 30"
                    className="text-xs text-slate-700 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-2 py-0.5 text-left sm:text-right w-24 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bill To / Client Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-6 justify-between">
            <div className="max-w-md w-full">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Building2 className="w-3.5 h-3.5 no-print" />
                <span>Billed To (Client Details)</span>
              </div>
              <div className="space-y-1 text-xs">
                <input
                  type="text"
                  value={invoice.client.name}
                  onChange={(e) =>
                    onChange({
                      client: { ...invoice.client, name: e.target.value },
                    })
                  }
                  placeholder="Client Contact Name"
                  className="w-full font-semibold text-sm text-slate-900 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                />
                <input
                  type="text"
                  value={invoice.client.company}
                  onChange={(e) =>
                    onChange({
                      client: { ...invoice.client, company: e.target.value },
                    })
                  }
                  placeholder="Client Organization / Company"
                  className="w-full text-slate-700 font-medium placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                />
                <input
                  type="text"
                  value={invoice.client.address}
                  onChange={(e) =>
                    onChange({
                      client: { ...invoice.client, address: e.target.value },
                    })
                  }
                  placeholder="Client Street Address"
                  className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                />
                <input
                  type="text"
                  value={invoice.client.cityStateZip}
                  onChange={(e) =>
                    onChange({
                      client: { ...invoice.client, cityStateZip: e.target.value },
                    })
                  }
                  placeholder="Client City, State, ZIP"
                  className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <input
                    type="email"
                    value={invoice.client.email}
                    onChange={(e) =>
                      onChange({
                        client: { ...invoice.client, email: e.target.value },
                      })
                    }
                    placeholder="client@company.com"
                    className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={invoice.client.phone}
                    onChange={(e) =>
                      onChange({
                        client: { ...invoice.client, phone: e.target.value },
                      })
                    }
                    placeholder="Client Phone Number"
                    className="w-full text-slate-600 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Currency Banner / Badge */}
            <div className="sm:self-end text-left sm:text-right text-xs text-slate-500">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider mb-1">
                Base Currency
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 font-mono font-semibold text-slate-800">
                <span>{CURRENCIES[invoice.currency].symbol}</span>
                <span>{invoice.currency}</span>
                <span className="text-slate-400 font-normal">({CURRENCIES[invoice.currency].name})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ITEMIZED LINE ITEMS SECTION */}
        {/* ======================================================== */}
        <div className="mt-8 page-break-inside-avoid">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-left text-xs font-bold uppercase tracking-wider text-slate-900">
                  <th className="py-3 px-2 w-[52%]">Item & Description</th>
                  <th className="py-3 px-2 text-right w-[15%]">Hours / Qty</th>
                  <th className="py-3 px-2 text-right w-[16%]">Rate</th>
                  <th className="py-3 px-2 text-right w-[17%]">Subtotal</th>
                  <th className="py-3 px-1 text-center w-[40px] no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoice.items.map((item, index) => {
                  const itemAmount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Description */}
                      <td className="py-3 px-2 align-top">
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateItem(index, { description: e.target.value })
                          }
                          placeholder="Describe item or service rendered..."
                          className="w-full text-slate-800 placeholder:text-slate-300 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-white rounded px-2 py-1 -mx-2 focus:outline-none resize-none leading-relaxed"
                        />
                      </td>

                      {/* Hours / Quantity */}
                      <td className="py-3 px-2 text-right align-top">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(index, {
                              quantity: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="1"
                          className="w-full font-mono text-right text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-white rounded px-2 py-1 focus:outline-none tabular-nums"
                        />
                      </td>

                      {/* Unit Rate */}
                      <td className="py-3 px-2 text-right align-top">
                        <div className="flex items-center justify-end">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={item.rate === 0 ? '' : item.rate}
                            onChange={(e) =>
                              handleUpdateItem(index, {
                                rate: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="0.00"
                            className="w-full font-mono text-right text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-white rounded px-2 py-1 focus:outline-none tabular-nums"
                          />
                        </div>
                      </td>

                      {/* Line Subtotal */}
                      <td className="py-3 px-2 text-right align-top font-mono font-semibold text-slate-900 tabular-nums pt-4">
                        {formatCurrency(itemAmount, invoice.currency)}
                      </td>

                      {/* Row Action Controls (hidden on print) */}
                      <td className="py-3 px-1 text-center align-top no-print pt-3.5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleDuplicateItem(index)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                            title="Duplicate line"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveItem(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveItem(index, 'down')}
                            disabled={index === invoice.items.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete line"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Row Button (hidden on print) */}
          <div className="mt-3 flex items-center justify-between no-print pt-1">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>Add Line Item</span>
            </button>
            <span className="text-[11px] text-slate-400">
              {invoice.items.length} {invoice.items.length === 1 ? 'line item' : 'line items'}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FINANCIAL SUMMARY & TOTALS */}
        {/* ======================================================== */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-8 page-break-inside-avoid">
          {/* Notes & Terms Section (Left Column) */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Notes / Memo
              </label>
              <textarea
                rows={2}
                value={invoice.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
                placeholder="Notes to the client (e.g. thank you message or delivery info)..."
                className="w-full text-xs text-slate-700 placeholder:text-slate-300 border border-slate-100 hover:border-slate-200 focus:border-slate-300 rounded-lg p-2.5 focus:outline-none transition-colors leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Payment Terms & Conditions
              </label>
              <textarea
                rows={2}
                value={invoice.terms}
                onChange={(e) => onChange({ terms: e.target.value })}
                placeholder="Payment terms, late fee policy, or return terms..."
                className="w-full text-xs text-slate-600 placeholder:text-slate-300 border border-slate-100 hover:border-slate-200 focus:border-slate-300 rounded-lg p-2.5 focus:outline-none transition-colors leading-relaxed"
              />
            </div>
          </div>

          {/* Totals Breakdown (Right Column) */}
          <div className="w-full md:w-80 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-xs text-slate-600 py-1">
              <span>Subtotal:</span>
              <span className="font-mono font-medium tabular-nums text-slate-800">
                {formatCurrency(subtotal, invoice.currency)}
              </span>
            </div>

            {/* Discount Configurable Row */}
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span>Discount:</span>
                <div className="inline-flex items-center gap-0.5 no-print">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    value={invoice.discountPercent === 0 ? '' : invoice.discountPercent}
                    onChange={(e) =>
                      onChange({ discountPercent: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-10 text-center font-mono border border-slate-200 rounded px-1 py-0.5 text-xs focus:outline-none"
                  />
                  <span className="text-slate-500">%</span>
                </div>
                <span className="print:inline hidden font-mono">({invoice.discountPercent}%)</span>
              </div>
              <span className="font-mono text-slate-700 tabular-nums">
                {discountAmount > 0
                  ? `-${formatCurrency(discountAmount, invoice.currency)}`
                  : formatCurrency(0, invoice.currency)}
              </span>
            </div>

            {/* Tax Configurable Row */}
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span>Tax:</span>
                <div className="inline-flex items-center gap-0.5 no-print">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    value={invoice.taxPercent === 0 ? '' : invoice.taxPercent}
                    onChange={(e) =>
                      onChange({ taxPercent: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-12 text-center font-mono border border-slate-200 rounded px-1 py-0.5 text-xs focus:outline-none"
                  />
                  <span className="text-slate-500">%</span>
                </div>
                <span className="print:inline hidden font-mono">({invoice.taxPercent}%)</span>
              </div>
              <span className="font-mono text-slate-700 tabular-nums">
                {formatCurrency(taxAmount, invoice.currency)}
              </span>
            </div>

            {/* Final Total Display */}
            <div
              className="mt-3 pt-3 border-t-2 border-slate-900 flex items-baseline justify-between"
              style={{ borderColor: activeTheme.hex }}
            >
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-slate-900 tracking-tight block">
                  Total Due
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Currency: {invoice.currency}
                </span>
              </div>
              <span
                className="font-mono text-2xl font-extrabold tracking-tight tabular-nums"
                style={{ color: activeTheme.hex }}
              >
                {formatCurrency(total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PAYMENT INSTRUCTIONS SECTION */}
        {/* ======================================================== */}
        <div className="mt-10 pt-6 border-t border-slate-200 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-600 no-print" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Payment Instructions
              </h4>
            </div>

            {/* Payment Method Selector (no-print) */}
            <div className="no-print flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('bank')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activePaymentTab === 'bank'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bank Wire / ACH
              </button>
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('stripe')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activePaymentTab === 'stripe'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('paypal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activePaymentTab === 'paypal'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PayPal
              </button>
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('custom')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activePaymentTab === 'custom'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Payment Detail Card */}
          <div className="bg-slate-50/80 print:bg-transparent rounded-xl border border-slate-200/80 print:border-none p-4 text-xs">
            {activePaymentTab === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Bank Name</span>
                  <input
                    type="text"
                    value={invoice.paymentDetails.bankName}
                    onChange={(e) =>
                      onChange({
                        paymentDetails: {
                          ...invoice.paymentDetails,
                          bankName: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. JPMorgan Chase"
                    className="w-full font-semibold text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Account Name</span>
                  <input
                    type="text"
                    value={invoice.paymentDetails.accountName}
                    onChange={(e) =>
                      onChange({
                        paymentDetails: {
                          ...invoice.paymentDetails,
                          accountName: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Apex Studio LLC"
                    className="w-full text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Account # / IBAN</span>
                  <input
                    type="text"
                    value={invoice.paymentDetails.accountNumber}
                    onChange={(e) =>
                      onChange({
                        paymentDetails: {
                          ...invoice.paymentDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 1234567890"
                    className="w-full font-mono font-medium text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Routing #</span>
                  <input
                    type="text"
                    value={invoice.paymentDetails.routingNumber}
                    onChange={(e) =>
                      onChange({
                        paymentDetails: {
                          ...invoice.paymentDetails,
                          routingNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 021000021"
                    className="w-full font-mono text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">SWIFT / BIC Code</span>
                  <input
                    type="text"
                    value={invoice.paymentDetails.swiftBic}
                    onChange={(e) =>
                      onChange({
                        paymentDetails: {
                          ...invoice.paymentDetails,
                          swiftBic: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. CHASUS33"
                    className="w-full font-mono text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Wire Memo / Notes</span>
                  <input
                    type="text"
                    value={invoice.paymentDetails.customNotes}
                    onChange={(e) =>
                      onChange({
                        paymentDetails: {
                          ...invoice.paymentDetails,
                          customNotes: e.target.value,
                        },
                      })
                    }
                    placeholder="Reference invoice # in transfer"
                    className="w-full text-slate-700 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-0.5 -mx-1.5 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activePaymentTab === 'stripe' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Stripe Payment Link / Customer Portal
                </span>
                <input
                  type="url"
                  value={invoice.paymentDetails.stripeLink}
                  onChange={(e) =>
                    onChange({
                      paymentDetails: {
                        ...invoice.paymentDetails,
                        stripeLink: e.target.value,
                      },
                    })
                  }
                  placeholder="https://buy.stripe.com/..."
                  className="w-full font-mono text-xs text-blue-600 underline border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-1 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Clients can click or navigate directly to this Stripe checkout link to remit payment via credit card or Apple Pay.
                </p>
              </div>
            )}

            {activePaymentTab === 'paypal' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  PayPal Email / PayPal.me Link
                </span>
                <input
                  type="text"
                  value={invoice.paymentDetails.paypalEmail}
                  onChange={(e) =>
                    onChange({
                      paymentDetails: {
                        ...invoice.paymentDetails,
                        paypalEmail: e.target.value,
                      },
                    })
                  }
                  placeholder="payments@yourbusiness.com or paypal.me/yourusername"
                  className="w-full font-mono text-xs text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-1 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Please send funds to the above PayPal address.
                </p>
              </div>
            )}

            {activePaymentTab === 'custom' && (
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                  Custom Payment Instructions
                </span>
                <textarea
                  rows={2}
                  value={invoice.paymentDetails.customNotes}
                  onChange={(e) =>
                    onChange({
                      paymentDetails: {
                        ...invoice.paymentDetails,
                        customNotes: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter custom instructions (e.g. check remittance address, Wise, crypto wallet)..."
                  className="w-full text-xs text-slate-800 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded px-1.5 py-1 focus:outline-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Optional Signature Block */}
        {invoice.enableSignature && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end text-xs text-slate-500 page-break-inside-avoid">
            <div className="text-[11px] text-slate-400">
              Questions? Contact us at{' '}
              <span className="text-slate-600 font-medium">
                {invoice.business.email || 'billing'}
              </span>
            </div>

            <div className="text-right space-y-1 w-64">
              <div className="border-b border-slate-300 pb-1">
                <input
                  type="text"
                  value={invoice.signatureName}
                  onChange={(e) => onChange({ signatureName: e.target.value })}
                  placeholder="Authorized Representative"
                  className="w-full text-right font-medium text-slate-800 border border-transparent hover:border-slate-200 rounded px-1 py-0.5 focus:outline-none italic"
                />
              </div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Authorized Signature
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
