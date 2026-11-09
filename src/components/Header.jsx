import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({
  theme = 'light',
  onToggleTheme = () => {},
  onOpenInfo = () => {},
  onReset = () => {},
  hasImage = false,
  showBackButton = false,
  onResetToHome = () => {},
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-m3-surface/95 border-b border-m3-outline-variant/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        {/* Left Side: Optional Back Button + Brand Link */}
        <div className="flex items-center gap-3 shrink-0">
          {showBackButton && (
            <button
              type="button"
              onClick={onResetToHome}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-semibold transition-all active:scale-95 flex-shrink-0 cursor-pointer shadow-xs border border-purple-200/50 dark:border-purple-800/50"
              title="Back to All Tools"
            >
              <span className="material-symbols-rounded text-[18px]">arrow_back</span>
              <span>All Tools</span>
            </button>
          )}

          {/* Brand Link */}
          <div
            onClick={() => {
              navigate('/');
              onReset?.();
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
            title="Image Resizer Web Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-m3-primary-container flex items-center justify-center text-m3-on-primary-container shadow-sm shrink-0 transition-transform group-hover:scale-105 active:scale-95">
              <span className="material-symbols-rounded text-[24px] leading-none select-none flex items-center justify-center filled">
                aspect_ratio
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-xl sm:text-2xl tracking-tight text-m3-on-surface leading-snug font-display m-0 p-0 group-hover:text-m3-primary transition-colors">
                Image Resizer Web
              </h1>
              <p className="text-xs text-m3-on-surface-variant hidden sm:block leading-normal m-0 p-0">
                Client-side image resizer & precision KB compressor
              </p>
            </div>
          </div>
        </div>

        {/* Center M3 Privacy Pill */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-m3-surface-container-high border border-m3-outline-variant/40 text-xs text-m3-on-surface-variant font-medium shrink-0">
          <span className="material-symbols-rounded text-[18px] text-m3-success leading-none select-none flex items-center justify-center filled">
            verified_user
          </span>
          <span>100% In-Browser Canvas</span>
          <span className="w-1 h-1 rounded-full bg-m3-outline"></span>
          <span className="text-m3-outline">Zero Server Uploads</span>
        </div>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full text-m3-on-surface-variant hover:text-m3-on-surface bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-rounded text-[20px] leading-none select-none flex items-center justify-center">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {hasImage && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-m3-on-surface bg-m3-surface-container-high hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 transition active:scale-95 cursor-pointer"
              title="Upload new image"
            >
              <span className="material-symbols-rounded text-[18px] leading-none select-none flex items-center justify-center">
                restart_alt
              </span>
              <span className="hidden sm:inline">New Image</span>
            </button>
          )}

          <button
            onClick={onOpenInfo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-m3-on-primary-container bg-m3-primary-container hover:brightness-105 transition active:scale-95 cursor-pointer shadow-sm border border-m3-primary/20"
            title="Algorithm & Help"
          >
            <span className="material-symbols-rounded text-[18px] leading-none select-none flex items-center justify-center">
              info
            </span>
            <span>How It Works</span>
          </button>
        </div>
      </div>
    </header>
  );
}
