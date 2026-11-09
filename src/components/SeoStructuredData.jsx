import { useEffect } from 'react';

/**
 * Dynamic JSON-LD Structured Data Injector for SEO & AdSense
 * Injects SoftwareApplication schema and FAQPage schema mapped to the active route.
 */
export default function SeoStructuredData({ activeExam = null }) {
  useEffect(() => {
    // 1. SoftwareApplication Schema
    const appSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Image Resizer Web',
      operatingSystem: 'All (Web Browser)',
      applicationCategory: 'MultimediaApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Free client-side image resizer and KB reducer for government exams including SSC (CGL, CHSL, MTS, GD), Railways (RRB NTPC, Group D, ALP), and Banking (IBPS PO, Clerk, SBI PO, Clerk, LTI, Handwritten Declaration).',
      featureList: [
        '100% In-Browser Canvas Binary Search Compression',
        'Official Government Exam Presets (SSC, RRB CEN 09/2026, IBPS/SBI Banking)',
        'Accurate Target KB Reduction within ±2 KB',
        'One-Click Signature & Ridge Enhancer (Crisp B&W)',
        'Fit & Pad Mode with Zero Edge Clipping',
        'Physical Dimensions in Pixels, mm, and cm at 200/300 DPI',
      ],
    };

    let appScript = document.getElementById('seo-software-schema');
    if (!appScript) {
      appScript = document.createElement('script');
      appScript.id = 'seo-software-schema';
      appScript.type = 'application/ld+json';
      document.head.appendChild(appScript);
    }
    appScript.textContent = JSON.stringify(appSchema);

    // 2. FAQPage Schema (dynamically generated from route FAQs)
    const faqList = activeExam?.faqList || [
      {
        q: 'How does the client-side binary search image compression work?',
        a: 'Image Resizer Web processes images entirely on your device using HTML5 Canvas. It performs iterative binary search on canvas.toBlob quality and scaling to match your requested target KB within ±2 KB with zero server upload.',
      },
      {
        q: 'Are my uploaded photographs or signatures stored on any server?',
        a: 'No. The entire compression and resizing pipeline runs 100% offline inside your web browser. No photos, signatures, or documents are ever uploaded to any external server or cloud.',
      },
      {
        q: 'Which exams are supported by Image Resizer Web?',
        a: 'We support all major Indian competitive exams including SSC (CGL, CHSL, MTS, CPO, GD, Steno), Railway Recruitment Board (RRB NTPC, Group D, ALP, JE per CEN 09/2026), and Banking exams (IBPS PO, Clerk, SBI PO, Clerk, Left Thumb Impression, and Handwritten Declaration).',
      },
    ];

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    let faqScript = document.getElementById('seo-faq-schema');
    if (!faqScript) {
      faqScript = document.createElement('script');
      faqScript.id = 'seo-faq-schema';
      faqScript.type = 'application/ld+json';
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify(faqSchema);

    return () => {
      // Keep app schema, clean up if needed
    };
  }, [activeExam]);

  return null;
}
