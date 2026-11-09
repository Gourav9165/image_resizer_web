import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const SCALE_PRESETS = [
  { id: '2x', label: '2× (200% HD)', multiplier: 2 },
  { id: '4x', label: '4× (400% Ultra HD)', multiplier: 4 },
];

export default function UpscaleModal({
  isOpen,
  onClose,
  initialImageFile = null,
  onLoadIntoApp,
}) {
  const [file, setFile] = useState(initialImageFile);
  const [imageSrc, setImageSrc] = useState(null);
  const [scaleMultiplier, setScaleMultiplier] = useState(2);
  const [enhanceSharpness, setEnhanceSharpness] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Dimensions state
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [upscaledDims, setUpscaledDims] = useState({ w: 0, h: 0 });

  const fileInputRef = useRef(null);
  const baseImgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (initialImageFile) {
      setFile(initialImageFile);
      const url = URL.createObjectURL(initialImageFile);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFile(null);
      setImageSrc(null);
    }
  }, [initialImageFile]);

  useEffect(() => {
    if (!isOpen) {
      setScaleMultiplier(2);
      setEnhanceSharpness(true);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type.startsWith('image/')) {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setImageSrc(url);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type.startsWith('image/')) {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setImageSrc(url);
      }
    }
  };

  // Perform multi-pass stepped interpolation with optional subtle unsharp mask
  const processUpscale = useCallback(() => {
    if (!imageSrc || !baseImgRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const img = baseImgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;
    const targetW = Math.round(srcW * scaleMultiplier);
    const targetH = Math.round(srcH * scaleMultiplier);

    setOriginalDims({ w: srcW, h: srcH });
    setUpscaledDims({ w: targetW, h: targetH });

    // Multi-pass stepped scaling:
    // Scale up in steps of ~1.5x to preserve gradient smoothness before final pass
    let currentW = srcW;
    let currentH = srcH;
    let currentCanvas = document.createElement('canvas');
    currentCanvas.width = currentW;
    currentCanvas.height = currentH;
    let currentCtx = currentCanvas.getContext('2d');
    currentCtx.drawImage(img, 0, 0, currentW, currentH);

    while (currentW * 1.5 < targetW && currentH * 1.5 < targetH) {
      const nextW = Math.round(currentW * 1.5);
      const nextH = Math.round(currentH * 1.5);
      const stepCanvas = document.createElement('canvas');
      stepCanvas.width = nextW;
      stepCanvas.height = nextH;
      const stepCtx = stepCanvas.getContext('2d');
      stepCtx.imageSmoothingEnabled = true;
      stepCtx.imageSmoothingQuality = 'high';
      stepCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);

      currentCanvas = stepCanvas;
      currentW = nextW;
      currentH = nextH;
    }

    // Final upscale step to exact target
    canvas.width = targetW;
    canvas.height = targetH;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, targetW, targetH);
    ctx.drawImage(currentCanvas, 0, 0, targetW, targetH);

    // Subtle edge contrast / unsharp mask pass to counteract interpolation softness
    if (enhanceSharpness && targetW * targetH < 16000000) {
      try {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const copy = new Uint8ClampedArray(data);

        // 3x3 Laplace sharpening kernel: [0, -0.2, 0, -0.2, 1.8, -0.2, 0, -0.2, 0]
        const w4 = targetW * 4;
        for (let y = 1; y < targetH - 1; y++) {
          for (let x = 1; x < targetW - 1; x++) {
            const idx = y * w4 + x * 4;
            for (let c = 0; c < 3; c++) {
              const center = copy[idx + c];
              const top = copy[idx - w4 + c];
              const bottom = copy[idx + w4 + c];
              const left = copy[idx - 4 + c];
              const right = copy[idx + 4 + c];

              const sharpVal = center * 1.5 - (top + bottom + left + right) * 0.125;
              data[idx + c] = Math.max(0, Math.min(255, sharpVal));
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        console.warn('Sharpening pass skipped:', e);
      }
    }

    setIsProcessing(false);
  }, [imageSrc, scaleMultiplier, enhanceSharpness]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        baseImgRef.current = img;
        processUpscale();
      };
    }
  }, [imageSrc, processUpscale]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'upscaled';

    const url = canvas.toDataURL(format, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_upscaled_${scaleMultiplier}x.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onLoadIntoApp) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'upscaled';
      const ext = format === 'image/png' ? 'png' : 'jpg';
      const exportFile = new File([blob], `${baseName}_${scaleMultiplier}x.${ext}`, { type: format });
      onLoadIntoApp(exportFile);
      onClose();
    }, format, 0.95);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
              <span className="material-symbols-rounded text-[22px] filled">hdr_enhanced_select</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  Upscale Image (Super-Resolution)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  Multi-Pass Stepped Scaling
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Enlarge low-resolution graphics 200% or 400% with high-definition edge interpolation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface-variant flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body with Contained Scrollbar */}
        <div className="overflow-y-auto px-5 sm:px-6 py-4 flex-1 custom-modal-scrollbar space-y-4">
          {!imageSrc ? (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3.5 my-4 ${
                isDragging
                  ? 'border-m3-primary bg-m3-primary-container/20 scale-[0.99]'
                  : 'border-m3-outline-variant/60 hover:border-m3-primary bg-m3-surface-container-low hover:bg-m3-surface-container'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-16 h-16 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
                <span className="material-symbols-rounded text-[32px] filled">zoom_out_map</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Select Image to Enlarge &amp; Upscale
                </h4>
                <p className="text-xs text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
                  Drag and drop a low-res photo, icon, or diagram here to enhance resolution.
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-full bg-m3-primary text-m3-on-primary font-bold text-xs hover:brightness-105 active:scale-95 transition shadow-sm pointer-events-none"
              >
                Choose Image File
              </button>
            </div>
          ) : (
            <>
              {/* Scale Multiplier & Options Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low p-3.5 rounded-2xl border border-m3-outline-variant/30 text-xs">
                {/* Scale buttons */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-m3-on-surface">Target Multiplier:</span>
                  <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/30">
                    {SCALE_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setScaleMultiplier(p.multiplier)}
                        className={`py-1 px-3.5 rounded-full font-bold transition active:scale-95 cursor-pointer ${
                          scaleMultiplier === p.multiplier
                            ? 'bg-m3-primary text-m3-on-primary shadow-xs'
                            : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edge Sharpness Toggle */}
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-m3-on-surface">
                  <input
                    type="checkbox"
                    checked={enhanceSharpness}
                    onChange={(e) => setEnhanceSharpness(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-m3-primary cursor-pointer"
                  />
                  <span>High-Fidelity Edge Sharpening</span>
                </label>

                {/* Export Format */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-m3-outline">Format:</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="bg-m3-surface-container-high rounded-lg px-2.5 py-1 text-xs font-bold text-m3-on-surface border border-m3-outline-variant/40 cursor-pointer"
                  >
                    <option value="image/png">PNG (Lossless)</option>
                    <option value="image/jpeg">JPG (Standard)</option>
                    <option value="image/webp">WebP (Modern)</option>
                  </select>
                </div>
              </div>

              {/* Before vs After Resolution Metric */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 text-center">
                  <span className="text-[10px] font-bold text-m3-outline block uppercase tracking-wider mb-0.5">Original Dimensions</span>
                  <span className="font-bold text-m3-on-surface font-mono text-sm sm:text-base">
                    {originalDims.w} × {originalDims.h} px
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-m3-primary-container/40 border border-m3-primary/30 text-center">
                  <span className="text-[10px] font-bold text-m3-primary block uppercase tracking-wider mb-0.5">
                    Upscaled Resolution ({scaleMultiplier}×)
                  </span>
                  <span className="font-bold text-m3-primary font-mono text-sm sm:text-base">
                    {upscaledDims.w} × {upscaledDims.h} px
                  </span>
                </div>
              </div>

              {/* Preview Viewport */}
              <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 bg-zinc-950/40 shadow-inner flex items-center justify-center p-4 min-h-[320px]">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-m3-primary animate-pulse">
                    <span className="material-symbols-rounded text-[32px] animate-spin">sync</span>
                    <span className="text-xs font-bold">Upscaling Canvas Multi-Pass Stepped Interpolation...</span>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto max-h-[440px] object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        {imageSrc && (
          <div className="p-4 sm:p-5 border-t border-m3-outline-variant/30 flex-shrink-0 flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low/50">
            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                setFile(null);
              }}
              className="px-4 py-2 rounded-full text-xs font-bold text-m3-on-surface-variant hover:bg-m3-surface-container-high transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-rounded text-[16px]">refresh</span>
              <span>Change Image</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
              >
                <span className="material-symbols-rounded text-[18px]">download</span>
                <span>Download {scaleMultiplier}× Upscaled Image</span>
              </button>

              <button
                type="button"
                onClick={handleLoadWorkspace}
                className="py-2.5 px-5 rounded-full bg-m3-primary hover:brightness-105 text-m3-on-primary font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-rounded text-[18px] filled">check</span>
                <span>Load into Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
