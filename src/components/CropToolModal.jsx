import React, { useState, useRef, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import confetti from 'canvas-confetti';

const ASPECT_RATIOS = [
  { id: 'free', label: 'Freeform', value: undefined },
  { id: '1:1', label: '1:1 Square', value: 1 / 1 },
  { id: '7:9', label: '7:9 Passport (3.5×4.5)', value: 7 / 9 },
  { id: '3:1', label: '3:1 Signature', value: 3 / 1 },
  { id: '16:9', label: '16:9 Landscape', value: 16 / 9 },
];

export default function CropToolModal({
  isOpen,
  onClose,
  initialImageFile = null,
  onApplyCrop,
}) {
  const [file, setFile] = useState(initialImageFile);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectIndex, setAspectIndex] = useState(0); // Default to Freeform
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setAspectIndex(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      if (selected.type.startsWith('image/')) {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setImageSrc(url);
      }
    }
  };

  const onCropComplete = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(croppedAreaPixels.width);
    canvas.height = Math.round(croppedAreaPixels.height);
    const ctx = canvas.getContext('2d');

    // Fill solid white background first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const fileName = file ? `cropped_${file.name.replace(/\.[^/.]+$/, '')}.jpg` : 'cropped_image.jpg';
        const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });
        resolve({ blob, file: croppedFile, dataUrl: canvas.toDataURL('image/jpeg', 0.95) });
      }, 'image/jpeg', 0.95);
    });
  }, [imageSrc, croppedAreaPixels, file]);

  const handleApply = async () => {
    const result = await createCroppedImage();
    if (result && onApplyCrop) {
      onApplyCrop(result.file);
      onClose();
    }
  };

  const handleDownload = async () => {
    const result = await createCroppedImage();
    if (!result) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = result.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[22px] filled">crop</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                Crop Image
              </h3>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Precision ratio cropping for passport photos, exam signatures, and custom dimensions.
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
        <div className="overflow-y-auto px-5 sm:px-6 py-5 flex-1 custom-modal-scrollbar space-y-4">
          {!imageSrc ? (
            /* Clean Upload Dropzone with Prompt to Choose Image */
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
              <div className="w-16 h-16 rounded-2xl bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shadow-xs">
                <span className="material-symbols-rounded text-[32px] filled">add_photo_alternate</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Choose Image to Crop
                </h4>
                <p className="text-xs text-m3-on-surface-variant mt-1 max-w-sm mx-auto">
                  Drag and drop a photo or scanned signature here, or click to browse.
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-full bg-m3-primary text-m3-on-primary font-bold text-xs hover:brightness-105 active:scale-95 transition shadow-sm pointer-events-none"
              >
                Select From Device
              </button>
              <span className="text-[11px] text-m3-outline">
                Supports JPG, PNG, and WebP · 100% Client-Side Privacy
              </span>
            </div>
          ) : (
            <>
              {/* Aspect Ratio Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
                <span className="text-xs font-bold text-m3-on-surface-variant whitespace-nowrap flex-shrink-0">
                  Aspect Ratio:
                </span>
                {ASPECT_RATIOS.map((item, index) => {
                  const isSelected = aspectIndex === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspectIndex(index)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition active:scale-95 cursor-pointer border ${
                        isSelected
                          ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                          : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Cropper Viewport */}
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-black/90 shadow-inner border border-m3-outline-variant/40">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={ASPECT_RATIOS[aspectIndex].value}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={true}
                />
              </div>

              {/* Zoom & Rotation Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-m3-surface-container-low p-3.5 rounded-2xl border border-m3-outline-variant/30 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-m3-on-surface flex items-center gap-1">
                      <span className="material-symbols-rounded text-[16px]">zoom_in</span>
                      Zoom
                    </span>
                    <span className="text-m3-outline font-mono text-[11px]">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-m3-primary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-m3-on-surface flex items-center gap-1">
                      <span className="material-symbols-rounded text-[16px]">rotate_right</span>
                      Rotate
                    </span>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="text-[11px] font-bold text-m3-primary hover:underline cursor-pointer"
                    >
                      Rotate 90°
                    </button>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-m3-primary cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer Actions (Only rendered if image is active) */}
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

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
              >
                <span className="material-symbols-rounded text-[18px]">download</span>
                <span>Download Cropped</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="py-2.5 px-5 rounded-full bg-m3-primary hover:brightness-105 text-m3-on-primary font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-rounded text-[18px] filled">check</span>
                <span>Apply to Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
