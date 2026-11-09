import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy({ theme, onToggleTheme }) {
  useEffect(() => {
    document.title = 'Privacy Policy | Image Resizer Web';
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
          <span className="text-m3-on-surface font-medium">Privacy Policy</span>
        </div>

        {/* Title Card */}
        <div className="bg-m3-surface-container rounded-[28px] p-6 sm:p-8 border border-m3-outline-variant/40 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-m3-primary-container text-m3-on-primary-container text-xs font-semibold">
            <span className="material-symbols-rounded text-[16px] filled">verified_user</span>
            <span>100% Client-Side Privacy Guarantee</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-m3-on-surface tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-m3-on-surface-variant">
            Last Updated: November 2026 &bull; Compliant with Google AdSense Publisher Guidelines &amp; Global Privacy Standards
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-m3-surface-container-low rounded-[28px] p-6 sm:p-10 border border-m3-outline-variant/30 space-y-8 text-sm leading-relaxed text-m3-on-surface">
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">lock</span>
              <span>1. Zero Server Upload Architecture (Local Execution Only)</span>
            </h2>
            <p className="text-m3-on-surface-variant">
              At <strong>Image Resizer Web</strong> (accessible from <a href="https://imageresizerweb.com" className="text-m3-primary underline font-medium">https://imageresizerweb.com</a>), your privacy is our foundational architectural commitment.
            </p>
            <div className="p-4 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 text-xs space-y-2">
              <p className="font-semibold text-m3-on-surface m-0">
                🔒 Technical Clarification: No Images Leave Your Device
              </p>
              <p className="text-m3-on-surface-variant m-0">
                All image compression, dimension adjustments, aspect-ratio cropping, signature thresholding, and name/date watermarking run <strong>100% locally within your device's web browser</strong> via the modern HTML5 Canvas API and JavaScript Web Workers. At no point are your photographs, signatures, thumb impressions, handwritten declarations, or identity documents transmitted, uploaded, stored, cached, or processed on any external server, cloud bucket, or database.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">database</span>
              <span>2. Information We Do NOT Collect</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-m3-on-surface-variant text-xs sm:text-sm">
              <li><strong>Uploaded Media:</strong> We never capture, inspect, log, or retain any user-provided image files or EXIF metadata.</li>
              <li><strong>Personal Identifiable Information (PII):</strong> We do not require accounts, sign-ins, phone numbers, or email addresses to use our image resizing tools.</li>
              <li><strong>Biometric Data:</strong> Signatures and left thumb impressions (LTI) are processed strictly in transient browser canvas memory and are discarded as soon as you close or refresh the tab.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">cookie</span>
              <span>3. Cookies &amp; Advertising Disclosures (Google AdSense)</span>
            </h2>
            <p className="text-m3-on-surface-variant">
              To support the free availability of this tool for students and competitive exam aspirants across India, Image Resizer Web may display third-party advertisements served by <strong>Google AdSense</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-m3-on-surface-variant text-xs sm:text-sm">
              <li>
                <strong>Third-Party Vendor Cookies:</strong> Google, as a third-party vendor, uses cookies to serve ads on this website based on a user's prior visits to this website or other websites on the Internet.
              </li>
              <li>
                <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-m3-primary underline font-medium">Google Ads Settings</a>. Alternatively, you may opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-m3-primary underline font-medium">www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">tune</span>
              <span>4. Local Browser Storage (localStorage)</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              Our website uses browser <code>localStorage</code> solely to remember your chosen theme preference (Light Mode vs. Dark Mode). No personal information, browsing history, or uploaded image data is ever written to your persistent storage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">shield</span>
              <span>5. Children's Information Protection</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              Image Resizer Web does not knowingly collect any Personal Identifiable Information from children under the age of 13. Since our service does not collect or transmit user data to any backend server, your children's files remain entirely within their own local browser session.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-m3-primary">mail</span>
              <span>6. Contact Us Regarding Privacy</span>
            </h2>
            <p className="text-m3-on-surface-variant text-xs sm:text-sm">
              If you have any questions, inquiries, or feedback regarding our privacy practices, please contact our team at:
            </p>
            <div className="p-3.5 rounded-xl bg-m3-surface-container-high text-xs font-mono text-m3-on-surface">
              Email: <a href="mailto:support@imageresizerweb.com" className="text-m3-primary underline">support@imageresizerweb.com</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
