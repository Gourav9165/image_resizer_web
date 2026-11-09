import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export default function BlurFaceModal({
  isOpen,
  onClose,
  initialImageFile = null,
  onLoadIntoApp,
}) {
  const [file, setFile] = useState(initialImageFile);
  const [imageSrc, setImageSrc] = useState(null);
  
  // Redaction boxes: Array of { id, x, y, width, height, style, intensity }
  const [boxes, setBoxes] = useState([]);
  const [currentBox, setCurrentBox] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Redaction options
  const [activeStyle, setActiveStyle] = useState('blur'); // 'blur' | 'pixelate' | 'blackout'
  const [intensity, setIntensity] = useState(14); // 4 - 36
  const [isDraggingFile, setIsDraggingFile] = useState(false);

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
      setBoxes([]);
      setCurrentBox(null);
      setIsDraggingFile(false);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type.startsWith('image/')) {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setImageSrc(url);
        setBoxes([]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type.startsWith('image/')) {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setImageSrc(url);
        setBoxes([]);
      }
    }
  };

  // Helper to apply redaction filter to a region
  const applyRedaction = (ctx, box, canvasWidth, canvasHeight) => {
    const rx = Math.max(0, Math.min(box.x, canvasWidth));
    const ry = Math.max(0, Math.min(box.y, canvasHeight));
    const rw = Math.min(box.width, canvasWidth - rx);
    const rh = Math.min(box.height, canvasHeight - ry);

    if (rw <= 0 || rh <= 0) return;

    if (box.style === 'blackout') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(rx, ry, rw, rh);
      return;
    }

    if (box.style === 'pixelate') {
      const blockSize = Math.max(4, box.intensity || 14);
      const imgData = ctx.getImageData(rx, ry, rw, rh);
      const data = imgData.data;

      for (let y = 0; y < rh; y += blockSize) {
        for (let x = 0; x < rw; x += blockSize) {
          // Compute average color in this block
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let by = 0; by < blockSize && y + by < rh; by++) {
            for (let bx = 0; bx < blockSize && x + bx < rw; bx++) {
              const idx = ((y + by) * rw + (x + bx)) * 4;
              rSum += data[idx];
              gSum += data[idx + 1];
              bSum += data[idx + 2];
              count++;
            }
          }

          const avgR = Math.round(rSum / count);
          const avgG = Math.round(gSum / count);
          const avgB = Math.round(bSum / count);

          // Fill block with average color
          for (let by = 0; by < blockSize && y + by < rh; by++) {
            for (let bx = 0; bx < blockSize && x + bx < rw; bx++) {
              const idx = ((y + by) * rw + (x + bx)) * 4;
              data[idx] = avgR;
              data[idx + 1] = avgG;
              data[idx + 2] = avgB;
            }
          }
        }
      }

      ctx.putImageData(imgData, rx, ry);
      return;
    }

    // Default: Gaussian / Box Blur
    const radius = Math.max(4, box.intensity || 14);
    // Downscale and upscale trick for smooth fast hardware-accelerated blur
    const tempCanvas = document.createElement('canvas');
    const scale = Math.max(0.04, 1 / radius);
    tempCanvas.width = Math.max(1, Math.round(rw * scale));
    tempCanvas.height = Math.max(1, Math.round(rh * scale));
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvasRef.current, rx, ry, rw, rh, 0, 0, tempCanvas.width, tempCanvas.height);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, rx, ry, rw, rh);
    ctx.restore();
  };

  // Re-render canvas with all applied boxes
  const renderAll = useCallback(() => {
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

    // Apply all confirmed redaction boxes
    boxes.forEach((box) => {
      applyRedaction(ctx, box, w, h);
    });

    // Draw active drawing box outline if in progress
    if (currentBox) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      ctx.setLineDash([]);
    }
  }, [imageSrc, boxes, currentBox]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        baseImgRef.current = img;
        renderAll();
      };
    }
  }, [imageSrc, renderAll]);

  // Convert mouse/touch event coordinates to Canvas natural coordinate space
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  };

  const handlePointerDown = (e) => {
    if (!imageSrc) return;
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentBox({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      style: activeStyle,
      intensity,
    });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const pos = getCanvasCoords(e);

    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);
    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);

    setCurrentBox({
      x,
      y,
      width,
      height,
      style: activeStyle,
      intensity,
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentBox) return;
    setIsDrawing(false);

    // Only add if box is at least 6x6 px
    if (currentBox.width > 6 && currentBox.height > 6) {
      setBoxes((prev) => [
        ...prev,
        { ...currentBox, id: Date.now() },
      ]);
    }
    setCurrentBox(null);
  };

  const handleUndo = () => {
    setBoxes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setBoxes([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'redacted';
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_sanitized.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onLoadIntoApp) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'redacted';
      const exportFile = new File([blob], `${baseName}_sanitized.jpg`, { type: 'image/jpeg' });
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
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <span className="material-symbols-rounded text-[22px] filled">blur_on</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  Blur Face / Privacy Redact
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  Client-Side Sanitization
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Censor faces, Aadhaar/PAN IDs, and confidential numbers before sharing.
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
                isDraggingFile
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
              <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
                <span className="material-symbols-rounded text-[32px] filled">security</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Select Image to Blur or Redact
                </h4>
                <p className="text-xs text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
                  Drag and drop an ID card, certificate, admit card, or photo here to censor details.
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
              {/* Redaction Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low p-3.5 rounded-2xl border border-m3-outline-variant/30 text-xs">
                {/* Redaction Style Switcher */}
                <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setActiveStyle('blur')}
                    className={`py-1.5 px-3.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeStyle === 'blur'
                        ? 'bg-m3-primary text-m3-on-primary shadow-xs'
                        : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[16px]">blur_circular</span>
                    <span>Blur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStyle('pixelate')}
                    className={`py-1.5 px-3.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeStyle === 'pixelate'
                        ? 'bg-m3-primary text-m3-on-primary shadow-xs'
                        : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[16px]">grid_view</span>
                    <span>Pixelate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStyle('blackout')}
                    className={`py-1.5 px-3.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeStyle === 'blackout'
                        ? 'bg-m3-primary text-m3-on-primary shadow-xs'
                        : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[16px]">crop_square</span>
                    <span>Blackout</span>
                  </button>
                </div>

                {/* Intensity Slider (for Blur and Pixelate) */}
                {activeStyle !== 'blackout' && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-m3-on-surface">Strength:</span>
                    <input
                      type="range"
                      min="6"
                      max="32"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-m3-primary cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-m3-outline">{intensity}px</span>
                  </div>
                )}

                {/* Undo / Clear Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={boxes.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1 disabled:opacity-40"
                  >
                    <span className="material-symbols-rounded text-[16px]">undo</span>
                    <span>Undo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={boxes.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-error font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1 disabled:opacity-40"
                  >
                    <span className="material-symbols-rounded text-[16px]">delete</span>
                    <span>Clear All ({boxes.length})</span>
                  </button>
                </div>
              </div>

              {/* Instructions banner */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-m3-surface-container-low text-[11px] text-m3-outline">
                <span className="material-symbols-rounded text-[16px] text-m3-primary">touch_app</span>
                <span>Click and drag on the image below to draw redaction boxes over sensitive areas.</span>
              </div>

              {/* Interactive Canvas Area */}
              <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 bg-zinc-950/40 shadow-inner flex items-center justify-center p-4 min-h-[320px]">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                  className="max-w-full h-auto max-h-[440px] object-contain rounded-lg shadow-sm cursor-crosshair touch-none select-none"
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
                setBoxes([]);
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
                <span>Download Sanitized Image</span>
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
