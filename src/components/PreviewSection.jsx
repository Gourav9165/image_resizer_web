import React, { useState, useRef, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generate4x6PrintSheet, printDirectly } from '../utils/printSheet';

export default function PreviewSection({
  mode = 'manual',
  sscPreset = null,
  activeExam = null,
  activeTool = null,
  originalInfo = null,
  processedResult = null,
  targetKB = 50,
  useTargetKB = true,
  dpi = 96,
  enhanceSignature = false,
  isProcessing = false,
  fileName = '',
}) {
  const [viewMode, setViewMode] = useState('sideBySide'); // 'sideBySide' | 'slider'
  const [sliderPos, setSliderPos] = useState(50);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef(null);

  // Passport Photo Maker Printable Sheet State
  const [sheetMode, setSheetMode] = useState('single'); // 'single' | 'sheet'
  const [printSheetResult, setPrintSheetResult] = useState(null);
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);

  if (!originalInfo) return null;

  const originalKB = originalInfo.sizeKB;
  const processedKB = processedResult?.sizeKB ?? originalKB;
  const reductionPercent =
    originalKB > 0
      ? Math.round(((originalKB - processedKB) / originalKB) * 100)
      : 0;

  const handleDownload = () => {
    if (!processedResult?.blob) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const ext =
      processedResult.blob.type === 'image/jpeg'
        ? 'jpg'
        : processedResult.blob.type === 'image/webp'
        ? 'webp'
        : 'png';

    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'image';
    const examPrefix = activeExam?.slug
      ? `${activeExam.slug.replace('-resizer', '')}_`
      : mode === 'rrb'
      ? (sscPreset === 'photo' ? 'rrb_photo_' : 'rrb_sign_')
      : mode === 'ssc'
      ? (sscPreset === 'photo' ? 'ssc_photo_' : 'ssc_sign_')
      : '';
    const finalName = `${examPrefix}${baseName}_${Math.round(processedResult.sizeKB)}kb.${ext}`;

    const link = document.createElement('a');
    link.href = processedResult.url;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyClipboard = async () => {
    if (!processedResult?.blob) return;
    try {
      if (processedResult.blob.type === 'image/png') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': processedResult.blob }),
        ]);
      } else {
        const img = new Image();
        img.src = processedResult.url;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
          }
        }, 'image/png');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
  };

  // Handle 4x6 sheet download
  const handleDownloadSheet = () => {
    if (!printSheetResult?.url) return;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'passport_photo';
    const link = document.createElement('a');
    link.href = printSheetResult.url;
    link.download = `${baseName}_4x6_print_sheet_6photos.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle direct print
  const handlePrintSheet = () => {
    if (!printSheetResult?.url) return;
    printDirectly(printSheetResult.url);
  };

  const handleSliderMove = useCallback((clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  }, []);

  const deltaKB =
    useTargetKB && targetKB && processedResult
      ? Math.round((processedResult.sizeKB - Number(targetKB)) * 10) / 10
      : null;

  const isExactHit =
    deltaKB !== null && Math.abs(deltaKB) <= 2.0;

  // Dynamic Exam Validation Checks (Supports SSC, RRB, Banking & State PSC registry rules)
  const isBanking = activeExam?.category === 'Banking (IBPS / SBI)' || mode === 'banking';
  const isRrb = activeExam?.category === 'Railways (RRB)' || mode === 'rrb';
  const isSsc = activeExam?.category === 'SSC Exams' || mode === 'ssc';
  const isPsc = activeExam?.category === 'State PSC' || mode === 'psc';
  const isUpsc = activeExam?.category === 'UPSC' || mode === 'upsc';
  const isPassportMaker = activeTool === 'passport' || activeExam?.slug === 'passport-size-photo-maker' || activeExam?.specs?.isPassportMaker;
  const isExamActive = Boolean(activeExam) || isBanking || isRrb || isSsc || isPsc || isUpsc;
  const examOrg = isPassportMaker ? 'Passport Standard' : isBanking ? 'IBPS / SBI' : isRrb ? 'RRB' : isPsc ? (activeExam?.examShortName || 'State PSC') : isUpsc ? 'UPSC' : 'SSC';
  const docType = activeExam?.docType || sscPreset;
  const isPhoto = docType === 'photo';
  const isDeclaration = docType === 'declaration';
  const isThumb = docType === 'thumb';
  const isSignature = docType === 'signature' || (!isPhoto && !isDeclaration && !isThumb);
  const isPassportPhoto = isPassportMaker || isPhoto;

  // Generate 4x6 print sheet when requested or for passport photo mode
  useEffect(() => {
    let isMounted = true;
    if (processedResult?.url && (sheetMode === 'sheet' || isPassportMaker)) {
      setIsGeneratingSheet(true);
      generate4x6PrintSheet(processedResult.url)
        .then((res) => {
          if (isMounted) {
            setPrintSheetResult(res);
            setIsGeneratingSheet(false);
          }
        })
        .catch((err) => {
          console.error('Failed to generate 4x6 print sheet:', err);
          if (isMounted) setIsGeneratingSheet(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [processedResult?.url, sheetMode, isPassportMaker]);

  const actualRatio =
    processedResult && processedResult.height > 0
      ? processedResult.width / processedResult.height
      : 1;

  // Dimension Validation
  let isDimensionValid = false;
  const expectedRatio = activeExam?.specs?.aspectRatio;
  if (expectedRatio) {
    isDimensionValid = Math.abs(actualRatio - expectedRatio) <= 0.15;
    if (!isDimensionValid && activeExam?.specs?.alternateAspectRatio) {
      isDimensionValid = Math.abs(actualRatio - activeExam.specs.alternateAspectRatio) <= 0.15;
    }
  } else if (isRrb) {
    isDimensionValid = Math.abs(actualRatio - 2.5) <= 0.15;
  } else if (isDeclaration) {
    isDimensionValid = Math.abs(actualRatio - 2.0) <= 0.15;
  } else if (isThumb) {
    isDimensionValid = Math.abs(actualRatio - 1.0) <= 0.15;
  } else if (isPhoto) {
    isDimensionValid = Math.abs(actualRatio - (isBanking ? 200 / 230 : 3.5 / 4.5)) <= 0.12;
  } else {
    isDimensionValid =
      Math.abs(actualRatio - 3.0) <= 0.18 || Math.abs(actualRatio - 2.0) <= 0.15;
  }

  // Size boundaries:
  // RRB: strictly 30 KB to 49 KB (per CEN 09/2026)
  // IBPS Declaration: strictly 50 KB to 100 KB
  // Photo & Thumb: 20 KB to 50 KB
  // Signature: 10 KB to 20 KB
  const minKB =
    activeExam?.specs?.minKB ??
    (isRrb ? 30.0 : isDeclaration ? 50.0 : isPhoto || isThumb ? 20.0 : 10.0);
  const maxKB =
    activeExam?.specs?.maxKB ??
    (isRrb ? 49.0 : isDeclaration ? 100.0 : isPhoto || isThumb ? 50.0 : 20.0);

  const isSizeValid = Boolean(
    processedResult &&
      processedResult.sizeKB >= minKB &&
      processedResult.sizeKB <= maxKB
  );

  const isFormatValid =
    processedResult?.blob?.type === 'image/jpeg';

  const isDpiValid = (dpi || (isBanking ? 200 : 300)) >= 150;

  const isAllPassed =
    isDimensionValid && isSizeValid && isFormatValid && isDpiValid;

  return (
    <div className="space-y-6">
      {/* Exam Pre-Flight Checklist Card (Dynamically updates for SSC or RRB) */}
      {isExamActive && (
        <div
          className={`rounded-[26px] p-5 border transition-all shadow-sm ${
            isAllPassed
              ? 'bg-m3-success-container/30 border-m3-success/40'
              : 'bg-m3-surface-container border-m3-outline-variant/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-rounded text-[22px] filled ${
                  isAllPassed ? 'text-m3-success' : 'text-m3-tertiary'
                }`}
              >
                {isAllPassed ? 'verified' : 'fact_check'}
              </span>
              <h3 className="text-sm font-bold text-m3-on-surface font-display m-0">
                {examOrg} Pre-Flight Acceptance Checklist
              </h3>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                isAllPassed
                  ? 'bg-m3-success-container text-m3-on-success-container border border-m3-success/40'
                  : 'bg-m3-tertiary-container text-m3-on-tertiary-container border border-m3-tertiary/40'
              }`}
            >
              <span className="material-symbols-rounded text-[16px] filled">
                {isAllPassed ? 'check_circle' : 'warning'}
              </span>
              <span>{isAllPassed ? `✓ Ready for ${examOrg} Portal Upload` : 'Check Requirements'}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Dimension Check */}
            <div
              className={`p-2.5 rounded-2xl border text-xs ${
                isDimensionValid
                  ? 'bg-m3-surface-container-high border-m3-success/40 text-m3-on-surface'
                  : 'bg-m3-error-container/30 border-m3-error/40 text-m3-error'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold mb-0.5">
                <span className="material-symbols-rounded text-[16px] filled text-m3-success">
                  {isDimensionValid ? 'check' : 'close'}
                </span>
                <span>Dimensions</span>
              </div>
              <p className="text-[11px] font-mono text-m3-on-surface-variant m-0">
                {processedResult ? `${processedResult.width}×${processedResult.height}px` : '...'}
              </p>
              <span className="text-[10px] text-m3-outline">
                {activeExam?.specs
                  ? activeExam.specs.unit === 'px'
                    ? `${activeExam.specs.widthPx} × ${activeExam.specs.heightPx} px`
                    : `${activeExam.specs.widthCm} × ${activeExam.specs.heightCm} cm`
                  : isRrb
                  ? '50 mm × 20 mm (5:2)'
                  : isDeclaration
                  ? '800 × 400 px (2:1)'
                  : isThumb
                  ? '240 × 240 px (1:1)'
                  : isPhoto
                  ? (isBanking ? '200 × 230 px' : '3.5 × 4.5 cm (7:9)')
                  : '6.0 × 2.0 cm (or 4 × 2 cm)'}
              </span>
            </div>

            {/* 2. File Size Check */}
            <div
              className={`p-2.5 rounded-2xl border text-xs ${
                isSizeValid
                  ? 'bg-m3-surface-container-high border-m3-success/40 text-m3-on-surface'
                  : 'bg-m3-error-container/30 border-m3-error/40 text-m3-error'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold mb-0.5">
                <span className="material-symbols-rounded text-[16px] filled text-m3-success">
                  {isSizeValid ? 'check' : 'close'}
                </span>
                <span>File Size</span>
              </div>
              <p className="text-[11px] font-mono text-m3-on-surface-variant m-0">
                {processedResult ? `${processedResult.sizeKB} KB` : '...'}
              </p>
              <span className="text-[10px] text-m3-outline">
                {minKB} – {maxKB} KB {isRrb ? '(Strictly < 50 KB)' : ''}
              </span>
            </div>

            {/* 3. Format Check */}
            <div
              className={`p-2.5 rounded-2xl border text-xs ${
                isFormatValid
                  ? 'bg-m3-surface-container-high border-m3-success/40 text-m3-on-surface'
                  : 'bg-m3-error-container/30 border-m3-error/40 text-m3-error'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold mb-0.5">
                <span className="material-symbols-rounded text-[16px] filled text-m3-success">
                  {isFormatValid ? 'check' : 'close'}
                </span>
                <span>Format</span>
              </div>
              <p className="text-[11px] font-mono text-m3-on-surface-variant m-0">
                JPG / JPEG
              </p>
              <span className="text-[10px] text-m3-outline">Mandatory</span>
            </div>

            {/* 4. DPI Check */}
            <div
              className={`p-2.5 rounded-2xl border text-xs ${
                isDpiValid
                  ? 'bg-m3-surface-container-high border-m3-success/40 text-m3-on-surface'
                  : 'bg-m3-error-container/30 border-m3-error/40 text-m3-error'
              }`}
            >
              <div className="flex items-center gap-1 font-semibold mb-0.5">
                <span className="material-symbols-rounded text-[16px] filled text-m3-success">
                  {isDpiValid ? 'check' : 'close'}
                </span>
                <span>Print DPI</span>
              </div>
              <p className="text-[11px] font-mono text-m3-on-surface-variant m-0">
                {dpi || 300} DPI
              </p>
              <span className="text-[10px] text-m3-outline">300 DPI Std</span>
            </div>
          </div>

          {/* Signature Enhancer Status Guard (Strictly for Signatures) */}
          {isSignature && (
            <div className="mt-3 pt-3 border-t border-m3-outline-variant/30 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-m3-on-surface font-medium">
                <span className="material-symbols-rounded text-[18px] text-m3-primary filled">
                  {enhanceSignature ? 'verified' : 'info'}
                </span>
                <span>
                  {enhanceSignature
                    ? 'One-Click Signature Enhancer: Active (Crisp B&W, Solid #FFFFFF Background)'
                    : 'Signature Enhancer: Off (Raw Camera Photo Colors)'}
                </span>
              </span>
              <span className="text-[11px] font-semibold text-m3-primary bg-m3-surface-container-high px-2.5 py-0.5 rounded-full border border-m3-outline-variant/30">
                {enhanceSignature ? 'Zero Dark Borders' : 'Raw Paper'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Photo Layout Mode Selector: Single Photo vs Printable Sheet (4x6 / 6-Photos) */}
      {isPassportPhoto && (
        <div className="bg-m3-surface-container rounded-[24px] p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 border border-m3-outline-variant/40 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[20px] filled text-m3-primary">
                photo_camera_front
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-m3-on-surface block leading-tight">
                Output Layout Mode
              </span>
              <span className="text-[10px] text-m3-on-surface-variant block mt-0.5">
                Download single digital upload photo or generate a multi-photo print card
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/30">
            <button
              type="button"
              onClick={() => setSheetMode('single')}
              className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                sheetMode === 'single'
                  ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                  : 'text-m3-on-surface-variant hover:text-m3-on-surface'
              }`}
            >
              <span className="material-symbols-rounded text-[16px]">crop_original</span>
              <span>Single Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setSheetMode('sheet')}
              className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                sheetMode === 'sheet'
                  ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                  : 'text-m3-on-surface-variant hover:text-m3-on-surface'
              }`}
            >
              <span className="material-symbols-rounded text-[16px] filled">grid_view</span>
              <span>Printable Sheet (4×6 / 6-Photos)</span>
            </button>
          </div>
        </div>
      )}

      {isPassportPhoto && sheetMode === 'sheet' ? (
        /* Printable Sheet Generator View (4x6 / 6-Photos) */
        <div className="bg-m3-surface-container rounded-[28px] p-5 sm:p-6 border border-m3-outline-variant/40 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-m3-outline-variant/30">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-m3-primary text-m3-on-primary flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-rounded text-[22px] filled">grid_view</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-m3-on-surface font-display m-0">
                  4×6" Passport Photo Print Sheet (6 Photos)
                </h3>
                <span className="text-[11px] text-m3-on-surface-variant block">
                  Arranged in a 2×3 grid at 300 DPI true resolution with cutting guidelines
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-m3-success-container text-m3-on-success-container border border-m3-success/30 flex items-center gap-1">
                <span className="material-symbols-rounded text-[14px] filled">verified</span>
                300 DPI True Quality
              </span>
            </div>
          </div>

          {/* Interactive Sheet Preview Card */}
          <div className="relative rounded-[24px] bg-m3-surface-container-lowest p-6 flex flex-col items-center justify-center border border-m3-outline-variant/30 min-h-[460px] overflow-hidden">
            {isGeneratingSheet ? (
              <div className="flex flex-col items-center gap-3 text-m3-on-surface-variant text-xs py-12">
                <div className="w-8 h-8 rounded-full border-2 border-m3-primary border-t-transparent animate-spin"></div>
                <span className="font-semibold text-m3-on-surface">Generating 300 DPI 4×6" Print Sheet...</span>
                <span className="text-[11px] text-m3-outline">Tiling 6 passport photos with precision scissor cutting borders</span>
              </div>
            ) : printSheetResult?.url ? (
              <div className="relative group max-w-sm w-full flex flex-col items-center">
                <div className="p-2 bg-white rounded-xl shadow-lg border border-m3-outline-variant/50 transition-transform duration-300 group-hover:scale-[1.01]">
                  <img
                    src={printSheetResult.url}
                    alt="4x6 inch Passport Photo Print Sheet (6 photos)"
                    className="w-full h-auto max-h-[420px] object-contain rounded-lg"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-m3-on-surface-variant font-medium bg-m3-surface-container-high px-3.5 py-1.5 rounded-full border border-m3-outline-variant/30">
                  <span className="material-symbols-rounded text-[16px] text-m3-primary">content_cut</span>
                  <span>Includes 1px border lines &amp; corner tick marks for scissors</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Sheet Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30">
              <span className="text-[10px] text-m3-outline uppercase font-bold block mb-0.5">Paper Size</span>
              <strong className="text-m3-on-surface">4 × 6 inches</strong>
              <span className="text-[10px] text-m3-on-surface-variant block mt-0.5">(10.2 × 15.2 cm)</span>
            </div>
            <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30">
              <span className="text-[10px] text-m3-outline uppercase font-bold block mb-0.5">Total Photos</span>
              <strong className="text-m3-on-surface">6 Photos</strong>
              <span className="text-[10px] text-m3-on-surface-variant block mt-0.5">(2 cols × 3 rows)</span>
            </div>
            <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30">
              <span className="text-[10px] text-m3-outline uppercase font-bold block mb-0.5">Photo Size</span>
              <strong className="text-m3-on-surface">3.5 × 4.5 cm</strong>
              <span className="text-[10px] text-m3-on-surface-variant block mt-0.5">(413 × 531 px @ 300 DPI)</span>
            </div>
            <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30">
              <span className="text-[10px] text-m3-outline uppercase font-bold block mb-0.5">Resolution</span>
              <strong className="text-m3-success font-semibold flex items-center gap-1">
                <span className="material-symbols-rounded text-[14px] filled">check_circle</span>
                300 DPI True
              </strong>
              <span className="text-[10px] text-m3-on-surface-variant block mt-0.5">(1200 × 1800 px)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSheetMode('single')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-semibold text-m3-on-surface-variant hover:text-m3-on-surface bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-rounded text-[16px]">arrow_back</span>
              <span>Back to Single Photo</span>
            </button>

            <button
              type="button"
              onClick={handlePrintSheet}
              disabled={!printSheetResult?.url || isGeneratingSheet}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-m3-on-surface bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              title="Print directly to connected photo printer"
            >
              <span className="material-symbols-rounded text-[18px]">print</span>
              <span>Print Sheet Directly</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSheet}
              disabled={!printSheetResult?.url || isGeneratingSheet}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold bg-m3-primary text-m3-on-primary hover:brightness-105 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-rounded text-[18px] filled">download</span>
              <span>Download 4×6" Print Sheet (JPG)</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Bar with M3 Tonal Pills and View Mode Switcher */}
          <div className="bg-m3-surface-container rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-4 border border-m3-outline-variant/40 shadow-sm">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-m3-surface-container-high text-xs font-semibold text-m3-on-surface-variant border border-m3-outline-variant/40">
            <span>Before:</span>
            <strong className="text-m3-on-surface font-mono">{originalKB} KB</strong>
          </div>

          <span className="material-symbols-rounded text-[16px] text-m3-outline leading-none select-none flex items-center justify-center">
            arrow_forward
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-m3-primary-container text-xs font-bold text-m3-on-primary-container border border-m3-primary/30">
            <span>After:</span>
            <span className="font-mono">{processedResult ? `${processedResult.sizeKB} KB` : '...'}</span>
          </div>

          {reductionPercent > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-m3-success-container text-m3-on-success-container">
              <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center filled">
                trending_down
              </span>
              -{reductionPercent}%
            </span>
          )}

          {useTargetKB && targetKB && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                isExactHit
                  ? 'bg-m3-success-container text-m3-on-success-container'
                  : 'bg-m3-tertiary-container text-m3-on-tertiary-container'
              }`}
            >
              <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center filled">
                check_circle
              </span>
              Target {targetKB} KB {deltaKB !== null && `(${deltaKB > 0 ? '+' : ''}${deltaKB} KB)`}
            </span>
          )}
        </div>

        {/* View Mode Toggle as M3 Segmented Button */}
        <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/40 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer ${
              viewMode === 'sideBySide'
                ? 'bg-m3-secondary-container text-m3-on-secondary-container shadow-sm'
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
            title="Side-by-side view"
          >
            <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center filled">
              view_column
            </span>
            <span className="hidden sm:inline">Side by Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-m3-secondary-container text-m3-on-secondary-container shadow-sm'
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
            title="Interactive split slider"
          >
            <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center filled">
              compare
            </span>
            <span className="hidden sm:inline">Split Slider</span>
          </button>
        </div>
      </div>

      {/* Main Image Comparison Area */}
      {viewMode === 'sideBySide' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Card */}
          <div className="bg-m3-surface-container rounded-[28px] p-5 flex flex-col justify-between border border-m3-outline-variant/40 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-m3-outline"></span>
                  <h3 className="font-bold text-sm text-m3-on-surface font-display m-0">Original Image</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-m3-surface-container-high text-m3-on-surface-variant font-mono">
                    {originalInfo.width} × {originalInfo.height} px
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-m3-surface-container-high text-m3-on-surface-variant font-bold font-mono">
                    {originalInfo.sizeKB} KB
                  </span>
                </div>
              </div>

              {/* Preview container */}
              <div className="relative rounded-[20px] bg-m3-surface-container-lowest flex items-center justify-center p-3 h-[380px] overflow-hidden border border-m3-outline-variant/30">
                <img
                  src={originalInfo.url}
                  alt="Original preview"
                  className="max-h-[350px] w-auto max-w-full object-contain object-center rounded-xl transition-transform duration-200 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-m3-outline-variant/30 flex items-center justify-between text-xs text-m3-on-surface-variant">
              <span>Format: <strong className="text-m3-on-surface font-semibold">{originalInfo.mimeType.replace('image/', '').toUpperCase()}</strong></span>
              <span>Ratio: <strong className="text-m3-on-surface font-semibold">{Math.round((originalInfo.width / originalInfo.height) * 100) / 100}:1</strong></span>
            </div>
          </div>

          {/* Processed Card */}
          <div className="bg-m3-surface-container rounded-[28px] p-5 flex flex-col justify-between border border-m3-primary/40 relative overflow-hidden shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-m3-primary animate-pulse"></span>
                  <h3 className="font-bold text-sm text-m3-on-surface flex items-center gap-1.5 font-display m-0">
                    Processed Output
                    {isProcessing && <span className="text-xs text-m3-primary font-normal animate-pulse">Compressing...</span>}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {processedResult && (
                    <>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-m3-surface-container-high text-m3-primary font-mono font-medium">
                        {processedResult.width} × {processedResult.height} px
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container font-bold font-mono">
                        {processedResult.sizeKB} KB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Preview container */}
              <div className="relative rounded-[20px] bg-m3-surface-container-lowest flex items-center justify-center p-3 h-[380px] overflow-hidden border border-m3-outline-variant/30">
                {processedResult?.url ? (
                  <img
                    src={processedResult.url}
                    alt="Processed preview"
                    className="max-h-[350px] w-auto max-w-full object-contain object-center rounded-xl transition-transform duration-200 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="text-xs text-m3-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-rounded animate-spin text-[18px]">progress_activity</span>
                    <span>Rendering canvas preview...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Critical Official Rule Warning Banner */}
            {isExamActive && (
              <div className="mt-4 p-3 rounded-2xl border text-xs leading-relaxed space-y-0.5 bg-m3-surface-container-low border-m3-outline-variant/40">
                {isBanking ? (
                  <div className="flex items-start gap-2 text-m3-on-surface">
                    <span className="material-symbols-rounded text-[18px] text-m3-secondary shrink-0 filled mt-0.5">
                      account_balance
                    </span>
                    <div>
                      <span className="font-bold text-m3-secondary block">
                        Official IBPS / SBI Guidelines:
                      </span>
                      <span className="text-[11px] text-m3-on-surface-variant block">
                        {isSignature
                          ? 'Sign on white paper with a BLACK INK PEN in running handwriting. Signatures in CAPITAL LETTERS will be rejected (10–20 KB).'
                          : isDeclaration
                          ? "Must be written clearly in English with BLACK INK on white paper in applicant's own handwriting. CAPITAL LETTERS NOT ACCEPTED (50–100 KB)."
                          : isThumb
                          ? 'Left thumb impression on white paper with BLACK or BLUE ink. Ridges must be clearly visible and unsmudged (20–50 KB).'
                          : 'Recent passport colour picture (200×230 px | 20–50 KB). (Note: IBPS portal also captures a live photo via webcam/QR scan).'}
                      </span>
                    </div>
                  </div>
                ) : isRrb ? (
                  <div className="flex items-start gap-2 text-m3-on-surface">
                    <span className="material-symbols-rounded text-[18px] text-m3-error shrink-0 filled mt-0.5">
                      warning
                    </span>
                    <div>
                      <span className="font-bold text-m3-error block">
                        Official RRB Notice (CEN 09/2026):
                      </span>
                      <span className="text-[11px] text-m3-on-surface-variant block">
                        Applicant must sign on white paper with <strong>Black ink pen</strong> in <strong>running handwriting</strong>. Signatures in BLOCK, CAPITAL, or DISJOINTED letters will lead to rejection. (File must stay strictly between 30 KB – 49 KB).
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-m3-on-surface">
                    <span className="material-symbols-rounded text-[18px] text-m3-tertiary shrink-0 filled mt-0.5">
                      info
                    </span>
                    <div>
                      <span className="font-bold text-m3-tertiary block">
                        Official SSC Guidelines:
                      </span>
                      <span className="text-[11px] text-m3-on-surface-variant block">
                        {isPhoto
                          ? 'Notice: SSC requires live photo capture on ssc.gov.in / MySSC app. Scanned photo standard: 3.5 × 4.5 cm (20–50 KB).'
                          : 'Signed on unruled white paper using black or blue ink. Do not sign in ALL CAPITAL LETTERS. Standard: 6.0 × 2.0 cm (or 4.0 × 2.0 cm), 10–20 KB.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions & Details */}
            <div className="mt-4 pt-3 border-t border-m3-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-m3-on-surface-variant flex items-center gap-3">
                {processedResult?.quality && (
                  <span>Quality: <strong className="text-m3-primary font-semibold">{Math.round(processedResult.quality * 100)}%</strong></span>
                )}
                {processedResult?.iterations && (
                  <span>Passes: <strong className="text-m3-on-surface font-semibold">{processedResult.iterations}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-m3-surface-container-highest hover:bg-m3-surface-container-high text-m3-on-surface transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-outline-variant/40"
                  title="Copy to clipboard"
                >
                  <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!processedResult?.blob || isProcessing}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-bold bg-m3-primary text-m3-on-primary hover:brightness-105 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-rounded text-[18px] leading-none select-none flex items-center justify-center filled">
                    download
                  </span>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Split Slider View - Pixel-Perfect Alignment via CSS clip-path */
        <div className="bg-m3-surface-container rounded-[28px] p-5 border border-m3-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-3 text-xs text-m3-on-surface-variant">
            <span>Drag slider to compare Original (Left) vs Processed (Right)</span>
            <div className="flex items-center gap-3 font-mono">
              <span>Original: <strong className="text-m3-on-surface">{originalKB} KB</strong></span>
              <span>|</span>
              <span>Processed: <strong className="text-m3-primary">{processedResult?.sizeKB} KB</strong></span>
            </div>
          </div>

          <div
            ref={sliderContainerRef}
            className="relative w-full h-[460px] rounded-[22px] overflow-hidden select-none cursor-ew-resize bg-m3-surface-container-lowest border border-m3-outline-variant/30"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleSliderMove(e.clientX);
            }}
            onMouseMove={(e) => {
              if (isDragging || e.buttons === 1) {
                handleSliderMove(e.clientX);
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleSliderMove(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              handleSliderMove(e.touches[0].clientX);
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Base Image: Processed image on the right side */}
            {processedResult?.url ? (
              <img
                src={processedResult.url}
                alt="Processed"
                className="absolute inset-0 w-full h-full object-contain object-center select-none pointer-events-none p-2"
              />
            ) : null}

            {/* Overlaid Image: Original image clipped to slider position from left */}
            <img
              src={originalInfo.url}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain object-center select-none pointer-events-none p-2"
              style={{
                clipPath: `inset(0 calc(100% - ${sliderPos}%) 0 0)`,
                WebkitClipPath: `inset(0 calc(100% - ${sliderPos}%) 0 0)`,
              }}
            />

            {/* Vertical Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-m3-primary pointer-events-none z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-m3-primary text-m3-on-primary shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize border-2 border-m3-surface-container-lowest">
                <span className="material-symbols-rounded text-[18px] leading-none select-none flex items-center justify-center">
                  swap_horiz
                </span>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute bottom-3 left-3 bg-m3-surface-container-high/90 px-3.5 py-1.5 rounded-full text-xs font-bold text-m3-on-surface border border-m3-outline-variant/40 pointer-events-none backdrop-blur-sm shadow-sm z-20">
              Original ({originalKB} KB)
            </div>
            <div className="absolute bottom-3 right-3 bg-m3-primary-container/90 px-3.5 py-1.5 rounded-full text-xs font-bold text-m3-on-primary-container border border-m3-primary/40 pointer-events-none backdrop-blur-sm shadow-sm z-20">
              Processed ({processedResult?.sizeKB} KB)
            </div>
          </div>

          {/* Critical Official Rule Warning Banner */}
          {isExamActive && (
            <div className="mt-4 p-3 rounded-2xl border text-xs leading-relaxed space-y-0.5 bg-m3-surface-container-low border-m3-outline-variant/40">
              {isBanking ? (
                <div className="flex items-start gap-2 text-m3-on-surface">
                  <span className="material-symbols-rounded text-[18px] text-m3-secondary shrink-0 filled mt-0.5">
                    account_balance
                  </span>
                  <div>
                    <span className="font-bold text-m3-secondary block">
                      Official IBPS / SBI Guidelines:
                    </span>
                    <span className="text-[11px] text-m3-on-surface-variant block">
                      {isSignature
                        ? 'Sign on white paper with a BLACK INK PEN in running handwriting. Signatures in CAPITAL LETTERS will be rejected (10–20 KB).'
                        : isDeclaration
                        ? "Must be written clearly in English with BLACK INK on white paper in applicant's own handwriting. CAPITAL LETTERS NOT ACCEPTED (50–100 KB)."
                        : isThumb
                        ? 'Left thumb impression on white paper with BLACK or BLUE ink. Ridges must be clearly visible and unsmudged (20–50 KB).'
                        : 'Recent passport colour picture (200×230 px | 20–50 KB). (Note: IBPS portal also captures a live photo via webcam/QR scan).'}
                    </span>
                  </div>
                </div>
              ) : isRrb ? (
                <div className="flex items-start gap-2 text-m3-on-surface">
                  <span className="material-symbols-rounded text-[18px] text-m3-error shrink-0 filled mt-0.5">
                    warning
                  </span>
                  <div>
                    <span className="font-bold text-m3-error block">
                      Official RRB Notice (CEN 09/2026):
                    </span>
                    <span className="text-[11px] text-m3-on-surface-variant block">
                      Applicant must sign on white paper with <strong>Black ink pen</strong> in <strong>running handwriting</strong>. Signatures in BLOCK, CAPITAL, or DISJOINTED letters will lead to rejection. (File must stay strictly between 30 KB – 49 KB).
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-m3-on-surface">
                  <span className="material-symbols-rounded text-[18px] text-m3-tertiary shrink-0 filled mt-0.5">
                    info
                  </span>
                  <div>
                    <span className="font-bold text-m3-tertiary block">
                      Official SSC Guidelines:
                    </span>
                    <span className="text-[11px] text-m3-on-surface-variant block">
                      {isPhoto
                        ? 'Notice: SSC requires live photo capture on ssc.gov.in / MySSC app. Scanned photo standard: 3.5 × 4.5 cm (20–50 KB).'
                        : 'Signed on unruled white paper using black or blue ink. Do not sign in ALL CAPITAL LETTERS. Standard: 6.0 × 2.0 cm (or 4.0 × 2.0 cm), 10–20 KB.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Slider bottom download */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-m3-primary text-m3-on-primary hover:brightness-105 transition active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-rounded text-[18px] leading-none select-none flex items-center justify-center filled">
                download
              </span>
              <span>Download Image ({processedResult?.sizeKB} KB)</span>
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
