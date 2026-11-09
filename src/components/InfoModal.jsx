import React from 'react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Fixed Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-primary-container flex items-center justify-center text-m3-on-primary-container shrink-0">
              <span className="material-symbols-rounded text-[22px] filled">auto_awesome</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-m3-on-surface font-display leading-tight m-0">
                How Image Resizer Web Works
              </h3>
              <p className="text-xs text-m3-on-surface-variant leading-normal m-0 mt-0.5">
                100% Client-Side Canvas Engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full text-m3-on-surface-variant hover:text-m3-on-surface bg-m3-surface-container-high hover:bg-m3-surface-container-highest flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body with Contained Scrollbar */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 flex-1 custom-modal-scrollbar space-y-4 text-sm text-m3-on-surface">
          <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-m3-primary">
              <span className="material-symbols-rounded text-[18px] filled text-m3-success">verified_user</span>
              <span>100% In-Browser & Zero Cloud Uploads</span>
            </div>
            <p className="text-xs text-m3-on-surface-variant leading-relaxed m-0">
              Every operation runs locally using browser HTML5 Canvas and `canvas.toBlob`. Your files are never sent over the Internet, safeguarding private identity documents, signatures, and confidential imagery.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-m3-primary">
              <span className="material-symbols-rounded text-[18px] filled text-m3-secondary">tune</span>
              <span>Target KB Binary Search Tuning (±2 KB)</span>
            </div>
            <p className="text-xs text-m3-on-surface-variant leading-relaxed m-0">
              When a target size like 20 KB, 50 KB, 100 KB, or 200 KB is requested, our engine runs a sub-millisecond binary search over the quality parameter. It reliably hits your requested size within <strong className="text-m3-success font-semibold">±2 KB</strong> without unnecessary compression artifacts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-m3-primary">
              <span className="material-symbols-rounded text-[18px] filled text-m3-tertiary">straighten</span>
              <span>Physical Units (Pixels / mm / cm) & Print DPI</span>
            </div>
            <p className="text-xs text-m3-on-surface-variant leading-relaxed m-0">
              Easily meet official job application and passport photo specifications (such as 35×45 mm under 50 KB). Physical dimensions are computed according to your specified DPI (96 DPI screen or 300 DPI high-definition print).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-m3-primary">
              <span className="material-symbols-rounded text-[18px] filled text-m3-primary">high_quality</span>
              <span>Cascaded Downsampling for Zero Blurring</span>
            </div>
            <p className="text-xs text-m3-on-surface-variant leading-relaxed m-0">
              Stepped bilinear downsampling with `imageSmoothingQuality = 'high'` prevents the aliasing and blurriness commonly caused by single-step large downsizes, keeping fine text and sharp edges crisp.
            </p>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 sm:p-5 border-t border-m3-outline-variant/30 flex-shrink-0 flex justify-end bg-m3-surface-container-low/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-m3-primary text-m3-on-primary hover:brightness-110 transition active:scale-95 cursor-pointer shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
