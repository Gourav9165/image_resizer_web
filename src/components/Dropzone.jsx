import React, { useState, useRef, useEffect } from 'react';

export default function Dropzone({
  activeExam = null,
  activeTool = null,
  mode = 'manual',
  sscPreset = null,
  onResetToGeneral,
  onFileSelected,
  onSampleSelected,
  isLoadingSample = false,
}) {
  const isBankingActive = activeExam?.category === 'Banking (IBPS / SBI)' || mode === 'banking';
  const isRrbActive = activeExam?.category === 'Railways (RRB)' || mode === 'rrb';
  const isPscActive = activeExam?.category === 'State PSC' || mode === 'psc';
  const isUpscActive = activeExam?.category === 'UPSC' || mode === 'upsc';
  const isPassportActive = activeTool === 'passport' || activeExam?.slug === 'passport-size-photo-maker';
  const isExamActive =
    Boolean(activeExam) ||
    mode === 'ssc' ||
    isRrbActive ||
    isBankingActive ||
    isPscActive ||
    isUpscActive;

  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleValidFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleValidFile = (file) => {
    setErrorMessage('');
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported format. Please choose a JPG, PNG, or WebP image.');
      return;
    }
    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidFile(e.target.files[0]);
    }
  };

  // Header Title & Subtitle computation
  let toolTitle = 'Upload Image to Workspace';
  let toolSubtitle = 'Supports JPG, PNG, WebP • 100% private in-browser processing';

  if (activeExam) {
    toolTitle = (
      <span>
        {activeExam.title ? activeExam.title.split('(')[0] : activeExam.examShortName}{' '}
        <span className="text-m3-primary block sm:inline text-2xl sm:text-4xl">
          ({activeExam.specs?.minKB ?? 10}KB – {activeExam.specs?.maxKB ?? 49}KB)
        </span>
      </span>
    );
    toolSubtitle = (
      <span>
        Pre-configured for <strong className="text-m3-on-surface">{activeExam.examFullName || activeExam.examShortName}</strong> • Validated for{' '}
        {activeExam.specs?.unit === 'px'
          ? `${activeExam.specs.widthPx} × ${activeExam.specs.heightPx} px (${activeExam.specs.widthCm} × ${activeExam.specs.heightCm} cm)`
          : `${activeExam.specs?.widthCm ?? 5.0} × ${activeExam.specs?.heightCm ?? 2.0} cm`}{' '}
        at {activeExam.specs?.dpi ?? 200} DPI.
      </span>
    );
  } else if (activeTool === 'compress') {
    toolTitle = (
      <span>
        Compress Image to <span className="text-m3-primary">Exact Target KB</span>
      </span>
    );
    toolSubtitle = 'Reduce file size to 20 KB, 50 KB, 100 KB, or custom target KB with client-side binary search.';
  } else if (activeTool === 'resize') {
    toolTitle = (
      <span>
        Resize Image <span className="text-m3-primary">Pixel &amp; CM Dimensions</span>
      </span>
    );
    toolSubtitle = 'Scale width and height in Pixels, cm, or mm with print resolution (DPI) & aspect ratio lock.';
  } else if (activeTool === 'convert') {
    toolTitle = (
      <span>
        Convert Image <span className="text-m3-primary">JPG, PNG &amp; WebP</span>
      </span>
    );
    toolSubtitle = 'Convert between formats with quality preservation and zero server uploads.';
  } else if (isPassportActive) {
    toolTitle = (
      <span>
        Passport Size Photo Maker <span className="text-m3-primary">(3.5 × 4.5 cm)</span>
      </span>
    );
    toolSubtitle = 'Standard Indian & international passport photo dimensions + 4×6 inch 6-photo printable sheet layout.';
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 space-y-6 animate-in fade-in duration-200">
      {/* Tool / Exam Header */}
      <div className="text-center space-y-2.5">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-m3-on-surface font-display">
          {toolTitle}
        </h1>
        <p className="text-xs sm:text-sm text-m3-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          {toolSubtitle}
        </p>
      </div>

      {/* Breadcrumb Contextual Pill if an exam is active */}
      {activeExam && (
        <div className="p-3.5 rounded-[22px] bg-m3-primary-container text-m3-on-primary-container border border-m3-primary/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="material-symbols-rounded text-[18px] filled text-m3-primary">
              verified
            </span>
            <span>
              Active Preset: <strong>{activeExam.examShortName} ({activeExam.docType?.toUpperCase() || 'DOCUMENT'})</strong> —{' '}
              {activeExam.specs?.unit === 'px'
                ? `${activeExam.specs.widthPx}×${activeExam.specs.heightPx} px`
                : `${activeExam.specs?.widthCm}×${activeExam.specs?.heightCm} cm`}{' '}
              • {activeExam.specs?.minKB}–{activeExam.specs?.maxKB} KB • {activeExam.specs?.dpi ?? 200} DPI
            </span>
          </div>

          <button
            type="button"
            onClick={onResetToGeneral}
            className="text-xs font-bold px-3 py-1 rounded-full bg-m3-surface-container-lowest text-m3-on-surface hover:brightness-95 border border-m3-outline-variant/40 transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-rounded text-[14px]">undo</span>
            <span>Switch to General</span>
          </button>
        </div>
      )}

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-[32px] border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 overflow-hidden shadow-sm ${
          isDragOver
            ? 'border-m3-primary bg-m3-surface-container-high scale-[1.01]'
            : 'border-m3-outline-variant/70 hover:border-m3-primary/80 bg-m3-surface-container-low hover:bg-m3-surface-container'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className={`w-18 h-18 rounded-[24px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm ${
              isDragOver
                ? 'bg-m3-primary text-m3-on-primary shadow-md'
                : 'bg-m3-primary-container text-m3-on-primary-container'
            }`}
          >
            <span className="material-symbols-rounded text-[36px] leading-none select-none flex items-center justify-center filled">
              {isExamActive
                ? (activeExam?.docType || sscPreset) === 'photo'
                  ? 'account_box'
                  : (activeExam?.docType || sscPreset) === 'thumb'
                  ? 'fingerprint'
                  : (activeExam?.docType || sscPreset) === 'declaration'
                  ? 'description'
                  : 'draw'
                : activeTool === 'compress'
                ? 'compress'
                : activeTool === 'resize'
                ? 'aspect_ratio'
                : activeTool === 'convert'
                ? 'transform'
                : isPassportActive
                ? 'photo_camera_front'
                : 'upload_file'}
            </span>
          </div>

          <div>
            <p className="text-base sm:text-lg font-bold text-m3-on-surface mb-1">
              {isExamActive
                ? `Drop your ${
                    activeExam
                      ? `${activeExam.examShortName} ${
                          activeExam.docType === 'photo'
                            ? 'Photo'
                            : activeExam.docType === 'thumb'
                            ? 'Thumb Impression'
                            : activeExam.docType === 'declaration'
                            ? 'Declaration'
                            : 'Signature'
                        }`
                      : isBankingActive
                      ? 'Banking Document'
                      : isRrbActive
                      ? 'RRB Signature'
                      : isUpscActive
                      ? 'UPSC Image'
                      : sscPreset === 'photo'
                      ? 'SSC Photo'
                      : 'SSC Signature'
                  } here, or browse files`
                : activeTool === 'compress'
                ? 'Drop your image to compress to target KB'
                : activeTool === 'resize'
                ? 'Drop your image to scale dimensions'
                : isPassportActive
                ? 'Drop your passport photo here'
                : 'Drop your image here, or browse files'}
            </p>
            <p className="text-xs sm:text-sm text-m3-on-surface-variant">
              {isExamActive ? (
                <span>
                  Configured for{' '}
                  <strong className="text-m3-on-surface font-semibold">
                    {activeExam
                      ? activeExam.specs?.unit === 'px'
                        ? `${activeExam.specs.widthPx} × ${activeExam.specs.heightPx} px`
                        : `${activeExam.specs?.widthCm} × ${activeExam.specs?.heightCm} cm`
                      : isRrbActive
                      ? '50 mm × 20 mm (5:2)'
                      : sscPreset === 'photo'
                      ? '3.5 × 4.5 cm (7:9)'
                      : '6.0 × 2.0 cm (3:1)'}
                  </strong>{' '}
                  • Targeting{' '}
                  <strong className="text-m3-primary font-semibold">
                    {activeExam
                      ? `${activeExam.specs?.targetKB} KB`
                      : isRrbActive
                      ? '40 KB'
                      : sscPreset === 'photo'
                      ? '35 KB'
                      : '15 KB'}
                  </strong>
                </span>
              ) : isPassportActive ? (
                <span>
                  3.5 × 4.5 cm (Aspect 7:9) • 300 DPI • Single Photo or 4×6" Print Sheet
                </span>
              ) : (
                <span>
                  Supports <strong className="text-m3-on-surface font-semibold">JPG, PNG, WebP</strong> • 100% Client-Side Privacy
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-m3-surface-container-high text-m3-on-surface-variant border border-m3-outline-variant/30">
              JPG / JPEG
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-m3-surface-container-high text-m3-on-surface-variant border border-m3-outline-variant/30">
              PNG
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-m3-surface-container-high text-m3-on-surface-variant border border-m3-outline-variant/30">
              WebP
            </span>
          </div>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-4 rounded-[20px] bg-m3-error-container text-m3-on-error-container text-xs font-medium flex items-center gap-2.5">
          <span className="material-symbols-rounded text-[20px] leading-none select-none flex items-center justify-center filled text-m3-error">
            error
          </span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sample image quick loader */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-m3-on-surface-variant">
        <span>Need a test file?</span>
        <button
          type="button"
          onClick={onSampleSelected}
          disabled={isLoadingSample}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-m3-secondary-container hover:bg-m3-secondary-container/80 text-m3-on-secondary-container font-semibold transition active:scale-95 cursor-pointer disabled:opacity-50 shadow-sm"
        >
          <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center filled">
            auto_awesome
          </span>
          <span>
            {isLoadingSample
              ? 'Generating sample...'
              : ((mode === 'ssc' || mode === 'rrb') && (sscPreset === 'signature' || activeExam?.docType === 'signature'))
              ? 'Load Demo Signature (Test Enhancer)'
              : 'Load Demo Image'}
          </span>
        </button>
      </div>
    </div>
  );
}
