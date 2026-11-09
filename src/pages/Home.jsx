import React, { useState } from 'react';
import ToolGrid from '../components/ToolGrid';
import { searchExams } from '../data/examRoutes';

const QUICK_TAGS = [
  'All',
  'IBPS',
  'SBI',
  'Bank',
  'UPSC',
  'OTR',
  'Thumb',
  'Declaration',
  'RRB',
  'NTPC',
  'Group D',
  'ALP',
  'SSC',
  'CGL',
  'CHSL',
  'MTS',
  'MPPSC',
  'UPPSC',
  'State PSC',
  'Passport',
  'Print',
  '4x6',
  'Sheet',
  'Photo Maker',
];

const TOOL_CATEGORIES = [
  { id: 'All', label: 'All Tools', icon: 'apps' },
  { id: 'Exam Tools', label: 'Exam Tools', icon: 'school' },
  { id: 'Image Resizer', label: 'Image Resizer', icon: 'crop_free' },
  { id: 'Utilities', label: 'Utilities', icon: 'construction' },
];

export default function Home({ onSelectTool, onSelectExamRoute }) {
  const [toolFilterCategory, setToolFilterCategory] = useState('All');
  const [isExamExpanded, setIsExamExpanded] = useState(false);
  const [selectedExamCategory, setSelectedExamCategory] = useState('All Exams');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Filtered exams based on category, search query, or quick tag
  const categoryFilter =
    selectedExamCategory === 'All Exams'
      ? 'All'
      : selectedExamCategory === 'SSC'
      ? 'SSC'
      : selectedExamCategory === 'Railways (RRB)'
      ? 'Railways (RRB)'
      : selectedExamCategory === 'Banking (IBPS / SBI)'
      ? 'Banking (IBPS / SBI)'
      : selectedExamCategory === 'State PSC'
      ? 'State PSC'
      : selectedExamCategory === 'UPSC'
      ? 'UPSC'
      : 'All';

  const effectiveQuery = selectedTag !== 'All' ? selectedTag : searchQuery;
  const filteredExams = searchExams(effectiveQuery, categoryFilter);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-4 space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Header & Subtitle */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-m3-on-surface font-display">
          Every Tool You Need for{' '}
          <span className="text-m3-primary">Exams &amp; Image Editing</span>
        </h1>
        <p className="text-sm sm:text-base text-m3-on-surface-variant max-w-2xl mx-auto">
          100% Client-Side. Fast, accurate, and your photos never leave your device.
        </p>
      </div>

      {/* 2. Category Filter Pill Bar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
        {TOOL_CATEGORIES.map((cat) => {
          const isSelected = toolFilterCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setToolFilterCategory(cat.id)}
              className={`py-2 px-4 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 border ${
                isSelected
                  ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                  : 'bg-m3-surface-container hover:bg-m3-surface-container-high text-m3-on-surface-variant hover:text-m3-on-surface border-m3-outline-variant/40'
              }`}
            >
              <span className="material-symbols-rounded text-[16px] leading-none select-none">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Prominent Rectangular Highlight Banner ("Exam Resizer: Choose Your Exam") */}
      <div className="bg-m3-surface-container rounded-[26px] border border-m3-outline-variant/40 overflow-hidden shadow-sm transition-all duration-300">
        {/* Clickable Header Banner */}
        <div
          onClick={() => setIsExamExpanded(!isExamExpanded)}
          className="p-4 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-m3-surface-container-high/60 active:scale-[0.99] transition-transform duration-150 select-none"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-m3-primary-container flex items-center justify-center text-m3-on-primary-container shrink-0 shadow-sm">
              <span className="material-symbols-rounded text-[24px] leading-none select-none filled">
                school
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-m3-on-surface font-display">
                  Exam Resizer: Choose Your Exam
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-m3-primary text-m3-on-primary shadow-xs">
                  Official Presets
                </span>
              </div>
              <p className="text-xs text-m3-on-surface-variant m-0 mt-0.5 hidden sm:block">
                Exact dimensions &amp; file size bounds for SSC, Railways (RRB), Banking (IBPS/SBI), State PSCs &amp; UPSC.
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full flex items-center justify-center text-m3-on-surface-variant">
            <span
              className={`material-symbols-rounded text-[24px] leading-none select-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isExamExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </div>
        </div>

        {/* Collapsible Content with Butter-Smooth Spring Motion */}
        <div
          className={`grid transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isExamExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-6 pt-2 sm:px-6 border-t border-m3-outline-variant/20 space-y-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth p-1 rounded-full bg-m3-surface-container-high border border-m3-outline-variant/40 shadow-xs">
                {[
                  { id: 'All Exams', label: 'All Exams', icon: 'apps' },
                  { id: 'SSC', label: 'SSC', icon: 'badge' },
                  { id: 'Railways (RRB)', label: 'Railways', icon: 'train' },
                  { id: 'Banking (IBPS / SBI)', label: 'Banking', icon: 'account_balance' },
                  { id: 'State PSC', label: 'State PSC', icon: 'assured_workload' },
                  { id: 'UPSC', label: 'UPSC', icon: 'account_circle' },
                ].map((cat) => {
                  const isSelected = selectedExamCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedExamCategory(cat.id);
                        setSelectedTag('All');
                      }}
                      className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                          : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                      }`}
                    >
                      <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center">
                        {cat.icon}
                      </span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Informational Notices & Quick Preset Action Cards */}
              {selectedExamCategory === 'Banking (IBPS / SBI)' && (
                <div className="p-3.5 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs text-m3-on-surface-variant space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-[18px] text-m3-primary filled shrink-0">
                      account_balance
                    </span>
                    <span className="font-bold text-m3-on-surface">
                      Official IBPS / SBI Banking Upload Specifications:
                    </span>
                  </div>
                  <p className="m-0 text-[11px] leading-relaxed">
                    Resolution: <strong>200 DPI True Color</strong>. Signature and Declaration must be written with a{' '}
                    <strong>BLACK INK PEN</strong> in running handwriting. <strong>Capital letters will be rejected.</strong>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'Banking (IBPS / SBI)').find((e) => e.slug === 'ibps-photo-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">account_box</span>
                        <span>Photo</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">200×230 px • 20–50 KB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'Banking (IBPS / SBI)').find((e) => e.slug === 'ibps-signature-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">draw</span>
                        <span>Signature</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">140×60 px • 10–20 KB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'Banking (IBPS / SBI)').find((e) => e.slug === 'ibps-thumb-impression-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">fingerprint</span>
                        <span>Thumb (LTI)</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">240×240 px • 20–50 KB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'Banking (IBPS / SBI)').find((e) => e.slug === 'ibps-declaration-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">description</span>
                        <span>Declaration</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">800×400 px • 50–100 KB</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedExamCategory === 'State PSC' && (
                <div className="p-3.5 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs text-m3-on-surface-variant space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-[18px] text-m3-primary filled shrink-0">
                      assured_workload
                    </span>
                    <span className="font-bold text-m3-on-surface">
                      Official State Public Service Commission Upload Specifications:
                    </span>
                  </div>
                  <p className="m-0 text-[11px] leading-relaxed">
                    Official presets for <strong>MPPSC</strong> (275 × 354 px Photo, 275 × 118 px Sign) and{' '}
                    <strong>UPPSC</strong> (180 × 216 px Photo, 216 × 108 px Sign) with automatic pixel-ratio scaling.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'State PSC').find((e) => e.slug === 'mppsc-photo-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">account_box</span>
                        <span>MPPSC Photo</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">275×354 px • 25–200 KB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'State PSC').find((e) => e.slug === 'mppsc-signature-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">draw</span>
                        <span>MPPSC Sign</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">275×118 px • 25–200 KB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'State PSC').find((e) => e.slug === 'uppsc-photo-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">account_box</span>
                        <span>UPPSC Photo</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">180×216 px • 20–50 KB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'State PSC').find((e) => e.slug === 'uppsc-signature-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-2.5 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[16px] text-m3-primary filled">draw</span>
                        <span>UPPSC Sign</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-0.5">216×108 px • 10–30 KB</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedExamCategory === 'UPSC' && (
                <div className="p-3.5 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs text-m3-on-surface-variant space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-[18px] text-m3-primary filled shrink-0">
                      account_circle
                    </span>
                    <span className="font-bold text-m3-on-surface">
                      Union Public Service Commission (UPSC OTR) Specifications:
                    </span>
                  </div>
                  <p className="m-0 text-[11px] leading-relaxed">
                    Square <strong>350 × 350 px</strong> (Aspect 1:1) in JPG/JPEG. Recent photograph against a clean white background.
                    Signature signed in black or blue ink on plain unruled paper.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'UPSC').find((e) => e.slug === 'upsc-photo-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-3 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[18px] text-m3-primary filled">account_box</span>
                        <span>UPSC Photo (OTR / CSE / NDA)</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-1">
                        350 × 350 px (1:1) • 20 KB – 200 KB
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const ex = searchExams('', 'UPSC').find((e) => e.slug === 'upsc-signature-resizer');
                        if (ex) onSelectExamRoute(ex);
                      }}
                      className="p-3 rounded-xl bg-m3-surface-container-low hover:bg-m3-primary-container text-left transition border border-m3-outline-variant/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-m3-on-surface">
                        <span className="material-symbols-rounded text-[18px] text-m3-primary filled">draw</span>
                        <span>UPSC Signature</span>
                      </div>
                      <span className="text-[10px] text-m3-primary font-semibold block mt-1">
                        350 × 350 px (1:1) • 20 KB – 100 KB
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {selectedExamCategory === 'Railways (RRB)' && (
                <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs text-m3-on-surface-variant flex items-center gap-2.5">
                  <span className="material-symbols-rounded text-[18px] text-m3-secondary filled shrink-0">train</span>
                  <span>
                    <strong>Notice (CEN 09/2026):</strong> Railway (RRB) requires live camera capture for photos. Signature upload is strictly mandatory (50 mm × 20 mm, 30 KB – 49 KB).
                  </span>
                </div>
              )}

              {selectedExamCategory === 'SSC' && (
                <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs text-m3-on-surface-variant flex items-center gap-2.5">
                  <span className="material-symbols-rounded text-[18px] text-m3-tertiary filled shrink-0">info</span>
                  <span>
                    <strong>Notice:</strong> SSC portal now requires Live Photo capture on ssc.gov.in / MySSC app. Scanned signature is mandatory (6.0 × 2.0 cm / 4.0 × 2.0 cm, 10–20 KB).
                  </span>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-rounded absolute left-3.5 top-1/2 -translate-y-1/2 text-m3-outline text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search exam (e.g. UPSC, Passport, 4x6, NTPC, Group D, ALP, CGL, MPPSC, UPPSC)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedTag('All');
                  }}
                  className="w-full bg-m3-surface-container-high rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary placeholder:text-m3-outline transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-m3-outline hover:text-m3-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-rounded text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Quick Filter Tag Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-1">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTag === tag && !searchQuery;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTag(tag);
                        setSearchQuery('');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition active:scale-95 cursor-pointer border ${
                        isSelected
                          ? 'bg-m3-secondary-container text-m3-on-secondary-container border-m3-secondary-container shadow-xs'
                          : 'bg-m3-surface-container-high text-m3-on-surface-variant hover:text-m3-on-surface border-m3-outline-variant/40'
                      }`}
                    >
                      {tag === 'All' ? 'All Tags' : tag}
                    </button>
                  );
                })}
              </div>

              {/* Filtered Exam Preset Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredExams.map((exam) => (
                  <button
                    key={exam.slug}
                    type="button"
                    onClick={() => onSelectExamRoute(exam)}
                    className="p-3.5 rounded-[22px] text-left transition active:scale-[0.98] cursor-pointer border bg-m3-surface-container-low hover:bg-m3-surface-container-high border-m3-outline-variant/40 text-m3-on-surface-variant hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-m3-on-surface">
                        <span className="material-symbols-rounded text-[18px] text-m3-primary filled">
                          {exam.docType === 'photo'
                            ? 'account_box'
                            : exam.docType === 'thumb'
                            ? 'fingerprint'
                            : exam.docType === 'declaration'
                            ? 'description'
                            : 'draw'}
                        </span>
                        {exam.examShortName} (
                        {exam.docType === 'photo'
                          ? 'Photo'
                          : exam.docType === 'thumb'
                          ? 'Thumb (LTI)'
                          : exam.docType === 'declaration'
                          ? 'Declaration'
                          : 'Signature'}
                        )
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exam.category === 'Banking (IBPS / SBI)'
                            ? 'bg-m3-primary-container text-m3-on-primary-container'
                            : exam.category === 'Railways (RRB)'
                            ? 'bg-m3-secondary-container text-m3-on-secondary-container'
                            : exam.category === 'State PSC'
                            ? 'bg-m3-tertiary-container text-m3-on-tertiary-container'
                            : exam.category === 'UPSC'
                            ? 'bg-m3-primary text-m3-on-primary'
                            : exam.category === 'Passport Photo'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-m3-surface-container-highest text-m3-on-surface-variant'
                        }`}
                      >
                        {exam.category === 'Banking (IBPS / SBI)'
                          ? 'Banking'
                          : exam.category === 'Railways (RRB)'
                          ? 'RRB'
                          : exam.category === 'State PSC'
                          ? 'State PSC'
                          : exam.category === 'UPSC'
                          ? 'UPSC'
                          : exam.category === 'Passport Photo'
                          ? 'Passport'
                          : 'SSC'}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-m3-on-surface mb-0.5">
                      {exam.specs?.unit === 'px'
                        ? `${exam.specs.widthPx} × ${exam.specs.heightPx} px`
                        : `${exam.specs?.widthCm} × ${exam.specs?.heightCm} cm`}{' '}
                      • {exam.specs?.minKB}–{exam.specs?.maxKB} KB
                    </p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {exam.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.2 rounded-md bg-m3-surface-container-highest text-[10px] text-m3-outline font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Material 3 Expressive Tool Card Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-m3-on-surface-variant px-1">
          <span className="font-bold uppercase tracking-wider text-[11px]">
            {toolFilterCategory === 'All' ? 'Available Image Tools' : toolFilterCategory}
          </span>
          <span className="text-[11px] text-m3-outline">Click any card to start</span>
        </div>
        <ToolGrid selectedCategory={toolFilterCategory} onSelectTool={onSelectTool} />
      </div>
    </div>
  );
}
