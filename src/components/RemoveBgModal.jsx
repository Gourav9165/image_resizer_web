import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const SAMPLE_PRESET_COLORS = [
  { id: 'white', label: 'White / Off-White', color: '#ffffff' },
  { id: 'light-gray', label: 'Light Gray', color: '#e5e7eb' },
  { id: 'light-blue', label: 'Passport Blue', color: '#bfdbfe' },
  { id: 'light-red', label: 'Light Red', color: '#fecaca' },
];

export default function RemoveBgModal({
  isOpen,
  onClose,
  initialImageFile = null,
  onLoadIntoApp,
}) {
  const [file, setFile] = useState(initialImageFile);
  const [imageSrc, setImageSrc] = useState(null);
  const [targetColor, setTargetColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(28); // 1-100%
  const [feather, setFeather] = useState(2); // 0-10px
  const [replaceWithWhite, setReplaceWithWhite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const originalImageRef = useRef(null);
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
      setTolerance(28);
      setFeather(2);
      setReplaceWithWhite(false);
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

  // Convert hex to rgb
  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  // Process remove background algorithm
  const processImage = useCallback(() => {
    if (!imageSrc || !originalImageRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const img = originalImageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const { r: tr, g: tg, b: tb } = hexToRgb(targetColor);
    const maxDist = Math.sqrt(255 * 255 * 3);
    const thresholdNorm = (tolerance / 100) * maxDist;
    const featherNorm = (feather / 100) * maxDist + 0.001;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) continue;

      const dist = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);

      if (dist < thresholdNorm) {
        if (replaceWithWhite) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        } else {
          // Feather alpha edge
          if (dist > thresholdNorm - featherNorm) {
            const ratio = (dist - (thresholdNorm - featherNorm)) / featherNorm;
            data[i + 3] = Math.round(a * ratio);
          } else {
            data[i + 3] = 0;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setIsProcessing(false);
  }, [imageSrc, targetColor, tolerance, feather, replaceWithWhite]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        originalImageRef.current = img;
        processImage();
      };
    }
  }, [imageSrc, processImage]);

  const handleDownload = (format = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const ext = format === 'jpg' ? 'jpg' : 'png';
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'removed_bg';

    const url = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_nobg.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onLoadIntoApp) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'removed_bg';
      const ext = replaceWithWhite ? 'jpg' : 'png';
      const mime = replaceWithWhite ? 'image/jpeg' : 'image/png';
      const exportFile = new File([blob], `${baseName}_clean.${ext}`, { type: mime });
      onLoadIntoApp(exportFile);
      onClose();
    }, replaceWithWhite ? 'image/jpeg' : 'image/png', 0.95);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <span className="material-symbols-rounded text-[22px] filled">auto_fix_high</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  Remove Background
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  100% In-Browser Cutout
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Precision alpha keying for passport photos, signatures &amp; documents.
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
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                <span className="material-symbols-rounded text-[32px] filled">layers_clear</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Select Image to Cut Out Background
                </h4>
                <p className="text-xs text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
                  Drag and drop a photo or signature with solid/light background here, or browse.
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
              {/* Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-m3-surface-container-low p-4 rounded-2xl border border-m3-outline-variant/30 text-xs">
                {/* Target Background Color */}
                <div>
                  <label className="font-bold text-m3-on-surface block mb-1.5">
                    Background Color to Remove:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {SAMPLE_PRESET_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setTargetColor(c.color)}
                        className={`w-6 h-6 rounded-full border-2 transition active:scale-90 cursor-pointer ${
                          targetColor.toLowerCase() === c.color.toLowerCase()
                            ? 'border-m3-primary scale-110 shadow-xs ring-2 ring-m3-primary/30'
                            : 'border-m3-outline-variant/60'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                    <input
                      type="color"
                      value={targetColor}
                      onChange={(e) => setTargetColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 ml-1"
                      title="Custom Color Dropper"
                    />
                  </div>
                </div>

                {/* Tolerance Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-m3-on-surface">Tolerance (Sensitivity)</span>
                    <span className="font-mono text-m3-outline">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full accent-m3-primary cursor-pointer"
                  />
                </div>

                {/* Edge Feathering Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-m3-on-surface">Edge Feathering</span>
                    <span className="font-mono text-m3-outline">{feather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    className="w-full accent-m3-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Mode Toggle: Transparent vs Pure White Replacement */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-m3-on-surface">
                    <input
                      type="checkbox"
                      checked={replaceWithWhite}
                      onChange={(e) => setReplaceWithWhite(e.target.checked)}
                      className="w-4 h-4 rounded-sm accent-m3-primary cursor-pointer"
                    />
                    <span>Replace with Pure White (#FFFFFF) instead of Transparent PNG</span>
                  </label>
                </div>
                {isProcessing && (
                  <span className="text-xs font-bold text-m3-primary animate-pulse">
                    Processing Canvas...
                  </span>
                )}
              </div>

              {/* Interactive Canvas Preview with Checkerboard Background */}
              <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 shadow-inner flex items-center justify-center p-4 bg-zinc-900/5 dark:bg-zinc-950/40 min-h-[300px]">
                <div
                  className="rounded-xl overflow-hidden shadow-sm max-w-full flex items-center justify-center"
                  style={{
                    backgroundImage: replaceWithWhite
                      ? 'none'
                      : 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    backgroundColor: replaceWithWhite ? '#ffffff' : '#f8fafc',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto max-h-[420px] object-contain rounded-lg"
                  />
                </div>
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
                onClick={() => handleDownload('png')}
                className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
              >
                <span className="material-symbols-rounded text-[18px]">download</span>
                <span>Download Transparent PNG</span>
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
