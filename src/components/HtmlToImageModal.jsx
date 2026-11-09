import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const TEMPLATES = [
  {
    id: 'scorecard',
    name: 'Exam Scorecard / Result Notice',
    html: `<div class="card">
  <div class="header">
    <div class="logo">GOVERNMENT EXAM COMMISSION</div>
    <div class="sub">COMBINED CANDIDATE SCORECARD 2026</div>
  </div>
  <div class="details">
    <div class="row"><span>Roll Number:</span><strong>2026-SSC-98412</strong></div>
    <div class="row"><span>Candidate Name:</span><strong>PRIYA VERMA</strong></div>
    <div class="row"><span>Exam Name:</span><strong>CGL Tier-I Examination</strong></div>
    <div class="row"><span>Category / Quota:</span><strong>UR (General)</strong></div>
  </div>
  <table class="table">
    <thead>
      <tr><th>Subject</th><th>Max Marks</th><th>Marks Scored</th></tr>
    </thead>
    <tbody>
      <tr><td>General Intelligence</td><td>50</td><td>46.50</td></tr>
      <tr><td>General Awareness</td><td>50</td><td>42.00</td></tr>
      <tr><td>Quantitative Aptitude</td><td>50</td><td>48.00</td></tr>
      <tr><td>English Comprehension</td><td>50</td><td>45.50</td></tr>
    </tbody>
  </table>
  <div class="footer">
    <span>TOTAL SCORE: <strong>182.00 / 200</strong></span>
    <span class="badge">QUALIFIED FOR TIER-II</span>
  </div>
</div>`,
    css: `.card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #ffffff;
  padding: 32px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.header {
  border-bottom: 2px solid #2563eb;
  padding-bottom: 12px;
  text-align: center;
}
.logo { font-size: 18px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; }
.sub { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 4px; }
.details { margin: 16px 0; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 12px; border-radius: 8px; }
.row { display: flex; justify-content: space-between; padding-right: 8px; }
.row span { color: #64748b; }
.table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0; }
.table th, .table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table th { background: #f1f5f9; color: #334155; font-weight: 700; }
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 2px solid #e2e8f0;
  font-size: 14px;
}
.badge {
  background: #10b981;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 11px;
}`,
  },
  {
    id: 'badge',
    name: 'Candidate Admit Card / ID Badge',
    html: `<div class="badge-card">
  <div class="top-bar">OFFICIAL ADMIT CARD &bull; SESSION 2026</div>
  <div class="main-body">
    <div class="photo-box">
      <div class="photo-placeholder">PHOTO</div>
      <div class="barcode">||| | |||| | ||| ||||</div>
    </div>
    <div class="info">
      <h3>RAHUL SHARMA</h3>
      <div class="item"><span>Registration:</span> <strong>IBPS-PO-202677</strong></div>
      <div class="item"><span>Post:</span> <strong>Probationary Officer</strong></div>
      <div class="item"><span>Date:</span> <strong>18 November 2026</strong></div>
      <div class="item"><span>Venue:</span> <strong>TCS iON Digital Zone, Sector 62</strong></div>
      <div class="item"><span>Reporting Time:</span> <strong>08:30 AM (Shift 1)</strong></div>
    </div>
  </div>
  <div class="warning">&bull; Carry Original Photo ID &amp; 2 Passport Photographs</div>
</div>`,
    css: `.badge-card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
}
.top-bar { font-size: 12px; font-weight: 700; color: #a5b4fc; letter-spacing: 1px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 10px; }
.main-body { display: flex; gap: 24px; align-items: center; margin: 16px 0; }
.photo-box { width: 120px; text-align: center; }
.photo-placeholder { width: 110px; height: 130px; background: #e2e8f0; color: #64748b; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 2px solid #ffffff; }
.barcode { font-family: monospace; font-size: 12px; color: #c7d2fe; margin-top: 6px; letter-spacing: 2px; }
.info h3 { margin: 0 0 10px 0; font-size: 18px; color: #fbbf24; font-weight: 800; }
.item { font-size: 12px; color: #e0e7ff; margin-bottom: 6px; }
.item span { color: #a5b4fc; margin-right: 6px; }
.warning { background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; padding: 8px; font-size: 11px; color: #fca5a5; text-align: center; }`,
  },
  {
    id: 'quote',
    name: 'Official Announcement / Banner',
    html: `<div class="announcement">
  <div class="tag">IMPORTANT UPDATE</div>
  <h1>Admit Cards Released for Tier-1 Exam</h1>
  <p>Candidates can now download their e-Admit Cards and check examination centers by logging into the application portal using their Registration ID and Date of Birth.</p>
  <div class="meta">
    <span>Exam Date: <strong>24th Nov 2026</strong></span>
    <span>&bull;</span>
    <span>Portal: <strong>ssc.gov.in</strong></span>
  </div>
</div>`,
    css: `.announcement {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: radial-gradient(circle at top left, #6366f1, #4338ca 60%, #312e81);
  padding: 40px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tag { display: inline-block; width: fit-content; background: #fbbf24; color: #1e1b4b; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.5px; margin-bottom: 16px; }
h1 { margin: 0 0 14px 0; font-size: 26px; line-height: 1.25; font-weight: 800; }
p { font-size: 14px; line-height: 1.6; color: #e0e7ff; margin: 0 0 24px 0; max-width: 90%; }
.meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: #c7d2fe; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; }`,
  },
];

