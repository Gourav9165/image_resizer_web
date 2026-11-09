import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export default function RotateModal({
  isOpen,
  onClose,
  initialImageFile = null,
  onLoadIntoApp,
}) {
  const [file, setFile] = useState(initialImageFile);
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270 etc
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState('image/jpeg');
  const [isDragging, setIsDragging] = useState(false);

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
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
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

  // Render transformed canvas
  const renderTransformed = useCallback(() => {
    if (!imageSrc || !baseImgRef.current || !canvasRef.current) return;

    const img = baseImgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const natW = img.naturalWidth || img.width;
    const natH = img.naturalHeight || img.height;

    // Normalize rotation angle
    const normalizedAngle = ((rotation % 360) + 360) % 360;
    const isPerpendicular = normalizedAngle === 90 || normalizedAngle === 270;

    canvas.width = isPerpendicular ? natH : natW;
    canvas.height = isPerpendicular ? natW : natH;

    // Fill white background for non-PNG
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((normalizedAngle * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -natW / 2, -natH / 2);
    ctx.restore();
  }, [imageSrc, rotation, flipH, flipV, format]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        baseImgRef.current = img;
        renderTransformed();
      };
    }
  }, [imageSrc, renderTransformed]);

  const handleRotateLeft = () => setRotation((prev) => prev - 90);
  const handleRotateRight = () => setRotation((prev) => prev + 90);
  const handleRotate180 = () => setRotation((prev) => prev + 180);
  const handleToggleFlipH = () => setFlipH((prev) => !prev);
  const handleToggleFlipV = () => setFlipV((prev) => !prev);
  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
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

    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'transformed';

    const url = canvas.toDataURL(format, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_rotated.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onLoadIntoApp) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'transformed';
      const ext = format === 'image/png' ? 'png' : 'jpg';
      const exportFile = new File([blob], `${baseName}_rotated.${ext}`, { type: format });
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <span className="material-symbols-rounded text-[22px] filled">rotate_90_degrees_ccw</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  Rotate &amp; Flip Image
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  Lossless Coordinate Transform
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Rotate 90°, 180°, or mirror horizontally/vertically without quality loss.
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
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <span className="material-symbols-rounded text-[32px] filled">rotate_right</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Select Image to Rotate or Flip
                </h4>
                <p className="text-xs text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
                  Drag and drop a scanned document, photo, or admit card here, or click to browse.
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
              {/* Orientation Buttons Tool Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low p-3.5 rounded-2xl border border-m3-outline-variant/30">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRotateLeft}
                    className="px-3.5 py-2 rounded-xl bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface font-semibold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-outline-variant/40"
                  >
                    <span className="material-symbols-rounded text-[18px]">rotate_left</span>
                    <span>Left 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRotateRight}
                    className="px-3.5 py-2 rounded-xl bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface font-semibold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-outline-variant/40"
                  >
                    <span className="material-symbols-rounded text-[18px]">rotate_right</span>
                    <span>Right 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRotate180}
                    className="px-3.5 py-2 rounded-xl bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface font-semibold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-outline-variant/40"
                  >
                    <span className="material-symbols-rounded text-[18px]">screen_rotation</span>
                    <span>Rotate 180°</span>
                  </button>

                  <div className="w-[1px] h-6 bg-m3-outline-variant/40 mx-1 hidden sm:block" />

                  <button
                    type="button"
                    onClick={handleToggleFlipH}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1.5 border ${
                      flipH
                        ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                        : 'bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface border-m3-outline-variant/40'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[18px]">flip</span>
                    <span>Flip Horizontal</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleFlipV}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1.5 border ${
                      flipV
                        ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                        : 'bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface border-m3-outline-variant/40'
                    }`}
                  >
                    <span className="material-symbols-rounded text-[18px] rotate-90">flip</span>
                    <span>Flip Vertical</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 text-xs font-bold text-m3-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-rounded text-[16px]">restart_alt</span>
                  <span>Reset</span>
                </button>
              </div>

              {/* Status & Format Selector */}
              <div className="flex flex-wrap items-center justify-between text-xs text-m3-on-surface-variant px-1">
                <div className="flex items-center gap-2">
                  <span>Current Orientation: <strong className="text-m3-on-surface font-mono">{((rotation % 360) + 360) % 360}°</strong></span>
                  {flipH && <span className="px-2 py-0.5 rounded-full bg-m3-secondary-container text-m3-on-secondary-container text-[10px] font-bold">Mirrored H</span>}
                  {flipV && <span className="px-2 py-0.5 rounded-full bg-m3-secondary-container text-m3-on-secondary-container text-[10px] font-bold">Mirrored V</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">Export Format:</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="bg-m3-surface-container-high rounded-lg px-2.5 py-1 text-xs font-bold text-m3-on-surface border border-m3-outline-variant/40 cursor-pointer"
                  >
                    <option value="image/jpeg">JPG / JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>
              </div>

              {/* Transformed Preview Area */}
              <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 bg-zinc-950/40 shadow-inner flex items-center justify-center p-4 min-h-[320px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto max-h-[440px] object-contain rounded-lg shadow-sm transition-transform duration-200"
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
                onClick={handleDownload}
                className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
              >
                <span className="material-symbols-rounded text-[18px]">download</span>
                <span>Download Transformed Image</span>
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
