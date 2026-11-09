import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const DECLARATION_TEMPLATES = {
  ibps: 'I, [Name of Candidate], hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.',
  general: 'I hereby declare that all the statements and documents submitted in this application are true, complete, and correct to the best of my knowledge and belief.',
};

const FONTS = [
  { id: 'segoe', name: 'Natural Handwriting', font: 'italic {size}px "Segoe Print", "Comic Sans MS", cursive' },
  { id: 'brush', name: 'Running Script', font: 'italic {size}px "Brush Script MT", "Caveat", cursive' },
  { id: 'lucida', name: 'Elegant Cursive', font: 'italic {size}px "Lucida Handwriting", cursive' },
];

export default function HandwritingModal({ isOpen, onClose, onLoadIntoApp }) {
  const [text, setText] = useState(DECLARATION_TEMPLATES.ibps);
  const [paperStyle, setPaperStyle] = useState('ruled'); // 'ruled' | 'plain'
  const [inkColor, setInkColor] = useState('#111827'); // '#111827' (black) | '#0e3e8c' (blue)
  const [fontSize, setFontSize] = useState(20);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);

  // Render canvas whenever parameters change
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = 800;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Paper Background
    if (paperStyle === 'ruled') {
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, width, height);

      // Draw faint ruled horizontal lines
      const lineSpacing = 36;
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      for (let y = 60; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw left red/pink margin line
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, height);
      ctx.stroke();
    } else {
      // Plain white paper
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Render Handwritten Text with Word Wrapping
    const leftMargin = paperStyle === 'ruled' ? 76 : 40;
    const rightMargin = 40;
    const maxWidth = width - leftMargin - rightMargin;
    const fontString = selectedFont.font.replace('{size}', fontSize);
    ctx.font = fontString;
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'middle';

    const words = text.split(/\s+/);
    let line = '';
    const lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    const startY = paperStyle === 'ruled' ? 58 : 60;
    const lineSpacing = paperStyle === 'ruled' ? 36 : Math.max(30, fontSize + 14);

    lines.forEach((l, index) => {
      const y = startY + index * lineSpacing;
      if (y < height - 20) {
        ctx.fillText(l, leftMargin, y);
      }
    });
  }, [isOpen, text, paperStyle, inkColor, fontSize, selectedFont]);

  if (!isOpen) return null;

  // Actions
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6750a4', '#7d5260', '#196836', '#eaddff'],
    });

    const link = document.createElement('a');
    link.download = 'handwritten_declaration_800x400.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.warn('Clipboard write failed:', e);
      }
    }, 'image/png');
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'handwritten_declaration.jpg', { type: 'image/jpeg' });
      if (onLoadIntoApp) {
        onLoadIntoApp(file, 'declaration');
      }
      onClose();
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-m3-tertiary-container text-m3-on-tertiary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-[22px] filled">history_edu</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  Text to Handwriting Converter
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  Bank Declaration Ready
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Transform typed text into realistic handwriting on lined or plain paper (800 × 400 px).
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
          {/* Quick Insert Templates */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-m3-on-surface-variant">Quick Fill:</span>
            <button
              type="button"
              onClick={() => setText(DECLARATION_TEMPLATES.ibps)}
              className="px-3 py-1 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 text-xs font-semibold text-m3-on-surface transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-rounded text-[14px] text-m3-primary filled">description</span>
              <span>IBPS Declaration</span>
            </button>
            <button
              type="button"
              onClick={() => setText(DECLARATION_TEMPLATES.general)}
              className="px-3 py-1 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 text-xs font-semibold text-m3-on-surface transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-rounded text-[14px] text-m3-secondary filled">article</span>
              <span>General Declaration</span>
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="px-3 py-1 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 text-xs font-semibold text-m3-outline transition active:scale-95 cursor-pointer ml-auto"
            >
              Clear Text
            </button>
          </div>

          {/* Text Input Area */}
          <div>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your declaration text here..."
              className="w-full p-3.5 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/50 focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-xs sm:text-sm text-m3-on-surface placeholder-m3-outline resize-none transition outline-hidden"
            />
            <div className="flex justify-between items-center text-[11px] text-m3-outline px-1 mt-1">
              <span>Tip: Replace [Name of Candidate] with your full name before saving.</span>
              <span>{text.length} characters</span>
            </div>
          </div>

          {/* Style Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-m3-surface-container-low p-3.5 rounded-2xl border border-m3-outline-variant/30 text-xs">
            {/* Paper Style */}
            <div>
              <label className="font-bold text-m3-on-surface block mb-1.5">Paper Style</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaperStyle('ruled')}
                  className={`flex-1 py-1 px-2 rounded-xl font-bold transition active:scale-95 cursor-pointer border ${
                    paperStyle === 'ruled'
                      ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                      : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40'
                  }`}
                >
                  Ruled Lines
                </button>
                <button
                  type="button"
                  onClick={() => setPaperStyle('plain')}
                  className={`flex-1 py-1 px-2 rounded-xl font-bold transition active:scale-95 cursor-pointer border ${
                    paperStyle === 'plain'
                      ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                      : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40'
                  }`}
                >
                  Plain White
                </button>
              </div>
            </div>

            {/* Ink Color */}
            <div>
              <label className="font-bold text-m3-on-surface block mb-1.5">Ink Color</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setInkColor('#111827')}
                  className={`flex-1 py-1 px-2 rounded-xl font-bold transition active:scale-95 cursor-pointer border flex items-center justify-center gap-1 ${
                    inkColor === '#111827'
                      ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                      : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0 border border-white/50" />
                  <span>Black</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInkColor('#0e3e8c')}
                  className={`flex-1 py-1 px-2 rounded-xl font-bold transition active:scale-95 cursor-pointer border flex items-center justify-center gap-1 ${
                    inkColor === '#0e3e8c'
                      ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                      : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-700 shrink-0 border border-white/50" />
                  <span>Blue</span>
                </button>
              </div>
            </div>

            {/* Font Handwriting Style */}
            <div>
              <label className="font-bold text-m3-on-surface block mb-1.5">Font Style</label>
              <select
                value={selectedFont.id}
                onChange={(e) => {
                  const found = FONTS.find((f) => f.id === e.target.value);
                  if (found) setSelectedFont(found);
                }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-m3-surface-container-high border border-m3-outline-variant/40 font-semibold text-m3-on-surface cursor-pointer text-xs outline-hidden"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-m3-on-surface">Size</label>
                <span className="text-m3-outline font-mono text-[11px]">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-m3-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Live Canvas Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-m3-on-surface-variant">
              <span className="font-bold">Live Document Preview (800 × 400 px)</span>
              <span className="text-[11px] font-mono text-m3-primary">Standard IBPS Declaration Dimensions</span>
            </div>
            <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 bg-m3-surface-container shadow-inner flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[700px] h-auto object-contain rounded-xl shadow-xs"
                style={{ aspectRatio: '2 / 1' }}
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons Footer */}
        <div className="p-4 sm:p-5 border-t border-m3-outline-variant/30 flex-shrink-0 flex flex-wrap items-center justify-end gap-2.5 bg-m3-surface-container-low/50">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-outline-variant/40"
          >
            <span className="material-symbols-rounded text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied Image!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
          >
            <span className="material-symbols-rounded text-[18px]">download</span>
            <span>Download JPG</span>
          </button>

          <button
            type="button"
            onClick={handleLoadWorkspace}
            className="py-2.5 px-5 rounded-full bg-m3-primary hover:brightness-105 text-m3-on-primary font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-rounded text-[18px] filled">tune</span>
            <span>Load into Workspace Resizer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
