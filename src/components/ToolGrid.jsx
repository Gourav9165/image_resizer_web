import React from 'react';

export const TOOLS = [
  {
    id: 'compress',
    title: 'Compress Image',
    subtitle: 'KB Reducer',
    description: 'Reduce JPG/PNG file size to exact target KB (20 KB, 50 KB, 100 KB) with smart binary search.',
    icon: 'compress',
    category: 'Image Resizer',
    badge: 'Target KB',
    colorClass: 'bg-m3-primary/10 text-m3-primary border-m3-primary/20',
  },
  {
    id: 'resize',
    title: 'Resize Image',
    subtitle: 'Pixel, CM & MM',
    description: 'Scale width and height in Pixels, cm, or mm with aspect ratio lock and print DPI configuration.',
    icon: 'aspect_ratio',
    category: 'Image Resizer',
    badge: 'Exact Dimensions',
    colorClass: 'bg-m3-secondary/10 text-m3-secondary border-m3-secondary/20',
  },
  {
    id: 'passport',
    title: 'Passport Photo Maker',
    subtitle: 'Single & 4×6 Sheet',
    description: 'Create standard 3.5 × 4.5 cm passport photos and generate a 6-photo printable sheet on 4×6" photo paper.',
    icon: 'account_box',
    category: 'Exam Tools',
    badge: '4×6" Print Sheet',
    colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'signature',
    title: 'Signature Maker',
    subtitle: 'Digital Sign Generator',
    description: 'Draw signatures with touch/mouse or generate cursive signatures with official exam ratios.',
    icon: 'draw',
    category: 'Exam Tools',
    badge: 'Interactive Canvas',
    colorClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
  {
    id: 'handwriting',
    title: 'Text to Handwriting',
    subtitle: 'Declaration Ready',
    description: 'Turn typed text into realistic handwriting on lined or plain paper for bank online applications.',
    icon: 'history_edu',
    category: 'Exam Tools',
    badge: '800×400 px IBPS',
    colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  {
    id: 'ocr',
    title: 'Image to Text (OCR)',
    subtitle: '100% Client-Side Privacy',
    description: 'Extract text from scanned forms, certificates, and admit cards directly in your browser.',
    icon: 'document_scanner',
    category: 'Utilities',
    badge: 'Local OCR',
    colorClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  {
    id: 'crop',
    title: 'Crop Image',
    subtitle: 'Fixed & Custom Ratio',
    description: 'Crop images with visual grid overlay to exact ratios (1:1, 7:9 passport, 3:1 signature).',
    icon: 'crop',
    category: 'Image Resizer',
    badge: 'Aspect Ratios',
    colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  {
    id: 'convert',
    title: 'Convert Image',
    subtitle: 'JPG, PNG & WebP',
    description: 'Convert between JPG, PNG, and WebP formats instantly with high-quality compression control.',
    icon: 'transform',
    category: 'Utilities',
    badge: 'Multi-Format',
    colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'remove-bg',
    title: 'Remove Background',
    subtitle: 'Transparent PNG',
    description: 'Cut out white or solid backgrounds from passport photos, signatures, and ID cards locally.',
    icon: 'auto_fix_high',
    category: 'Utilities',
    badge: 'Instant Cutout',
    colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  {
    id: 'watermark',
    title: 'Watermark Image',
    subtitle: 'Text & Logo Stamp',
    description: 'Add custom text or logo watermarks with opacity, tile diagonal repeat, and 9-point anchor alignment.',
    icon: 'branding_watermark',
    category: 'Utilities',
    badge: 'Stamp & Tile',
    colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'rotate',
    title: 'Rotate Image',
    subtitle: '90°, 180° & Flip',
    description: 'Rotate photos 90° or 180°, and mirror horizontally or vertically with lossless coordinate transform.',
    icon: 'rotate_right',
    category: 'Image Resizer',
    badge: 'Lossless Flip',
    colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'blur-face',
    title: 'Blur Face & Redact',
    subtitle: 'Privacy Censor',
    description: 'Censor faces, Aadhaar IDs, phone numbers, and private data with interactive blur, pixelate, or blackout boxes.',
    icon: 'blur_on',
    category: 'Utilities',
    badge: '100% Client-Side',
    colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  {
    id: 'upscale',
    title: 'Upscale Image',
    subtitle: '2× & 4× Super-Resolution',
    description: 'Enlarge low-resolution graphics up to 400% using multi-pass stepped interpolation with edge sharpening.',
    icon: 'hdr_enhanced_select',
    category: 'Image Resizer',
    badge: 'HD Enlarge',
    colorClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
  {
    id: 'html-to-image',
    title: 'HTML to Image',
    subtitle: 'Scorecards & Badges',
    description: 'Convert styled HTML/CSS code directly into PNG/JPG images with high-DPI Retina resolution support.',
    icon: 'code',
    category: 'Utilities',
    badge: 'SVG ForeignObject',
    colorClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
];

export default function ToolGrid({
  selectedCategory = 'All',
  onSelectTool,
}) {
  const filteredTools = TOOLS.filter((tool) => {
    if (selectedCategory === 'All') return true;
    return tool.category === selectedCategory;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
      {filteredTools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => onSelectTool(tool)}
          className="group relative p-5 rounded-[24px] bg-m3-surface-container border border-m3-outline-variant/40 hover:border-m3-primary/50 hover:bg-m3-surface-container-high text-left transition-all duration-200 hover:-translate-y-1.5 active:scale-[0.98] cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${tool.colorClass}`}
              >
                <span className="material-symbols-rounded text-[26px] filled">
                  {tool.icon}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-m3-surface-container-highest text-m3-on-surface-variant border border-m3-outline-variant/30">
                {tool.badge}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-m3-on-surface font-display group-hover:text-m3-primary transition-colors">
              {tool.title}
            </h3>
            <span className="text-[11px] font-semibold text-m3-outline block mb-2">
              {tool.subtitle}
            </span>
            <p className="text-xs text-m3-on-surface-variant leading-relaxed line-clamp-3">
              {tool.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-m3-outline-variant/20 flex items-center justify-between text-xs font-bold text-m3-primary">
            <span>Use Tool</span>
            <span className="material-symbols-rounded text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
