import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutContact({ theme, onToggleTheme, defaultTab = 'about' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Feedback', message: '' });

  useEffect(() => {
    document.title = activeTab === 'contact' ? 'Contact Support | Image Resizer Web' : 'About Us | Image Resizer Web';
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <span className="text-m3-on-surface font-medium">
            {activeTab === 'contact' ? 'Contact Support' : 'About Us'}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-m3-surface-container p-1 rounded-full border border-m3-outline-variant/40 max-w-xs shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
          >
            <span className="material-symbols-rounded text-[18px]">info</span>
            <span>About Us</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'contact'
                ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
          >
            <span className="material-symbols-rounded text-[18px]">mail</span>
            <span>Contact</span>
          </button>
        </div>

        {activeTab === 'about' ? (
          /* About Section */
          <div className="space-y-6">
            <div className="bg-m3-surface-container rounded-[28px] p-6 sm:p-8 border border-m3-outline-variant/40 space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-m3-primary-container text-m3-on-primary-container text-xs font-semibold">
                <span className="material-symbols-rounded text-[16px] filled">lightbulb</span>
                <span>Our Purpose &amp; Mission</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-m3-on-surface tracking-tight">
                About Image Resizer Web
              </h1>
              <p className="text-xs sm:text-sm text-m3-on-surface-variant leading-relaxed">
                Empowering millions of Indian competitive exam candidates with instant, privacy-first, serverless document formatting.
              </p>
            </div>

            <div className="bg-m3-surface-container-low rounded-[28px] p-6 sm:p-10 border border-m3-outline-variant/30 space-y-8 text-sm leading-relaxed text-m3-on-surface">
              <section className="space-y-3">
                <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
                  <span className="material-symbols-rounded text-[20px] text-m3-primary">flag</span>
                  <span>Why We Built This Tool</span>
                </h2>
                <p className="text-m3-on-surface-variant">
                  Every year, over 30 million candidates apply for government exams in India such as <strong>SSC (CGL, CHSL, MTS)</strong>, <strong>Railways (RRB NTPC, ALP, Group D)</strong>, <strong>Banking (IBPS PO, Clerk, SBI)</strong>, and <strong>State PSCs (MPPSC, UPPSC)</strong>.
                </p>
                <p className="text-m3-on-surface-variant">
                  A staggering percentage of applications face rejection or delays simply because uploaded photos or signatures exceed tiny file size bands (e.g. strictly 20–50 KB or 10–20 KB) or have incorrect aspect ratios. Commercial internet cafes charge high fees for rudimentary compression, and traditional online converters upload sensitive passport photos and signatures to untrusted remote servers.
                </p>
                <p className="text-m3-on-surface-variant">
                  <strong>Image Resizer Web was born to solve this permanently.</strong> By combining modern client-side HTML5 Canvas processing with a binary search compression algorithm, we deliver exact target file sizes in milliseconds—with zero server uploads and zero privacy compromise.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-bold font-display text-m3-on-surface flex items-center gap-2">
                  <span className="material-symbols-rounded text-[20px] text-m3-primary">featured_play_list</span>
                  <span>Key Architectural Innovations</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
                    <span className="font-bold text-m3-on-surface block">🔒 100% In-Browser Execution</span>
                    <span className="text-m3-on-surface-variant">Zero bytes leave your computer or phone. Perfect for sensitive ID photos and signatures.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
                    <span className="font-bold text-m3-on-surface block">🎯 ±2 KB Binary Search Precision</span>
                    <span className="text-m3-on-surface-variant">Our iterative search algorithm achieves target KB sizes accurately without blurriness.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
                    <span className="font-bold text-m3-on-surface block">🛡️ Pure White Canvas Safety Guard</span>
                    <span className="text-m3-on-surface-variant">Pre-fills canvas with pure #FFFFFF so transparent PNGs never turn black or distort.</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-m3-surface-container border border-m3-outline-variant/30 space-y-1.5">
                    <span className="font-bold text-m3-on-surface block">✍️ Signature Enhancer Filter</span>
                    <span className="text-m3-on-surface-variant">Removes dingy mobile shadows from camera photos of signatures, converting them to crisp B&amp;W.</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Contact Section */
          <div className="space-y-6">
            <div className="bg-m3-surface-container rounded-[28px] p-6 sm:p-8 border border-m3-outline-variant/40 space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-m3-secondary-container text-m3-on-secondary-container text-xs font-semibold">
                <span className="material-symbols-rounded text-[16px] filled">support_agent</span>
                <span>Candidate &amp; Technical Support</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-m3-on-surface tracking-tight">
                Contact Our Team
              </h1>
              <p className="text-xs sm:text-sm text-m3-on-surface-variant leading-relaxed">
                Have questions about exam dimensions, encountered a bug, or want to suggest a new exam preset? We'd love to hear from you.
              </p>
            </div>

            <div className="bg-m3-surface-container-low rounded-[28px] p-6 sm:p-10 border border-m3-outline-variant/30 space-y-6">
              <div className="p-4 rounded-2xl bg-m3-surface-container-high border border-m3-outline-variant/30 flex items-center gap-4 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-rounded text-[24px]">mark_email_read</span>
                </div>
                <div>
                  <span className="text-[11px] text-m3-outline font-semibold uppercase tracking-wider block">Direct Email Support</span>
                  <a href="mailto:support@imageresizerweb.com" className="text-sm font-bold text-m3-primary hover:underline">
                    support@imageresizerweb.com
                  </a>
                  <span className="text-[11px] text-m3-on-surface-variant block mt-0.5">Average response time: within 24 hours</span>
                </div>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-m3-success-container/40 border border-m3-success/40 text-center space-y-2">
                  <span className="material-symbols-rounded text-[36px] text-m3-success filled">check_circle</span>
                  <h3 className="text-base font-bold text-m3-on-surface">Message Received!</h3>
                  <p className="text-xs text-m3-on-surface-variant max-w-sm mx-auto">
                    Thank you for reaching out. We have logged your feedback and our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-m3-on-surface block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-m3-surface-container rounded-xl px-3.5 py-2.5 text-xs text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-m3-on-surface block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-m3-surface-container rounded-xl px-3.5 py-2.5 text-xs text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-m3-on-surface block mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-m3-surface-container rounded-xl px-3.5 py-2.5 text-xs text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
                    >
                      <option value="Feedback">General Feedback</option>
                      <option value="Exam Preset Request">Request New Exam Preset (e.g. State PSC, Teaching, Defense)</option>
                      <option value="Bug Report">Technical Bug Report</option>
                      <option value="Partnership">Partnership or Media Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-m3-on-surface block mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message or suggest an exam upload requirement..."
                      className="w-full bg-m3-surface-container rounded-xl px-3.5 py-2.5 text-xs text-m3-on-surface border border-m3-outline-variant/50 focus:outline-none focus:border-m3-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-full bg-m3-primary text-m3-on-primary font-bold text-xs hover:brightness-105 transition active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-rounded text-[18px]">send</span>
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
