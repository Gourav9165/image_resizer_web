import React, { useState } from 'react';

export default function ExamFaqSection({ examConfig }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!examConfig || !examConfig.faqList || examConfig.faqList.length === 0) {
    return null;
  }

  const { examFullName, docType, specs = {}, faqList = [] } = examConfig;
  const isRrb = examConfig.category === 'Railways (RRB)';

  return (
    <section className="w-full max-w-4xl mx-auto mt-12 mb-8 px-4 space-y-6">
      {/* Official Guidelines Overview Card */}
      <div className="bg-m3-surface-container rounded-[28px] p-6 sm:p-8 border border-m3-outline-variant/40 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-m3-primary-container flex items-center justify-center text-m3-on-primary-container shrink-0">
            <span className="material-symbols-rounded text-[22px] filled">policy</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-m3-on-surface font-display m-0">
              Official Upload Guidelines: {examFullName}
            </h2>
            <p className="text-xs text-m3-on-surface-variant m-0">
              Verified specifications for {docType === 'photo' ? 'Photograph' : 'Signature'} upload
            </p>
          </div>
        </div>

        {/* Spec Matrix Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs">
            <span className="text-[11px] text-m3-on-surface-variant block mb-0.5">Physical Dimensions</span>
            <strong className="text-m3-on-surface font-mono font-bold block">
              {specs.widthCm} × {specs.heightCm} cm
            </strong>
            <span className="text-[10px] text-m3-outline font-mono">
              (~{specs.widthPx} × {specs.heightPx} px)
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs">
            <span className="text-[11px] text-m3-on-surface-variant block mb-0.5">Permissible File Size</span>
            <strong className="text-m3-primary font-mono font-bold block">
              {specs.minKB} KB – {specs.maxKB} KB
            </strong>
            <span className="text-[10px] text-m3-outline">Target: {specs.targetKB} KB</span>
          </div>

          <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs">
            <span className="text-[11px] text-m3-on-surface-variant block mb-0.5">Accepted Format</span>
            <strong className="text-m3-on-surface font-mono font-bold block">
              {specs.format || 'JPEG'} / JPG
            </strong>
            <span className="text-[10px] text-m3-outline">PNG/PDF not accepted</span>
          </div>

          <div className="p-3 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs">
            <span className="text-[11px] text-m3-on-surface-variant block mb-0.5">Print Resolution</span>
            <strong className="text-m3-on-surface font-mono font-bold block">
              {specs.dpi || 300} DPI
            </strong>
            <span className="text-[10px] text-m3-outline">Ultra-sharp print standard</span>
          </div>
        </div>

        {/* Official Rules Warning */}
        {docType === 'photo' ? (
          <div className="p-4 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/40 text-xs text-m3-on-surface-variant space-y-1">
            <p className="font-semibold text-m3-on-surface m-0 flex items-center gap-1.5">
              <span className="material-symbols-rounded text-sm text-m3-tertiary filled">info</span>
              Crucial Instructions for SSC Photo:
            </p>
            <ul className="list-disc list-inside space-y-0.5 pl-1 m-0 opacity-90 text-[11px]">
              <li>Notice: SSC portal now mandates Live Photo Capture via ssc.gov.in / MySSC app.</li>
              <li>Photograph must be recent and taken against a plain white or light off-white background.</li>
              <li>Face must occupy 60%–70% of the image; caps, hats, dark glasses, and reflections are strictly prohibited.</li>
            </ul>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-m3-surface-container-low border border-m3-outline-variant/40 text-xs text-m3-on-surface-variant space-y-1">
            <p className="font-semibold text-m3-on-surface m-0 flex items-center gap-1.5">
              <span className="material-symbols-rounded text-sm text-m3-error filled">warning</span>
              Crucial Instructions for {isRrb ? 'Railway (RRB) CEN 09/2026' : 'SSC'} Signature:
            </p>
            <ul className="list-disc list-inside space-y-0.5 pl-1 m-0 opacity-90 text-[11px]">
              {isRrb ? (
                <>
                  <li>Applicant must sign on white paper with <strong>Black ink pen</strong> in <strong>running handwriting</strong>.</li>
                  <li>Signatures in <strong>BLOCK, CAPITAL, or DISJOINTED letters</strong> will lead to rejection.</li>
                  <li>File size must stay strictly between <strong>30 KB and 49 KB</strong> in JPG/JPEG format.</li>
                </>
              ) : (
                <>
                  <li>Signed on unruled white paper using black or blue ink. Do not sign in ALL CAPITAL LETTERS.</li>
                  <li>Dimensions: 6.0 cm × 2.0 cm (or 4.0 cm × 2.0 cm), file size strictly between 10 KB and 20 KB.</li>
                  <li>Our One-Click Signature Enhancer automatically removes camera paper shadows to output pure white background.</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-m3-surface-container rounded-[28px] p-6 sm:p-8 border border-m3-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-m3-outline-variant/30">
          <div className="w-10 h-10 rounded-2xl bg-m3-secondary-container flex items-center justify-center text-m3-on-secondary-container shrink-0">
            <span className="material-symbols-rounded text-[22px] filled">help</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-m3-on-surface font-display m-0">
              Frequently Asked Questions (FAQs)
            </h3>
            <p className="text-xs text-m3-on-surface-variant m-0">
              Important upload tips for {examConfig.examShortName} candidates
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {faqList.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-m3-outline-variant/30 bg-m3-surface-container-low overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-m3-on-surface flex items-center justify-between gap-3 hover:bg-m3-surface-container-high/60 transition cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-m3-primary shrink-0" />
                    {item.q}
                  </span>
                  <span className="material-symbols-rounded text-[20px] text-m3-on-surface-variant shrink-0">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-m3-on-surface-variant leading-relaxed border-t border-m3-outline-variant/20 animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
