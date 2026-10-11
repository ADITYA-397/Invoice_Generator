import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { InvoiceData, SavedTemplate } from './types/invoice';
import { INITIAL_INVOICE, PRESET_TEMPLATES } from './constants/initialData';
import { HeaderNav } from './components/HeaderNav';
import { QuickControls } from './components/QuickControls';
import { InvoiceSheet } from './components/InvoiceSheet';
import { TemplateModal } from './components/TemplateModal';
import { LogoSelectorModal } from './components/LogoSelectorModal';
import { Check, HelpCircle, X } from 'lucide-react';

const STORAGE_KEY_DRAFT = 'invoicely_current_draft_v1';
const STORAGE_KEY_TEMPLATES = 'invoicely_saved_templates_v1';

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll with custom exponential easing
  useEffect(() => {
    // Exponential out easing curve for natural momentum and deceleration
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1.001 - Math.pow(2, -10 * t);
    };

    const lenis = new Lenis({
      duration: 1.2,
      easing: easeOutExpo,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Load initial draft from localStorage if available
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch {
      // ignore JSON parse error
    }
    return INITIAL_INVOICE;
  });

  // Load saved templates from localStorage
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Modals state
  const [templateModalMode, setTemplateModalMode] = useState<'save' | 'load'>('save');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPrintTips, setShowPrintTips] = useState(false);

  // Auto-persist draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(invoice));
    } catch (e) {
      console.error('Failed to auto-save draft to localStorage', e);
    }
  }, [invoice]);

  // Persist templates to localStorage
  const persistTemplates = (templates: SavedTemplate[]) => {
    setSavedTemplates(templates);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
    } catch (e) {
      console.error('Failed to persist templates to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Handlers
  const handleUpdateInvoice = (updated: Partial<InvoiceData>) => {
    setInvoice((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleDownloadPdf = () => {
    // Dynamically set title for the browser's PDF save filename
    const originalTitle = document.title;
    const clientSlug = (invoice.client.company || invoice.client.name || 'Client')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    const invoiceNumSlug = (invoice.invoiceNumber || 'Invoice').replace(/[^a-zA-Z0-9-_]/g, '');

    document.title = `${invoiceNumSlug}_${clientSlug}`;

    window.print();

    // Restore title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleSaveAsTemplate = (name: string) => {
    const newTemplate: SavedTemplate = {
      id: `tpl_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { ...invoice },
    };
    const updated = [newTemplate, ...savedTemplates];
    persistTemplates(updated);
    showToast(`Template "${name}" saved to browser localStorage`);
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    setInvoice({
      ...template.data,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    showToast(`Loaded "${template.name}" template`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updated = savedTemplates.filter((t) => t.id !== templateId);
    persistTemplates(updated);
    showToast('Template deleted');
  };

  const handleReset = () => {
    if (confirm('Reset to initial sample invoice? Current unsaved edits will be replaced.')) {
      setInvoice({
        ...INITIAL_INVOICE,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      showToast('Reset to default sample invoice');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Bar Contract Navigation */}
      <HeaderNav
        onDownloadPdf={handleDownloadPdf}
        onOpenSaveModal={() => {
          setTemplateModalMode('save');
          setIsTemplateModalOpen(true);
        }}
        onOpenTemplatesModal={() => {
          setTemplateModalMode('load');
          setIsTemplateModalOpen(true);
        }}
        onReset={handleReset}
        savedTemplatesCount={savedTemplates.length}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-0">
        {/* Quick Config Bar */}
        <QuickControls invoice={invoice} onChange={handleUpdateInvoice} />

        {/* Informational Tip Bar */}
        <div className="no-print mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-500 bg-white border border-slate-200/80 rounded-xl p-3 sm:px-4 sm:py-2.5 shadow-2xs min-w-0">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <span className="font-bold text-slate-800 shrink-0">Live Editor:</span>
            <span className="text-slate-600 leading-snug break-words">Click any text or number directly on the document sheet to edit in real time.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowPrintTips(!showPrintTips)}
            className="self-start sm:self-auto flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-medium cursor-pointer shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>PDF Print Tips</span>
          </button>
        </div>

        {/* Print Tips Drawer (optional expandable) */}
        {showPrintTips && (
          <div className="no-print mb-6 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 relative min-w-0">
            <button
              onClick={() => setShowPrintTips(false)}
              className="absolute top-3 right-3 text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="font-semibold text-emerald-950 mb-1 flex items-center gap-1.5">
              <span>Pro-tip for pristine PDF export:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-800">
              <li>In the Print dialog, select <strong>Destination: Save as PDF</strong>.</li>
              <li>Under More settings, check <strong>"Background graphics"</strong> so headers and accent badges appear.</li>
              <li>Set <strong>Margins: Default or None</strong> for edge-to-edge alignment.</li>
            </ul>
          </div>
        )}

        {/* The Live Interactive Invoice Sheet */}
        <InvoiceSheet
          invoice={invoice}
          onChange={handleUpdateInvoice}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
        />
      </main>

      {/* Footer (Anti-Slop: Quiet copyright and clean action) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500 w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Invoicely</span>
            <span>·</span>
            <span>Interactive Professional Invoice Studio</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-slate-400 flex-wrap justify-center sm:justify-end">
            <span>Client-side auto-save enabled</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="text-slate-700 hover:text-slate-900 font-medium underline underline-offset-2 cursor-pointer"
            >
              Download PDF
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        mode={templateModalMode}
        currentInvoice={invoice}
        savedTemplates={savedTemplates}
        presetTemplates={PRESET_TEMPLATES}
        onSaveTemplate={handleSaveAsTemplate}
        onLoadTemplate={handleLoadTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />

      <LogoSelectorModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onSelectLogo={(logoUrl) =>
          handleUpdateInvoice({
            business: { ...invoice.business, logo: logoUrl },
          })
        }
        currentLogo={invoice.business.logo}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
