import React from 'react';
import { Printer, BookmarkPlus, FolderOpen, RefreshCw, FileText } from 'lucide-react';

interface HeaderNavProps {
  onDownloadPdf: () => void;
  onOpenSaveModal: () => void;
  onOpenTemplatesModal: () => void;
  onReset: () => void;
  savedTemplatesCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onDownloadPdf,
  onOpenSaveModal,
  onOpenTemplatesModal,
  onReset,
  savedTemplatesCount,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Invoicely
          </span>
        </div>

        {/* Zone 2: Navigation / Functional Action Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onOpenTemplatesModal}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-700 font-medium"
          >
            <FolderOpen className="w-4 h-4 text-slate-500" />
            <span>Templates ({savedTemplatesCount})</span>
          </button>

          <button
            type="button"
            onClick={onOpenSaveModal}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-700 font-medium"
          >
            <BookmarkPlus className="w-4 h-4 text-slate-500" />
            <span>Save as Template</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Reset to sample data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Save as Template"
          >
            <BookmarkPlus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenTemplatesModal}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Open Templates"
          >
            <FolderOpen className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs hover:shadow cursor-pointer active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
