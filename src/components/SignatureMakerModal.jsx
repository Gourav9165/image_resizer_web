import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const PRESETS = [
  { id: 'ssc', label: 'SSC (6×2 cm)', width: 708, height: 236, aspect: '3:1' },
  { id: 'rrb', label: 'Railways RRB (50×20 mm)', width: 590, height: 236, aspect: '5:2' },
  { id: 'ibps', label: 'Banking IBPS (140×60 px)', width: 140, height: 60, aspect: '7:3' },
  { id: 'upsc', label: 'UPSC (350×350 px)', width: 350, height: 350, aspect: '1:1' },
  { id: 'mppsc', label: 'MPPSC (275×118 px)', width: 275, height: 118, aspect: '7:3' },
];

const FONTS = [
  { id: 'cursive', name: 'Elegant Cursive', font: 'italic 44px "Brush Script MT", cursive' },
  { id: 'handwriting', name: 'Natural Handwriting', font: 'italic 38px "Segoe Print", "Comic Sans MS", cursive' },
  { id: 'formal', name: 'Official Running Script', font: 'italic 42px "Lucida Handwriting", cursive' },
];

export default function SignatureMakerModal({ isOpen, onClose, onLoadIntoApp }) {
  const [tab, setTab] = useState('draw'); // 'draw' | 'type'
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [inkColor, setInkColor] = useState('#000000'); // black or dark blue
  const [penSize, setPenSize] = useState(2.5);
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, [isOpen, selectedPreset, tab]);

  // Re-render typed signature when text/font changes
  useEffect(() => {
    if (tab !== 'type' || !isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (typedName.trim()) {
      ctx.fillStyle = inkColor;
      ctx.font = selectedFont.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName.trim(), canvas.width / 2, canvas.height / 2);
      setHasDrawn(true);
    } else {
      setHasDrawn(false);
    }
  }, [tab, typedName, selectedFont, inkColor, isOpen, selectedPreset]);

  if (!isOpen) return null;

  // Drawing Handlers
  const startDrawing = (e) => {
    if (tab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || tab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (tab === 'type') setTypedName('');
  };

  // Convert canvas to File/Blob
  const exportSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return null;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], `signature_${selectedPreset.id}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve({ blob, file });
      }, 'image/jpeg', 0.95);
    });
  };

  const handleDownload = async () => {
    const result = await exportSignature();
    if (!result) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signature_${selectedPreset.id}_${selectedPreset.width}x${selectedPreset.height}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadIntoWorkspace = async () => {
    const result = await exportSignature();
    if (!result || !onLoadIntoApp) return;

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
    });

    onLoadIntoApp(result.file);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-primary text-m3-on-primary flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-rounded text-[22px] filled">draw</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-m3-on-surface font-display m-0">
                Signature Maker &amp; Digital Sign
              </h3>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Draw or type signature for SSC, RRB, IBPS &amp; UPSC on pure white canvas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest flex items-center justify-center text-m3-on-surface-variant transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body with Contained Scrollbar */}
        <div className="overflow-y-auto px-5 sm:px-6 py-4 flex-1 custom-modal-scrollbar space-y-4">
          {/* Tab & Preset Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Mode Switcher: Draw vs Type */}
            <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/30">
              <button
                type="button"
                onClick={() => setTab('draw')}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  tab === 'draw'
                    ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                <span className="material-symbols-rounded text-[16px]">gesture</span>
                <span>Draw Signature</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('type')}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  tab === 'type'
                    ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                <span className="material-symbols-rounded text-[16px]">edit_note</span>
                <span>Type Signature</span>
              </button>
            </div>

            {/* Ink Color Picker */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-m3-outline text-[11px]">Ink:</span>
              <button
                type="button"
                onClick={() => setInkColor('#000000')}
                className={`w-7 h-7 rounded-full bg-black border-2 transition active:scale-90 cursor-pointer ${
                  inkColor === '#000000' ? 'border-m3-primary scale-110 shadow-sm' : 'border-transparent'
                }`}
                title="Black Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#0F3B82')}
                className={`w-7 h-7 rounded-full bg-[#0F3B82] border-2 transition active:scale-90 cursor-pointer ${
                  inkColor === '#0F3B82' ? 'border-m3-primary scale-110 shadow-sm' : 'border-transparent'
                }`}
                title="Blue Ink"
              />
            </div>
          </div>

          {/* Target Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-m3-outline uppercase tracking-wider block">
              Target Official Dimensions:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPreset(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 cursor-pointer border ${
                    selectedPreset.id === p.id
                      ? 'bg-m3-secondary-container text-m3-on-secondary-container border-m3-secondary shadow-xs'
                      : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Mode Controls */}
          {tab === 'type' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type candidate full name..."
                className="bg-m3-surface-container-high rounded-xl px-3.5 py-2 text-xs sm:text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
              />
              <select
                value={selectedFont.id}
                onChange={(e) => setSelectedFont(FONTS.find((f) => f.id === e.target.value) || FONTS[0])}
                className="bg-m3-surface-container-high rounded-xl px-3.5 py-2 text-xs sm:text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Drawing Canvas Area */}
          <div className="space-y-2">
            <div className="relative rounded-2xl bg-white p-2 border-2 border-dashed border-m3-outline-variant/60 shadow-sm flex items-center justify-center overflow-hidden min-h-[200px]">
              <canvas
                ref={canvasRef}
                width={selectedPreset.width}
                height={selectedPreset.height}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-auto max-h-[220px] object-contain cursor-crosshair touch-none select-none"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none select-none text-xs gap-1">
                  <span className="material-symbols-rounded text-[24px]">gesture</span>
                  <span>{tab === 'draw' ? 'Draw your signature here with finger or mouse' : 'Type name above to generate signature'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-m3-on-surface-variant px-1">
              <span className="text-[11px]">
                Canvas: <strong className="text-m3-on-surface font-mono">{selectedPreset.width} × {selectedPreset.height} px</strong> (Aspect {selectedPreset.aspect})
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-m3-error hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-rounded text-[14px]">delete</span>
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 sm:p-5 border-t border-m3-outline-variant/30 flex-shrink-0 flex flex-col sm:flex-row items-center justify-end gap-3 bg-m3-surface-container-low/50">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-semibold text-m3-on-surface-variant hover:text-m3-on-surface bg-m3-surface-container-high transition active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasDrawn}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-m3-on-surface bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <span className="material-symbols-rounded text-[16px]">download</span>
            <span>Download JPG</span>
          </button>
          <button
            type="button"
            onClick={handleLoadIntoWorkspace}
            disabled={!hasDrawn}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold bg-m3-primary text-m3-on-primary hover:brightness-105 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-40"
          >
            <span className="material-symbols-rounded text-[18px] filled">check_circle</span>
            <span>Load into Workspace Resizer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
