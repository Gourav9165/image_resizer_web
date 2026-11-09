import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const FONTS = [
  { id: 'sans-serif', name: 'Clean Sans-Serif', value: 'bold {size}px sans-serif' },
  { id: 'serif', name: 'Official Serif', value: 'bold {size}px Georgia, serif' },
  { id: 'monospace', name: 'Monospace Code', value: 'bold {size}px "Courier New", monospace' },
  { id: 'impact', name: 'Bold Impact', value: '{size}px Impact, sans-serif' },
  { id: 'cursive', name: 'Signature Cursive', value: 'italic {size}px "Brush Script MT", cursive' },
];

const PRESET_COLORS = [
  { id: 'white', label: 'White', color: '#ffffff' },
  { id: 'black', label: 'Black', color: '#000000' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'blue', label: 'Blue', color: '#2563eb' },
  { id: 'yellow', label: 'Yellow', color: '#eab308' },
];

const POSITIONS = [
  { id: 'tl', label: 'Top-Left', x: 0.1, y: 0.1, align: 'left', baseline: 'top' },
  { id: 'tc', label: 'Top-Center', x: 0.5, y: 0.1, align: 'center', baseline: 'top' },
  { id: 'tr', label: 'Top-Right', x: 0.9, y: 0.1, align: 'right', baseline: 'top' },
  { id: 'cl', label: 'Center-Left', x: 0.1, y: 0.5, align: 'left', baseline: 'middle' },
  { id: 'cc', label: 'Center', x: 0.5, y: 0.5, align: 'center', baseline: 'middle' },
  { id: 'cr', label: 'Center-Right', x: 0.9, y: 0.5, align: 'right', baseline: 'middle' },
  { id: 'bl', label: 'Bottom-Left', x: 0.1, y: 0.9, align: 'left', baseline: 'bottom' },
  { id: 'bc', label: 'Bottom-Center', x: 0.5, y: 0.9, align: 'center', baseline: 'bottom' },
  { id: 'br', label: 'Bottom-Right', x: 0.9, y: 0.9, align: 'right', baseline: 'bottom' },
];