export default function HtmlToImageModal({
  isOpen,
  onClose,
  onLoadIntoApp,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [htmlCode, setHtmlCode] = useState(TEMPLATES[0].html);
  const [cssCode, setCssCode] = useState(TEMPLATES[0].css);
  const [scale, setScale] = useState(1); // 1x (800x500) | 2x (1600x1000)
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState(null);

  const canvasRef = useRef(null);
  const baseWidth = 800;
  const baseHeight = 500;

  useEffect(() => {
    if (!isOpen) {
      setRenderError(null);
    }
  }, [isOpen]);

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    setHtmlCode(template.html);
    setCssCode(template.css);
  };

  // Pure in-browser rendering via SVG ForeignObject
  const renderCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    setRenderError(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const targetW = baseWidth * scale;
    const targetH = baseHeight * scale;

    canvas.width = targetW;
    canvas.height = targetH;

    try {
      // Build pure standalone SVG with foreignObject embedding the HTML and CSS
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${baseWidth}" height="${baseHeight}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;">
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ${cssCode}
              </style>
              ${htmlCode}
            </div>
          </foreignObject>
        </svg>
      `;

      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);
        URL.revokeObjectURL(url);
        setIsRendering(false);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setRenderError('Failed to parse HTML/CSS. Ensure tags and brackets are well-formed.');
        setIsRendering(false);
      };

      img.src = url;
    } catch (err) {
      setRenderError(err.message || 'Error compiling SVG image');
      setIsRendering(false);
    }
  }, [htmlCode, cssCode, scale]);

  useEffect(() => {
    if (isOpen) {
      renderCanvas();
    }
  }, [isOpen, renderCanvas]);

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

    const url = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html_export_${scale}x.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onLoadIntoApp) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const exportFile = new File([blob], `html_export_${scale}x.jpg`, { type: 'image/jpeg' });
      onLoadIntoApp(exportFile);
      onClose();
    }, 'image/jpeg', 0.95);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-m3-surface rounded-3xl border border-m3-outline-variant/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-m3-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <span className="material-symbols-rounded text-[22px] filled">code</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-m3-on-surface font-display m-0">
                  HTML to Image
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-m3-primary-container text-m3-on-primary-container">
                  In-Browser SVG ForeignObject
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5">
                Render custom HTML/CSS scorecards, admit cards, or announcements to PNG/JPG.
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
          {/* Top Options: Template Selector & Resolution */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low p-3 rounded-2xl border border-m3-outline-variant/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-m3-on-surface">Template:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateChange(t)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition active:scale-95 cursor-pointer whitespace-nowrap border ${
                      selectedTemplate.id === t.id
                        ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                        : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-m3-outline">Resolution:</span>
              <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setScale(1)}
                  className={`py-1 px-3 rounded-full font-bold transition cursor-pointer ${
                    scale === 1 ? 'bg-m3-primary text-m3-on-primary shadow-xs' : 'text-m3-on-surface-variant'
                  }`}
                >
                  1× (800×500)
                </button>
                <button
                  type="button"
                  onClick={() => setScale(2)}
                  className={`py-1 px-3 rounded-full font-bold transition cursor-pointer ${
                    scale === 2 ? 'bg-m3-primary text-m3-on-primary shadow-xs' : 'text-m3-on-surface-variant'
                  }`}
                >
                  2× Retina (1600×1000)
                </button>
              </div>
            </div>
          </div>

          {/* Error notice if any */}
          {renderError && (
            <div className="p-3 rounded-xl bg-m3-error-container text-m3-on-error-container text-xs flex items-center gap-2">
              <span className="material-symbols-rounded text-[18px]">error</span>
              <span>{renderError}</span>
            </div>
          )}

          {/* Split Editor: Left Code Editors, Right Canvas Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: HTML & CSS Code Textareas (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-m3-on-surface block mb-1">
                  HTML Markup
                </label>
                <textarea
                  rows={7}
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-m3-surface-container-low border border-m3-outline-variant/40 focus:border-m3-primary text-xs font-mono text-m3-on-surface resize-y outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-m3-on-surface block mb-1">
                  CSS Styling
                </label>
                <textarea
                  rows={7}
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-m3-surface-container-low border border-m3-outline-variant/40 focus:border-m3-primary text-xs font-mono text-m3-on-surface resize-y outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={renderCanvas}
                className="w-full py-2 px-3 rounded-xl bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 text-xs font-bold text-m3-primary transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-rounded text-[18px]">play_arrow</span>
                <span>Update / Re-render Canvas</span>
              </button>
            </div>

            {/* Right: Live Rendered Output (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <label className="text-xs font-bold text-m3-on-surface block mb-1">
                Live Rendered Canvas Output ({baseWidth * scale} × {baseHeight * scale} px)
              </label>
              <div className="w-full overflow-hidden rounded-2xl border border-m3-outline-variant/40 bg-zinc-950/40 shadow-inner flex items-center justify-center p-3 flex-1 min-h-[340px]">
                {isRendering ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-m3-primary animate-pulse">
                    <span className="material-symbols-rounded text-[28px] animate-spin">sync</span>
                    <span className="text-xs font-semibold">Compiling SVG to Canvas...</span>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto max-h-[380px] object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 sm:p-5 border-t border-m3-outline-variant/30 flex-shrink-0 flex flex-wrap items-center justify-between gap-3 bg-m3-surface-container-low/50">
          <div className="text-xs text-m3-outline">
            Export scale: <strong className="font-mono text-m3-on-surface">{scale}×</strong> ({baseWidth * scale} × {baseHeight * scale} px)
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownload('png')}
              className="py-2.5 px-4 rounded-full bg-m3-secondary-container hover:brightness-105 text-m3-on-secondary-container font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-secondary/20 shadow-xs"
            >
              <span className="material-symbols-rounded text-[18px]">download</span>
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('jpg')}
              className="py-2.5 px-4 rounded-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-m3-outline-variant/40"
            >
              <span className="material-symbols-rounded text-[18px]">download</span>
              <span>Download JPG</span>
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
      </div>
    </div>
  );
}
