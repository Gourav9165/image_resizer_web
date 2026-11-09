import React, { useState } from 'react';
import { DPI_PRESETS } from '../utils/compressor';

const TARGET_PRESETS = [20, 50, 100, 200];
const QUALITY_PRESETS = [60, 75, 90, 100];

export default function ControlPanel({
  mode = 'manual',
  setMode,
  sscPreset = null,
  setSscPreset,
  activeExam = null,
  activeTool = null,
  originalInfo = null,
  targetKB = 50,
  setTargetKB,
  useTargetKB = true,
  setUseTargetKB,
  width,
  height,
  unit = 'px',
  setUnit,
  dpi = 96,
  setDpi,
  aspectLocked = true,
  setAspectLocked,
  onWidthChange,
  onHeightChange,
  onScalePreset,
  mimeType = 'image/jpeg',
  setMimeType,
  quality = 90,
  setQuality,
  nameDateOptions = { enabled: false, name: '', date: '' },
  setNameDateOptions,
  enhanceSignature = false,
  setEnhanceSignature,
  isProcessing = false,
  onApplyManual,
}) {
  const [showAdvancedDimensions, setShowAdvancedDimensions] = useState(false);
  const [showAdvancedTargetKB, setShowAdvancedTargetKB] = useState(false);
  const [showAdvancedConvert, setShowAdvancedConvert] = useState(false);

  const currentDocType = activeExam?.docType || sscPreset;
  const isSignatureOnly =
    (mode === 'ssc' || mode === 'rrb' || mode === 'banking' || mode === 'psc' || mode === 'upsc') &&
    (currentDocType === 'signature' || (!currentDocType && mode === 'rrb'));

  // Render Dimensions Component
  const renderDimensionsControls = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-m3-on-surface flex items-center gap-2">
          <span className="material-symbols-rounded text-[20px] text-m3-primary leading-none select-none flex items-center justify-center filled">
            aspect_ratio
          </span>
          <span>Dimensions &amp; Units</span>
        </label>

        {/* M3 Segmented Button for Units: px / mm / cm */}
        <div className="flex bg-m3-surface-container-high p-1 rounded-full border border-m3-outline-variant/40">
          {['px', 'mm', 'cm'].map((u) => {
            const isCurrent = unit === u;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-m3-secondary-container text-m3-on-secondary-container shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                {isCurrent && (
                  <span className="material-symbols-rounded text-[14px] leading-none select-none flex items-center justify-center filled">
                    check
                  </span>
                )}
                <span>{u.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Print DPI Selector if mm or cm is active */}
      {unit !== 'px' && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 text-xs">
          <div className="flex items-center gap-2 text-m3-on-surface">
            <span className="material-symbols-rounded text-[18px] text-m3-tertiary leading-none select-none flex items-center justify-center filled">
              print
            </span>
            <span>Print Resolution:</span>
          </div>
          <select
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            className="bg-m3-surface-container-highest border border-m3-outline-variant/60 rounded-xl px-2.5 py-1 text-xs text-m3-on-surface font-medium focus:outline-none focus:border-m3-primary cursor-pointer"
          >
            {DPI_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Width & Height Inputs with Lock */}
      <div className="flex items-end gap-2.5">
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-m3-on-surface-variant flex justify-between">
            <span>Width</span>
            <span className="text-m3-outline text-[10px]">({unit})</span>
          </label>
          <input
            type="number"
            min="1"
            step={unit === 'px' ? '1' : '0.1'}
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            className="w-full bg-m3-surface-container-highest border border-m3-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-m3-on-surface font-semibold focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary"
          />
        </div>

        <div className="flex flex-col items-center justify-center pb-0.5">
          <button
            type="button"
            onClick={() => setAspectLocked(!aspectLocked)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer border ${
              aspectLocked
                ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                : 'bg-m3-surface-container-high text-m3-outline border-m3-outline-variant/40 hover:text-m3-on-surface'
            }`}
            title={aspectLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
          >
            <span className="material-symbols-rounded text-[20px] leading-none select-none flex items-center justify-center">
              {aspectLocked ? 'lock' : 'lock_open'}
            </span>
          </button>
        </div>

        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-m3-on-surface-variant flex justify-between">
            <span>Height</span>
            <span className="text-m3-outline text-[10px]">({unit})</span>
          </label>
          <input
            type="number"
            min="1"
            step={unit === 'px' ? '1' : '0.1'}
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className="w-full bg-m3-surface-container-highest border border-m3-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-m3-on-surface font-semibold focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary"
          />
        </div>
      </div>

      {/* Scale Chips */}
      {mode === 'manual' ? (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-m3-on-surface-variant mr-1">Scale:</span>
          {[0.25, 0.5, 0.75, 1.0].map((scale) => (
            <button
              key={scale}
              type="button"
              onClick={() => onScalePreset(scale)}
              className="flex-1 py-1.5 px-1 rounded-full text-xs font-semibold bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-m3-on-surface-variant hover:text-m3-on-surface border border-m3-outline-variant/40 transition active:scale-95 cursor-pointer"
            >
              {scale * 100}%
            </button>
          ))}
        </div>
      ) : (
        <div className="pt-1 flex items-center justify-between text-xs text-m3-on-surface-variant">
          <span>Aspect Ratio:</span>
          <span className="font-bold text-m3-primary">
            {sscPreset === 'photo'
              ? '7:9 (3.5 × 4.5 cm)'
              : mode === 'rrb'
              ? '5:2 (5.0 × 2.0 cm)'
              : '2:1 (4.0 × 2.0 cm)'}
          </span>
        </div>
      )}
    </div>
  );

  // Render Target KB Component
  const renderTargetKBControls = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-m3-on-surface flex items-center gap-2">
          <span className="material-symbols-rounded text-[20px] text-m3-primary leading-none select-none flex items-center justify-center filled">
            compress
          </span>
          <span>Target Size (KB)</span>
        </label>
        <button
          type="button"
          onClick={() => setUseTargetKB(!useTargetKB)}
          className={`text-xs px-3 py-1 rounded-full font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${
            useTargetKB
              ? 'bg-m3-primary text-m3-on-primary shadow-sm'
              : 'bg-m3-surface-container-high text-m3-on-surface-variant border border-m3-outline-variant/50'
          }`}
        >
          <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center">
            {useTargetKB ? 'check' : 'close'}
          </span>
          <span>{useTargetKB ? 'Target Active (±2 KB)' : 'Disabled'}</span>
        </button>
      </div>

      {useTargetKB && (
        <div className="space-y-3 bg-m3-surface-container-low p-4 rounded-[20px] border border-m3-outline-variant/30">
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-m3-on-surface-variant">
              Quick Preset Chips:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {TARGET_PRESETS.map((preset) => {
                const isSelected = Number(targetKB) === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetKB(preset)}
                    className={`py-2 px-2 text-center rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-m3-primary-container text-m3-on-primary-container border border-m3-primary shadow-sm'
                        : 'bg-m3-surface-container-high text-m3-on-surface-variant hover:bg-m3-surface-container-highest border border-m3-outline-variant/40'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-rounded text-[14px] leading-none select-none flex items-center justify-center filled">
                        check
                      </span>
                    )}
                    <span>{preset} KB</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="relative flex-1">
              <input
                type="number"
                min="5"
                max="10000"
                step="1"
                value={targetKB}
                onChange={(e) => setTargetKB(e.target.value)}
                placeholder="e.g. 35"
                className="w-full bg-m3-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-m3-on-surface font-semibold border border-m3-outline-variant/60 focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary placeholder:text-m3-outline"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-m3-on-surface-variant pointer-events-none">
                KB
              </span>
            </div>
            <span className="text-[11px] text-m3-on-surface-variant max-w-[130px] leading-tight">
              Accurate within <strong className="text-m3-success font-semibold">±2 KB</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Render Format Controls
  const renderFormatControls = () => (
    <div className="space-y-2 pt-2 border-t border-m3-outline-variant/30">
      <label className="text-sm font-semibold text-m3-on-surface flex items-center gap-2">
        <span className="material-symbols-rounded text-[20px] text-m3-primary leading-none select-none flex items-center justify-center filled">
          image
        </span>
        <span>Output Format</span>
      </label>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { id: 'image/jpeg', name: 'JPEG', desc: 'Govt Standard' },
          { id: 'image/webp', name: 'WebP', desc: 'Modern small' },
          { id: 'image/png', name: 'PNG', desc: 'Lossless' },
        ].map((fmt) => {
          const isSelected = mimeType === fmt.id;
          return (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setMimeType(fmt.id)}
              className={`p-3 rounded-[18px] text-left transition active:scale-95 cursor-pointer border ${
                isSelected
                  ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                  : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{fmt.name}</span>
                {isSelected && (
                  <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center filled">
                    check_circle
                  </span>
                )}
              </div>
              <span className="text-[10px] block mt-0.5 opacity-80">{fmt.desc}</span>
            </button>
          );
        })}
      </div>

      {(mode === 'ssc' || mode === 'rrb') && mimeType !== 'image/jpeg' && (
        <p className="text-[11px] text-m3-tertiary bg-m3-tertiary-container/40 border border-m3-tertiary-container p-3 rounded-2xl">
          * Note: Official {mode === 'rrb' ? 'Railway (RRB)' : 'SSC'} portal requires JPG / JPEG format for upload.
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-m3-surface-container rounded-[28px] p-5 sm:p-6 border border-m3-outline-variant/40 space-y-6 shadow-sm">
      {/* Top Presets & Mode Selector (Horizontal flex with smooth scroll on mobile) */}
      <div className="space-y-3 pb-3 border-b border-m3-outline-variant/30">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth p-1 rounded-full bg-m3-surface-container-high border border-m3-outline-variant/40 shadow-xs">
          {[
            { id: 'manual', label: 'General', icon: 'tune' },
            { id: 'banking', label: 'Banking', icon: 'account_balance' },
            { id: 'ssc', label: 'SSC', icon: 'badge' },
            { id: 'rrb', label: 'Railways', icon: 'train' },
            { id: 'psc', label: 'State PSC', icon: 'assured_workload' },
            { id: 'upsc', label: 'UPSC', icon: 'account_circle' },
          ].map((item) => {
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                    : 'text-m3-on-surface-variant hover:text-m3-on-surface'
                }`}
              >
                <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Preset Sub-chips for UPSC */}
        {mode === 'upsc' && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSscPreset('photo')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  activeExam?.slug === 'upsc-photo-resizer' || (activeExam?.docType === 'photo' && mode === 'upsc')
                    ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-rounded text-[18px]">account_box</span>
                  <span className="font-bold text-xs">UPSC Photo</span>
                </div>
                <div className="text-[11px] opacity-80">350 × 350 px &bull; 20–200 KB</div>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('signature')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  activeExam?.slug === 'upsc-signature-resizer' || (activeExam?.docType === 'signature' && mode === 'upsc')
                    ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-rounded text-[18px]">draw</span>
                  <span className="font-bold text-xs">UPSC Sign</span>
                </div>
                <div className="text-[11px] opacity-80">350 × 350 px &bull; 20–100 KB</div>
              </button>
            </div>
          </div>
        )}

        {/* Quick Preset Sub-chips for State PSC */}
        {mode === 'psc' && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSscPreset('mppsc-photo')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  activeExam?.slug === 'mppsc-photo-resizer' || sscPreset === 'mppsc-photo'
                    ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-rounded text-[18px]">account_box</span>
                  <span className="font-bold text-xs">MPPSC Photo</span>
                </div>
                <div className="text-[11px] opacity-80">275 × 354 px &bull; 25–200 KB</div>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('mppsc-signature')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  activeExam?.slug === 'mppsc-signature-resizer' || sscPreset === 'mppsc-signature'
                    ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-rounded text-[18px]">draw</span>
                  <span className="font-bold text-xs">MPPSC Sign</span>
                </div>
                <div className="text-[11px] opacity-80">275 × 118 px &bull; 25–200 KB</div>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('uppsc-photo')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  activeExam?.slug === 'uppsc-photo-resizer' || sscPreset === 'uppsc-photo'
                    ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-rounded text-[18px]">account_box</span>
                  <span className="font-bold text-xs">UPPSC Photo</span>
                </div>
                <div className="text-[11px] opacity-80">180 × 216 px &bull; 20–50 KB</div>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('uppsc-signature')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  activeExam?.slug === 'uppsc-signature-resizer' || sscPreset === 'uppsc-signature'
                    ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40 hover:bg-m3-surface-container-highest'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-rounded text-[18px]">draw</span>
                  <span className="font-bold text-xs">UPPSC Sign</span>
                </div>
                <div className="text-[11px] opacity-80">216 × 108 px &bull; 10–30 KB</div>
              </button>
            </div>
          </div>
        )}

        {/* Quick Preset Sub-chips for Banking */}
        {mode === 'banking' && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSscPreset('declaration')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  sscPreset === 'declaration' || activeExam?.docType === 'declaration'
                    ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] filled">description</span>
                    Declaration
                  </span>
                  {(sscPreset === 'declaration' || activeExam?.docType === 'declaration') && (
                    <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                  800 × 400 px • 50–100 KB
                </p>
                <span className="text-[10px] text-m3-outline block mt-0.5">Black Ink • Mandatory</span>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('signature')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  sscPreset === 'signature' || activeExam?.docType === 'signature'
                    ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] filled">draw</span>
                    Signature
                  </span>
                  {(sscPreset === 'signature' || activeExam?.docType === 'signature') && (
                    <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                  140 × 60 px • 10–20 KB
                </p>
                <span className="text-[10px] text-m3-outline block mt-0.5">Black Ink Only</span>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('thumb')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  sscPreset === 'thumb' || activeExam?.docType === 'thumb'
                    ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] filled">fingerprint</span>
                    Thumb (LTI)
                  </span>
                  {(sscPreset === 'thumb' || activeExam?.docType === 'thumb') && (
                    <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                  240 × 240 px • 20–50 KB
                </p>
                <span className="text-[10px] text-m3-outline block mt-0.5">Black / Blue Ink</span>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('photo')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  sscPreset === 'photo' || activeExam?.docType === 'photo'
                    ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] filled">account_box</span>
                    Photo
                  </span>
                  {(sscPreset === 'photo' || activeExam?.docType === 'photo') && (
                    <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                  200 × 230 px • 20–50 KB
                </p>
                <span className="text-[10px] text-m3-outline block mt-0.5">200 DPI • Passport</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Preset Sub-chips for SSC */}
        {mode === 'ssc' && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSscPreset('signature')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  sscPreset === 'signature'
                    ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] filled">draw</span>
                    SSC Signature
                  </span>
                  {sscPreset === 'signature' && (
                    <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                  6.0 × 2.0 cm • 10–20 KB
                </p>
                <span className="text-[10px] text-m3-outline block mt-0.5">Mandatory Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setSscPreset('photo')}
                className={`p-3 rounded-[20px] text-left transition active:scale-95 cursor-pointer border ${
                  sscPreset === 'photo'
                    ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                    : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[16px] filled">account_box</span>
                    SSC Photo
                  </span>
                  {sscPreset === 'photo' && (
                    <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                  3.5 × 4.5 cm • 20–50 KB
                </p>
                <span className="text-[10px] text-m3-tertiary font-medium block mt-0.5">Live App Mandated</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Preset Sub-chips for RRB */}
        {mode === 'rrb' && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => {
                setSscPreset('signature');
                onWidthChange('5.0');
                onHeightChange('2.0');
                setUnit('cm');
                setTargetKB(40);
              }}
              className="w-full p-3.5 rounded-[22px] text-left bg-m3-primary-container text-m3-on-primary-container border border-m3-primary shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-rounded text-[18px] filled text-m3-primary">draw</span>
                  RRB Signature (Official CEN 09/2026)
                </span>
                <span className="material-symbols-rounded text-[16px] filled text-m3-primary">check_circle</span>
              </div>
              <p className="text-[11px] mt-1 font-semibold text-m3-primary m-0">
                50 mm × 20 mm (5:2 ratio) • 30 KB – 49 KB (Target: 40 KB)
              </p>
              <span className="text-[10px] text-m3-outline block mt-0.5">
                Black ink in running handwriting • No block/capital letters
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Name & Date Strip (DoP) for SSC Photo */}
      {mode === 'ssc' && sscPreset === 'photo' && (
        <div className="bg-m3-surface-container-low p-4 rounded-[22px] border border-m3-outline-variant/40 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[18px] text-m3-primary filled">
                label
              </span>
              <span>Name &amp; Date Strip (DoP)</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setNameDateOptions({
                  ...nameDateOptions,
                  enabled: !nameDateOptions.enabled,
                })
              }
              className={`text-xs px-3 py-1 rounded-full font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                nameDateOptions.enabled
                  ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                  : 'bg-m3-surface-container-high text-m3-on-surface-variant border border-m3-outline-variant/50'
              }`}
            >
              <span className="material-symbols-rounded text-[14px]">
                {nameDateOptions.enabled ? 'check' : 'close'}
              </span>
              <span>{nameDateOptions.enabled ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>

          {nameDateOptions.enabled && (
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[11px] font-medium text-m3-on-surface-variant block mb-1">
                  Candidate Name (Capital Letters)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RAHUL SHARMA"
                  value={nameDateOptions.name}
                  onChange={(e) =>
                    setNameDateOptions({
                      ...nameDateOptions,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-m3-surface-container-highest rounded-xl px-3.5 py-2 text-xs text-m3-on-surface font-semibold border border-m3-outline-variant/60 focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary uppercase placeholder:normal-case placeholder:text-m3-outline"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-m3-on-surface-variant block mb-1">
                  Date of Photo (DD-MM-YYYY)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 09-11-2026"
                  value={nameDateOptions.date}
                  onChange={(e) =>
                    setNameDateOptions({
                      ...nameDateOptions,
                      date: e.target.value,
                    })
                  }
                  className="w-full bg-m3-surface-container-highest rounded-xl px-3.5 py-2 text-xs text-m3-on-surface font-semibold border border-m3-outline-variant/60 focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary placeholder:text-m3-outline"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Signature Enhancer for Signatures */}
      {isSignatureOnly && (
        <div className="bg-m3-surface-container-low p-4 rounded-[22px] border border-m3-outline-variant/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary filled">
                draw
              </span>
              <div>
                <label className="text-xs font-bold text-m3-on-surface block leading-tight">
                  Auto-Enhance Signature (Crisp B&amp;W)
                </label>
                <span className="text-[10px] text-m3-on-surface-variant block mt-0.5">
                  Pure white background &amp; deep contrast strokes
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnhanceSignature(!enhanceSignature)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                enhanceSignature
                  ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                  : 'bg-m3-surface-container-high text-m3-on-surface-variant border border-m3-outline-variant/50'
              }`}
            >
              <span className="material-symbols-rounded text-[16px] leading-none select-none flex items-center justify-center">
                {enhanceSignature ? 'check' : 'close'}
              </span>
              <span>{enhanceSignature ? 'Enhanced' : 'Original'}</span>
            </button>
          </div>
        </div>
      )}

      {/* CONDITIONAL TOOL CONTROLS */}

      {/* 1. activeTool === 'compress' flow: Target KB is primary, Dimensions in collapsed accordion */}
      {activeTool === 'compress' && (
        <div className="space-y-4">
          {renderTargetKBControls()}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvancedDimensions(!showAdvancedDimensions)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 text-xs font-bold text-m3-on-surface hover:bg-m3-surface-container-high transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-rounded text-[18px] text-m3-primary">tune</span>
                <span>Advanced: Adjust Dimensions &amp; DPI (Optional)</span>
              </span>
              <span className="material-symbols-rounded text-[18px]">
                {showAdvancedDimensions ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAdvancedDimensions && (
              <div className="mt-3 p-4 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 animate-in fade-in duration-200">
                {renderDimensionsControls()}
              </div>
            )}
          </div>

          {renderFormatControls()}
        </div>
      )}

      {/* 2. activeTool === 'resize' flow: Dimensions is primary, Target KB in collapsed accordion */}
      {activeTool === 'resize' && (
        <div className="space-y-4">
          {renderDimensionsControls()}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvancedTargetKB(!showAdvancedTargetKB)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 text-xs font-bold text-m3-on-surface hover:bg-m3-surface-container-high transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-rounded text-[18px] text-m3-primary">compress</span>
                <span>Advanced: Target File Size (Optional)</span>
              </span>
              <span className="material-symbols-rounded text-[18px]">
                {showAdvancedTargetKB ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAdvancedTargetKB && (
              <div className="mt-3 p-4 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 animate-in fade-in duration-200">
                {renderTargetKBControls()}
              </div>
            )}
          </div>

          {renderFormatControls()}
        </div>
      )}

      {/* 3. activeTool === 'convert' flow: Format & Quality Slider is primary */}
      {activeTool === 'convert' && (
        <div className="space-y-4">
          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary filled">transform</span>
              <span>Target Output Format</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'image/jpeg', name: 'JPEG / JPG', desc: 'Best Compatibility' },
                { id: 'image/webp', name: 'WebP', desc: 'Smallest Web Size' },
                { id: 'image/png', name: 'PNG', desc: 'Lossless Clean' },
              ].map((fmt) => {
                const isSelected = mimeType === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setMimeType(fmt.id)}
                    className={`p-3 rounded-[18px] text-left transition active:scale-95 cursor-pointer border ${
                      isSelected
                        ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary shadow-sm'
                        : 'bg-m3-surface-container-low border-m3-outline-variant/40 text-m3-on-surface-variant hover:bg-m3-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{fmt.name}</span>
                      {isSelected && (
                        <span className="material-symbols-rounded text-[16px] filled">check_circle</span>
                      )}
                    </div>
                    <span className="text-[10px] block mt-0.5 opacity-80">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Slider (for lossy formats) */}
          {mimeType !== 'image/png' && (
            <div className="space-y-2 bg-m3-surface-container-low p-4 rounded-2xl border border-m3-outline-variant/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-m3-on-surface">Image Quality</span>
                <span className="font-mono font-bold text-m3-primary text-sm">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality && setQuality(Number(e.target.value))}
                className="w-full accent-m3-primary cursor-pointer"
              />
              <div className="grid grid-cols-4 gap-2 pt-1">
                {QUALITY_PRESETS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality && setQuality(q)}
                    className={`py-1 px-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer border ${
                      quality === q
                        ? 'bg-m3-primary text-m3-on-primary border-m3-primary shadow-xs'
                        : 'bg-m3-surface-container-high text-m3-on-surface-variant border-m3-outline-variant/40'
                    }`}
                  >
                    {q}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collapsed Advanced: Dimensions & Target KB */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvancedConvert(!showAdvancedConvert)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 text-xs font-bold text-m3-on-surface hover:bg-m3-surface-container-high transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-rounded text-[18px] text-m3-primary">tune</span>
                <span>Advanced: Dimensions &amp; Target KB (Optional)</span>
              </span>
              <span className="material-symbols-rounded text-[18px]">
                {showAdvancedConvert ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAdvancedConvert && (
              <div className="mt-3 p-4 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/30 space-y-4 animate-in fade-in duration-200">
                {renderDimensionsControls()}
                {renderTargetKBControls()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Default / Exam / General mode flow: Render both standard controls */}
      {activeTool !== 'compress' && activeTool !== 'resize' && activeTool !== 'convert' && (
        <div className="space-y-4">
          {renderTargetKBControls()}
          {renderDimensionsControls()}
          {renderFormatControls()}
        </div>
      )}

      {/* Action Button: Full M3 Pill Primary */}
      <button
        type="button"
        onClick={onApplyManual}
        disabled={isProcessing}
        className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-m3-primary text-m3-on-primary hover:brightness-105 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
      >
        <span
          className={`material-symbols-rounded text-[20px] leading-none select-none flex items-center justify-center ${
            isProcessing ? 'animate-spin' : ''
          }`}
        >
          refresh
        </span>
        <span>{isProcessing ? 'Processing Canvas...' : 'Apply & Compress Now'}</span>
      </button>
    </div>
  );
}
