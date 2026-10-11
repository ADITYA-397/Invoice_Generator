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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-xs">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Invoicely
          </span>
        </div>

        {/* Zone 2: Navigation / Functional Action Tabs (Desktop & Tablet) */}
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

        {/* Zone 3: Primary Action CTA & Mobile Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="md:hidden p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset sample"
            aria-label="Reset sample"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenTemplatesModal}
            className="md:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
            title={`Templates (${savedTemplatesCount})`}
            aria-label="Open templates"
          >
            <FolderOpen className="w-4 h-4" />
            {savedTemplatesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSaveModal}
            className="md:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Save as Template"
            aria-label="Save as template"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs hover:shadow cursor-pointer active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden font-medium">Download</span>
          </button>
        </div>
      </div>
    </header>
  );
};
