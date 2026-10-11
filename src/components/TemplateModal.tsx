import React, { useState } from 'react';
import { SavedTemplate, InvoiceData } from '../types/invoice';
import { formatCurrency, calculateInvoiceSummary } from '../utils/currency';
import { X, BookmarkPlus, FolderOpen, Trash2, ArrowRight, Check, Sparkles } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
  currentInvoice: InvoiceData;
  savedTemplates: SavedTemplate[];
  presetTemplates: SavedTemplate[];
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  currentInvoice,
  savedTemplates,
  presetTemplates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
}) => {
  const [mode, setMode] = useState<'save' | 'load'>(initialMode);
  const [templateName, setTemplateName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'save') {
      const defaultName = `${currentInvoice.business.name || 'Invoice'} - ${currentInvoice.paymentTerms || 'Standard'}`;
      setTemplateName(defaultName);
    }
  }, [initialMode, isOpen, currentInvoice]);

  if (!isOpen) return null;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;
    onSaveTemplate(templateName.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMode('load')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'load'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Load Template</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('save')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'save'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5 shrink-0" />
              <span>Save Current</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6" data-lenis-prevent>
          {mode === 'save' ? (
            /* Save Mode Form */
            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Monthly Consulting Retainer"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none transition-all"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  This stores your business details, line item formats, tax rate, and payment instructions in your browser's local storage.
                </p>
              </div>

              {/* Preview summary of what is being saved */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-slate-700">Snapshot Summary:</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Business: </span>
                    <span className="font-medium text-slate-800">{currentInvoice.business.name || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Client: </span>
                    <span className="font-medium text-slate-800">{currentInvoice.client.company || currentInvoice.client.name || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Line Items: </span>
                    <span className="font-medium text-slate-800">{currentInvoice.items.length} items</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Currency & Total: </span>
                    <span className="font-medium text-slate-800 font-mono">
                      {formatCurrency(calculateInvoiceSummary(currentInvoice.items, currentInvoice.discountPercent, currentInvoice.taxPercent, currentInvoice.shippingFee).total, currentInvoice.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess || !templateName.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save as Template</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Load Mode List */
            <div className="space-y-6">
              {/* User Saved Templates */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    My Saved Templates ({savedTemplates.length})
                  </span>
                  <span className="text-xs text-slate-400">Stored in browser localStorage</span>
                </div>

                {savedTemplates.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <p className="text-xs text-slate-500">No saved templates yet.</p>
                    <button
                      type="button"
                      onClick={() => setMode('save')}
                      className="mt-2 text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
                    >
                      Save your current invoice as the first template
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedTemplates.map((template) => {
                      const summary = calculateInvoiceSummary(
                        template.data.items,
                        template.data.discountPercent,
                        template.data.taxPercent,
                        template.data.shippingFee
                      );
                      return (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-800 bg-white hover:bg-slate-50/50 transition-all group"
                        >
                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold text-slate-900">
                              {template.name}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span>{template.data.items.length} items</span>
                              <span>·</span>
                              <span className="font-mono text-slate-700 font-medium">
                                {formatCurrency(summary.total, template.data.currency)}
                              </span>
                              <span>·</span>
                              <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onDeleteTemplate(template.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete template"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onLoadTemplate(template);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <span>Apply</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* System Preset Starter Templates */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Ready-To-Use Industry Starters
                  </span>
                </div>
                <div className="space-y-2">
                  {presetTemplates.map((template) => {
                    const summary = calculateInvoiceSummary(
                      template.data.items,
                      template.data.discountPercent,
                      template.data.taxPercent,
                      template.data.shippingFee
                    );
                    return (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/70 transition-all"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {template.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{template.data.business.name}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-700 font-medium">
                              {formatCurrency(summary.total, template.data.currency)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onLoadTemplate(template);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>Load Preset</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