export default function WatermarkModal({
  isOpen,
  onClose,
  initialImageFile = null,
  onLoadIntoApp,
}) {
  const [file, setFile] = useState(initialImageFile);
  const [imageSrc, setImageSrc] = useState(null);
  const [mode, setMode] = useState('text'); // 'text' | 'image'
  
  // Text Watermark options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(42);
  const [textColor, setTextColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50); // 10-100%
  const [rotation, setRotation] = useState(-30); // -90 to +90 deg
  
  // Image Watermark options
  const [logoSrc, setLogoSrc] = useState(null);
  const [logoScale, setLogoScale] = useState(25); // 10-100%
  
  // Positioning options
  const [position, setPosition] = useState(POSITIONS[4]); // Center
  const [isTileMode, setIsTileMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const baseImgRef = useRef(null);
  const logoImgRef = useRef(null);
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

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type.startsWith('image/')) {
        const url = URL.createObjectURL(selected);
        setLogoSrc(url);
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

  // Render Watermark onto canvas
  const renderWatermark = useCallback(() => {
    if (!imageSrc || !baseImgRef.current || !canvasRef.current) return;

    const img = baseImgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    canvas.width = w;
    canvas.height = h;

    // Draw base image
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    // Apply alpha opacity
    ctx.save();
    ctx.globalAlpha = opacity / 100;

    if (mode === 'text' && watermarkText.trim()) {
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const computedFont = selectedFont.value.replace('{size}', fontSize);
      ctx.font = computedFont;

      if (isTileMode) {
        // Repeated tiled diagonal watermark
        const stepX = Math.max(180, fontSize * 5);
        const stepY = Math.max(120, fontSize * 3);

        for (let x = -w * 0.5; x < w * 1.5; x += stepX) {
          for (let y = -h * 0.5; y < h * 1.5; y += stepY) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.fillText(watermarkText, 0, 0);
            ctx.restore();
          }
        }
      } else {
        // Single anchored watermark
        const posX = w * position.x;
        const posY = h * position.y;
        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
      }
    } else if (mode === 'image' && logoImgRef.current) {
      const logo = logoImgRef.current;
      const lw = (w * (logoScale / 100));
      const lh = (logo.naturalHeight / logo.naturalWidth) * lw;

      if (isTileMode) {
        const stepX = lw * 1.8;
        const stepY = lh * 1.8;
        for (let x = 0; x < w; x += stepX) {
          for (let y = 0; y < h; y += stepY) {
            ctx.drawImage(logo, x, y, lw, lh);
          }
        }
      } else {
        const posX = (w - lw) * position.x;
        const posY = (h - lh) * position.y;
        ctx.drawImage(logo, posX, posY, lw, lh);
      }
    }

    ctx.restore();
  }, [
    imageSrc,
    mode,
    watermarkText,
    selectedFont,
    fontSize,
    textColor,
    opacity,
    rotation,
    logoScale,
    position,
    isTileMode,
  ]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        baseImgRef.current = img;
        renderWatermark();
      };
    }
  }, [imageSrc, renderWatermark]);

  useEffect(() => {
    if (logoSrc) {
      const l = new Image();
      l.src = logoSrc;
      l.onload = () => {
        logoImgRef.current = l;
        renderWatermark();
      };
    }
  }, [logoSrc, renderWatermark]);

  const handleDownload = (format = 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : 'jpg';
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'watermarked';

    const url = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_watermark.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onLoadIntoApp) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'watermarked';
      const exportFile = new File([blob], `${baseName}_watermark.jpg`, { type: 'image/jpeg' });
      onLoadIntoApp(exportFile);
      onClose();
    }, 'image/jpeg', 0.95);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <span className="material-symbols-rounded text-[22px] filled">branding_watermark</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  Watermark Image
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  Text &amp; Logo Overlay
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Protect sensitive documents, ID cards, and signatures with customizable stamps.
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
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                <span className="material-symbols-rounded text-[32px] filled">add_photo_alternate</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Select Base Image to Watermark
                </h4>
                <p className="text-xs text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
                  Drag and drop any picture, document or certificate here, or browse files.
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
              {/* Mode Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low p-2 rounded-2xl border border-m3-outline-variant/30">
                <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setMode('text')}
                    className={`py-1.5 px-4 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      mode === 'text'
                        ? 'bg-m3-primary text-m3-on-primary shadow-xs'
                        : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[16px]">text_fields</span>
                    <span>Text Watermark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('image')}
                    className={`py-1.5 px-4 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      mode === 'image'
                        ? 'bg-m3-primary text-m3-on-primary shadow-xs'
                        : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[16px]">image</span>
                    <span>Logo / Image</span>
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-m3-on-surface pr-2">
                  <input
                    type="checkbox"
                    checked={isTileMode}
                    onChange={(e) => setIsTileMode(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-m3-primary cursor-pointer"
                  />
                  <span>Tile across entire image (Diagonal Grid)</span>
                </label>
              </div>

              {/* Watermark Config Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-m3-surface-container-low p-4 rounded-2xl border border-m3-outline-variant/30 text-xs">
                {mode === 'text' ? (
                  <>
                    {/* Text string input */}
                    <div className="sm:col-span-2">
                      <label className="font-bold text-m3-on-surface block mb-1">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. FOR EXAM VERIFICATION ONLY"
                        className="w-full bg-m3-surface-container-high rounded-xl px-3 py-2 text-xs font-semibold text-m3-on-surface border border-m3-outline-variant/40 focus:outline-none focus:border-m3-primary"
                      />
                    </div>

                    {/* Font picker */}
                    <div>
                      <label className="font-bold text-m3-on-surface block mb-1">Font Family</label>
                      <select
                        value={selectedFont.id}
                        onChange={(e) => setSelectedFont(FONTS.find((f) => f.id === e.target.value) || FONTS[0])}
                        className="w-full bg-m3-surface-container-high rounded-xl px-3 py-2 text-xs font-semibold text-m3-on-surface border border-m3-outline-variant/40"
                      >
                        {FONTS.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color Presets */}
                    <div>
                      <label className="font-bold text-m3-on-surface block mb-1">Color</label>
                      <div className="flex items-center gap-1.5">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setTextColor(c.color)}
                            className={`w-6 h-6 rounded-full border-2 transition active:scale-90 cursor-pointer ${
                              textColor.toLowerCase() === c.color.toLowerCase()
                                ? 'border-m3-primary scale-110 shadow-xs'
                                : 'border-m3-outline-variant/60'
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.label}
                          />
                        ))}
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0 ml-1"
                        />
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-m3-on-surface">Size</span>
                        <span className="font-mono text-m3-outline">{fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="120"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-m3-primary cursor-pointer"
                      />
                    </div>

                    {/* Rotation */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-m3-on-surface">Angle</span>
                        <span className="font-mono text-m3-outline">{rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full accent-m3-primary cursor-pointer"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Logo file picker */}
                    <div className="sm:col-span-2">
                      <label className="font-bold text-m3-on-surface block mb-1">Logo / Stamp File</label>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-m3-surface-container-high border border-m3-outline-variant/40 text-xs font-semibold text-m3-on-surface hover:bg-m3-surface-container-highest transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-rounded text-[18px]">upload</span>
                        <span>{logoSrc ? 'Change Watermark Logo' : 'Select PNG / SVG Logo'}</span>
                      </button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>

                    {/* Logo scale */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-m3-on-surface">Logo Scale</span>
                        <span className="font-mono text-m3-outline">{logoScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={logoScale}
                        onChange={(e) => setLogoScale(Number(e.target.value))}
                        className="w-full accent-m3-primary cursor-pointer"
                      />
                    </div>
                  </>
                )}

                {/* Opacity slider (Common) */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-m3-on-surface">Watermark Opacity</span>
                    <span className="font-mono text-m3-outline">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-m3-primary cursor-pointer"
                  />
                </div>

                {/* 9-Point Anchor Position */}
                {!isTileMode && (
                  <div>
                    <label className="font-bold text-m3-on-surface block mb-1">Position</label>
                    <div className="grid grid-cols-3 gap-1 w-24">
                      {POSITIONS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPosition(p)}
                          className={`w-7 h-7 rounded-md border text-[10px] font-bold flex items-center justify-center transition active:scale-90 cursor-pointer ${
                            position.id === p.id
                              ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                              : 'bg-m3-surface-container-high text-m3-outline border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                          }`}
                          title={p.label}
                        >
                          •
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Rendered Canvas Preview */}
              <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 bg-zinc-950/40 shadow-inner flex items-center justify-center p-4 min-h-[300px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto max-h-[420px] object-contain rounded-lg shadow-sm"
                />
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
                onClick={() => handleDownload('jpg')}
                className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
              >
                <span className="material-symbols-rounded text-[18px]">download</span>
                <span>Download Watermarked JPG</span>
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
