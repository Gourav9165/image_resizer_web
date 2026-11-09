import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-m3-outline-variant/30 bg-m3-surface-container-lowest/70 text-m3-on-surface-variant text-xs pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Privacy Guarantee */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-m3-primary text-m3-on-primary flex items-center justify-center font-black font-display text-base shadow-xs">
                IR
              </div>
              <span className="font-bold font-display text-base text-m3-on-surface tracking-tight">
                Image Resizer Web
              </span>
            </div>
            <p className="text-xs text-m3-on-surface-variant leading-relaxed">
              100% Client-Side Image Resizer &amp; KB Reducer for competitive examination portals across India.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-m3-surface-container-high border border-m3-outline-variant/40 text-[11px] font-semibold text-m3-primary shadow-xs">
              <span className="material-symbols-rounded text-[15px] filled text-m3-primary">
                verified_user
              </span>
              <span>Zero Server Uploads</span>
            </div>
            <p className="text-[11px] text-m3-outline leading-tight pt-1">
              All pixel scaling and compression algorithms execute locally in browser memory via HTML5 Canvas.
            </p>
          </div>

          {/* Col 2: SSC Exams */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[16px] text-m3-tertiary">badge</span>
              <span>SSC Exams</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/ssc-cgl-photo-resizer" className="hover:text-m3-primary transition block">
                  SSC CGL Photo Resizer
                </Link>
              </li>
              <li>
                <Link to="/ssc-chsl-photo-resizer" className="hover:text-m3-primary transition block">
                  SSC CHSL Photo Resizer
                </Link>
              </li>
              <li>
                <Link to="/ssc-mts-photo-resizer" className="hover:text-m3-primary transition block">
                  SSC MTS Photo Resizer
                </Link>
              </li>
              <li>
                <Link to="/ssc-signature-resizer" className="hover:text-m3-primary transition block">
                  SSC Signature Resizer (10–20 KB)
                </Link>
              </li>
              <li>
                <Link to="/ssc-photo-resizer" className="hover:text-m3-primary transition block">
                  SSC General Photo Resizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Railways (RRB) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[16px] text-m3-secondary">train</span>
              <span>Railways (RRB)</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/rrb-ntpc-signature-resizer" className="hover:text-m3-primary transition block">
                  RRB NTPC Signature (30–49 KB)
                </Link>
              </li>
              <li>
                <Link to="/rrb-group-d-signature-resizer" className="hover:text-m3-primary transition block">
                  RRB Group D Signature Resizer
                </Link>
              </li>
              <li>
                <Link to="/rrb-alp-signature-resizer" className="hover:text-m3-primary transition block">
                  RRB ALP Signature (CEN 09/2026)
                </Link>
              </li>
              <li>
                <Link to="/rrb-je-signature-resizer" className="hover:text-m3-primary transition block">
                  RRB JE Signature Resizer
                </Link>
              </li>
              <li>
                <Link to="/rrb-signature-resizer" className="hover:text-m3-primary transition block">
                  RRB Official Signature (50×20 mm)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Banking (IBPS / SBI) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[16px] text-m3-primary">account_balance</span>
              <span>Banking Exams</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/ibps-photo-resizer" className="hover:text-m3-primary transition block">
                  IBPS Passport Photo (200×230 px)
                </Link>
              </li>
              <li>
                <Link to="/ibps-signature-resizer" className="hover:text-m3-primary transition block">
                  IBPS Signature (140×60 px)
                </Link>
              </li>
              <li>
                <Link to="/ibps-thumb-impression-resizer" className="hover:text-m3-primary transition block">
                  IBPS Thumb Impression (240×240 px)
                </Link>
              </li>
              <li>
                <Link to="/ibps-declaration-resizer" className="hover:text-m3-primary transition block">
                  Handwritten Declaration (800×400 px)
                </Link>
              </li>
              <li>
                <Link to="/sbi-po-photo-resizer" className="hover:text-m3-primary transition block">
                  SBI PO / Clerk Document Resizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: State PSCs & UPSC */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-m3-on-surface flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[16px] text-m3-primary">assured_workload</span>
              <span>PSC &amp; UPSC Exams</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/upsc-photo-resizer" className="hover:text-m3-primary transition block">
                  UPSC Photo Resizer (350×350 px)
                </Link>
              </li>
              <li>
                <Link to="/upsc-signature-resizer" className="hover:text-m3-primary transition block">
                  UPSC Signature (350×350 px)
                </Link>
              </li>
              <li>
                <Link to="/mppsc-photo-resizer" className="hover:text-m3-primary transition block">
                  MPPSC Photo Resizer (275×354 px)
                </Link>
              </li>
              <li>
                <Link to="/mppsc-signature-resizer" className="hover:text-m3-primary transition block">
                  MPPSC Signature (275×118 px)
                </Link>
              </li>
              <li>
                <Link to="/uppsc-photo-resizer" className="hover:text-m3-primary transition block">
                  UPPSC Photo Resizer (180×216 px)
                </Link>
              </li>
              <li>
                <Link to="/uppsc-signature-resizer" className="hover:text-m3-primary transition block">
                  UPPSC Signature (216×108 px)
                </Link>
              </li>
              <li>
                <Link to="/passport-size-photo-maker" className="hover:text-m3-primary transition block font-bold text-m3-primary flex items-center gap-1">
                  <span className="material-symbols-rounded text-[14px]">photo_camera_front</span>
                  <span>Passport Photo Maker (4×6" Sheet)</span>
                </Link>
              </li>
              <li>
                <Link to="/remove-background" className="hover:text-m3-primary transition block">
                  Remove Background (Transparent PNG)
                </Link>
              </li>
              <li>
                <Link to="/watermark-image" className="hover:text-m3-primary transition block">
                  Watermark &amp; Stamp Image
                </Link>
              </li>
              <li>
                <Link to="/blur-face" className="hover:text-m3-primary transition block">
                  Blur Face &amp; Privacy Redact
                </Link>
              </li>
              <li>
                <Link to="/upscale-image" className="hover:text-m3-primary transition block">
                  Upscale Image (2× / 4× Super-Res)
                </Link>
              </li>
              <li>
                <Link to="/html-to-image" className="hover:text-m3-primary transition block">
                  HTML to Image Converter
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenInfo}
                  className="hover:text-m3-primary transition text-left cursor-pointer"
                >
                  Binary Search Specs (±2 KB)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="p-4 rounded-2xl bg-m3-surface-container-high/60 border border-m3-outline-variant/30 text-[11px] leading-relaxed text-m3-on-surface-variant">
          <strong className="text-m3-on-surface">Educational &amp; Candidate Utility Disclaimer:</strong> Image Resizer Web is an independent web utility built to help competitive exam applicants format images to official pixel and file size parameters. We are not affiliated with, endorsed by, or authorized by Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), Institute of Banking Personnel Selection (IBPS), MPPSC, UPPSC, or any Central/State Government agency. Candidates are advised to cross-verify specific dimensions and format rules in their respective examination notification.
        </div>

        {/* Bottom Bar: Copyright, Legal Links, and Privacy Notice */}
        <div className="border-t border-m3-outline-variant/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-m3-on-surface-variant">
            <span>&copy; {currentYear} Image Resizer Web.</span>
            <span>&bull;</span>
            <span className="text-m3-primary font-medium">All processing 100% in-browser offline.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <Link to="/privacy" className="hover:text-m3-primary transition">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-m3-primary transition">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link to="/about" className="hover:text-m3-primary transition">
              About Us
            </Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-m3-primary transition">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
