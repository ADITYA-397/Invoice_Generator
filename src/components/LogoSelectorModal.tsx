import React, { useRef } from 'react';
import { Upload, X, Shield, Box, Sparkles, Compass, Diamond, Globe } from 'lucide-react';

interface LogoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLogo: (logoUrl: string | null) => void;
  currentLogo: string | null;
}

const PRESET_SVGS = [
  {
    name: 'Prism Cube',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="20" fill="#0f172a"/><path d="M50 20L80 37V63L50 80L20 63V37L50 20Z" stroke="#38bdf8" stroke-width="6" stroke-linejoin="round"/><path d="M50 20V80M20 37L80 63M80 37L20 63" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.5"/></svg>`,
    icon: Box,
  },
  {
    name: 'Apex Shield',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="20" fill="#1e3a8a"/><path d="M50 22L76 32V54C76 68 65 77 50 82C35 77 24 68 24 54V32L50 22Z" fill="#3b82f6" stroke="#93c5fd" stroke-width="4"/><path d="M50 34L62 46H38L50 34Z" fill="#ffffff"/></svg>`,
    icon: Shield,
  },
  {
    name: 'Emerald Matrix',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="20" fill="#064e3b"/><circle cx="50" cy="50" r="28" stroke="#34d399" stroke-width="6"/><path d="M50 30V70M30 50H70" stroke="#a7f3d0" stroke-width="5" stroke-linecap="round"/></svg>`,
    icon: Sparkles,
  },
  {
    name: 'Nordic Compass',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="20" fill="#312e81"/><path d="M50 18L60 45L87 50L60 55L50 82L40 55L13 50L40 45L50 18Z" fill="#818cf8"/><circle cx="50" cy="50" r="8" fill="#ffffff"/></svg>`,
    icon: Compass,
  },
  {
    name: 'Crown Diamond',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="20" fill="#78350f"/><path d="M30 32H70L85 52L50 82L15 52L30 32Z" fill="#f59e0b" stroke="#fef3c7" stroke-width="3"/></svg>`,
    icon: Diamond,
  },
  {
    name: 'Global Nexus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none"><rect width="100" height="100" rx="20" fill="#881337"/><circle cx="50" cy="50" r="30" stroke="#fb7185" stroke-width="5"/><ellipse cx="50" cy="50" rx="14" ry="30" stroke="#fda4af" stroke-width="4"/><path d="M20 50H80" stroke="#fda4af" stroke-width="4"/></svg>`,
    icon: Globe,
  },
];

export const LogoSelectorModal: React.FC<LogoSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectLogo,
  currentLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        onSelectLogo(result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSvgSelect = (svgString: string) => {
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    onSelectLogo(dataUri);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Business Logo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Upload your custom logo or choose a preset</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5" data-lenis-prevent>
          {/* File Upload Box */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-900 block">
                  Click to upload image file
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  PNG, JPG, SVG, or WebP (max 2MB)
                </span>
              </div>
            </button>
          </div>

          {/* Preset Logos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Or Select Vector Preset
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_SVGS.map((preset) => {
                const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(preset.svg)}`;
                const isSelected = currentLogo === dataUri;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSvgSelect(preset.svg)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer group hover:border-slate-800 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden mb-2 shadow-2xs group-hover:scale-105 transition-transform"
                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                    />
                    <span className="text-[11px] font-medium text-slate-700 truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {currentLogo ? (
            <button
              type="button"
              onClick={() => {
                onSelectLogo(null);
                onClose();
              }}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              Remove Current Logo
            </button>
          ) : (
            <span className="text-xs text-slate-400">No logo set</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
