import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService({ theme, onToggleTheme }) {
  useEffect(() => {
    document.title = 'Terms of Service | Image Resizer Web';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-m3-surface text-m3-on-surface font-sans transition-colors duration-200">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenInfo={() => {}}
        onReset={() => {}}
        hasImage={false}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-m3-on-surface-variant">
          <Link to="/" className="hover:text-m3-primary transition flex items-center gap-1">
            <span className="material-symbols-rounded text-[16px]">arrow_back</span>
            <span>Back to Resizer</span>
          </Link>
          <span>/</span>
          <span className="text-m3-on-surface font-medium">Terms of Service</span>
        </div>

        {/* Title Card */}
        <div className="bg-m3-surface-container rounded-[28px] p-6 sm:p-8 border border-m3-outline-variant/40 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-m3-secondary-container text-m3-on-secondary-container text-xs font-semibold">
            <span className="material-symbols-rounded text-[16px] filled">gavel</span>
            <span>Usage Terms &amp; Advisory Notice</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-m3-on-surface tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-m3-on-surface-variant">
            Last Updated: November 2026 &bull; Clear conditions of use for competitive examination candidates
          </p>
        </div>

        {/* Terms Body */}
        <div className="bg-m3-surface-container-low rounded-[28px] p-6 sm:p-10 border border-m3-outline-variant/30 space-y-8 text-sm leading-relaxed text-m3-on-surface">
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">handshake</span>
              <span>1. Agreement to Terms</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              By accessing or using <strong>Image Resizer Web</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our utility.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">warning</span>
              <span>2. Government Recruitment Non-Affiliation Disclaimer</span>
            </h2>
            <div className="p-4 rounded-2xl bg-m3-tertiary-container/30 border border-m3-tertiary/40 text-xs space-y-2">
              <p className="font-semibold text-m3-on-surface m-0">
                Independent Candidate Support Tool
              </p>
              <p className="text-m3-on-surface-variant m-0">
                Image Resizer Web is an independent educational and utility web tool. It is <strong>NOT affiliated with, endorsed by, managed by, or representative of</strong> the Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), Institute of Banking Personnel Selection (IBPS), State Bank of India (SBI), Union Public Service Commission (UPSC), MPPSC, UPPSC, or any Central or State Government entity in India.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">fact_check</span>
              <span>3. Candidate Responsibility &amp; Notification Verification</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              While our system updates presets continuously based on official recruitment notices (e.g. CEN 09/2026, SSC live capture notices, IBPS scanner resolution norms), government exam boards may alter photo and signature rules, dimensions, or file size bands at any moment. <strong>Candidates are solely responsible for verifying their final image against the official examination notification</strong> before submitting their application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">license</span>
              <span>4. License &amp; Permitted Use</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              We grant you a free, non-exclusive, revocable license to use Image Resizer Web for personal and professional image resizing. You agree not to attempt to decompile, reverse-engineer, or disrupt the operation of this service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">help</span>
              <span>5. Disclaimer of Warranties &amp; Limitation of Liability</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              This service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Under no circumstances shall Image Resizer Web or its developers be held liable for any exam application rejections, delays, technical portal issues, or incidental damages resulting from the use of this free tool.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
