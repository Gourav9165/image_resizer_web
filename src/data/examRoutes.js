/**
 * Centralized Exam & Preset Registry
 * Maps programmatic SEO paths and search keywords to canonical presets.
 */

const PHOTO_SPECS = {
  widthCm: 3.5,
  heightCm: 4.5,
  widthPx: 413,
  heightPx: 531,
  minKB: 20,
  maxKB: 50,
  targetKB: 35,
  dpi: 300,
  format: 'JPEG',
  aspectRatio: 3.5 / 4.5,
  liveNotice: 'Official Notice: SSC now mandates Live Photo Capture via ssc.gov.in / MySSC app during application submission. Pre-scanned photo presets are provided for manual reference.',
};

const SIGNATURE_SPECS = {
  widthCm: 6.0,
  heightCm: 2.0,
  alternateWidthCm: 4.0,
  alternateHeightCm: 2.0,
  widthPx: 708,
  heightPx: 236,
  minKB: 10,
  maxKB: 20,
  targetKB: 15,
  dpi: 300,
  format: 'JPEG',
  aspectRatio: 6.0 / 2.0, // 3:1 ratio
  alternateAspectRatio: 4.0 / 2.0, // 2:1 ratio (~140 × 60 px)
  warningNotice: 'Signed on unruled white paper using black or blue ink. Do not sign in ALL CAPITAL LETTERS.',
};

const PHOTO_FAQS = (examName) => [
  {
    q: `What is the latest photo requirement for ${examName}?`,
    a: `Notice Update: Staff Selection Commission (SSC) now mandates Live Photo Capture via webcam or the MySSC mobile app during application fill. If pre-scanned photo is needed, official dimensions are 3.5 cm × 4.5 cm between 20 KB and 50 KB.`,
  },
  {
    q: `What are the exact photo dimensions required for ${examName}?`,
    a: `The standard passport photo dimensions are 3.5 cm in width × 4.5 cm in height (approximately 413 × 531 pixels at 300 DPI).`,
  },
  {
    q: `What is the allowed file size for ${examName} photo uploads?`,
    a: `The file size must be between 20.0 KB and 50.0 KB in JPG or JPEG format. Our tool automatically targets 35 KB to guarantee acceptance without rejection.`,
  },
];

const SIGNATURE_FAQS = (examName) => [
  {
    q: `What are the signature dimensions for ${examName}?`,
    a: `The primary signature dimensions for ${examName} are 6.0 cm × 2.0 cm (Aspect 3:1, approx. 708 × 236 px at 300 DPI) with alternate 4.0 cm × 2.0 cm (~140 × 60 px, Aspect 2:1) accepted across SSC online portals.`,
  },
  {
    q: `What is the file size limit for ${examName} signature?`,
    a: `The signature image must be strictly between 10.0 KB and 20.0 KB in JPG/JPEG format (target default: 15 KB). Signatures outside this range will be rejected.`,
  },
  {
    q: `Can I sign in CAPITAL letters for ${examName}?`,
    a: `No. Applicant must sign on unruled white paper using black or blue ink in running handwriting. Signatures in ALL CAPITAL LETTERS will cause immediate application rejection.`,
  },
];

const RRB_SIGNATURE_SPECS = {
  widthCm: 5.0,
  heightCm: 2.0,
  widthMm: 50,
  heightMm: 20,
  widthPx: 590, // at 300 DPI, or ~140 px for 140x60 standard
  heightPx: 236, // at 300 DPI, or ~60 px
  minKB: 30,
  maxKB: 49, // Strictly 30 KB to 49 KB per CEN 09/2026
  targetKB: 40, // Target default: 40 KB
  dpi: 300,
  format: 'JPEG',
  aspectRatio: 5.0 / 2.0, // 5:2 ratio
  warningNotice: 'Applicant must sign on white paper with Black ink pen in running handwriting. Signatures in BLOCK, CAPITAL, or DISJOINTED letters will lead to rejection.',
};

const RRB_SIGNATURE_FAQS = (examName) => [
  {
    q: `What are the official signature dimensions and file size for ${examName}?`,
    a: `Per Railway Recruitment Board CEN guidelines (including CEN 09/2026), the signature must be 50 mm × 20 mm (5.0 cm × 2.0 cm, ~590 × 236 px at 300 DPI, aspect ratio 5:2). The file size must be strictly between 30 KB and 49 KB (Target default: 40 KB) in JPG/JPEG format.`,
  },
  {
    q: `Why is there no RRB Photo Resizer?`,
    a: `Notice Update: Railway Recruitment Board (RRB) has discontinued pre-scanned photo uploads. All candidates must take a live photograph through the webcam or mobile camera during online application submission. Only the Signature must be uploaded as a scanned image file.`,
  },
  {
    q: `What ink and handwriting rules are mandatory for ${examName} signature?`,
    a: `Applicant must sign on white paper with Black ink pen in running handwriting. Signatures in BLOCK, CAPITAL, or DISJOINTED letters will lead to rejection.`,
  },
];

// ==========================================
// Banking (IBPS / SBI) Specifications & FAQs
// ==========================================

const IBPS_PHOTO_SPECS = {
  widthPx: 200,
  heightPx: 230,
  widthCm: 3.5,
  heightCm: 4.5,
  minKB: 20,
  maxKB: 50,
  targetKB: 35,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 200 / 230,
  unit: 'px',
  liveNotice: 'Recent passport colour picture against a light/white background. (Note: IBPS portal also captures a live photo via webcam/QR scan).',
};

const IBPS_SIGNATURE_SPECS = {
  widthPx: 140,
  heightPx: 60,
  widthCm: 4.0,
  heightCm: 2.0,
  minKB: 10,
  maxKB: 20,
  targetKB: 15,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 140 / 60,
  unit: 'px',
  fitMode: 'contain',
  warningNotice: 'Signed with BLACK INK PEN on white paper. Signatures in CAPITAL LETTERS will be rejected.',
};

const IBPS_THUMB_SPECS = {
  widthPx: 240,
  heightPx: 240,
  widthCm: 3.0,
  heightCm: 3.0,
  minKB: 20,
  maxKB: 50,
  targetKB: 35,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 1.0,
  unit: 'px',
  fitMode: 'contain',
  warningNotice: 'Left thumb impression on white paper with BLACK or BLUE ink. Ridges must be clear and unsmudged.',
};

const IBPS_DECLARATION_SPECS = {
  widthPx: 800,
  heightPx: 400,
  widthCm: 10.0,
  heightCm: 5.0,
  minKB: 50,
  maxKB: 100,
  targetKB: 75,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 800 / 400, // 2:1 ratio
  unit: 'px',
  fitMode: 'contain',
  warningNotice: "Written clearly in English with BLACK INK on white paper in applicant's own handwriting. CAPITAL LETTERS NOT ACCEPTED.",
};

const IBPS_PHOTO_FAQS = (examName) => [
  {
    q: `What are the official photo dimensions for ${examName}?`,
    a: `The photograph must be 200 × 230 pixels (preferred) or 4.5 cm × 3.5 cm in size. The scanner resolution should be set to 200 DPI True Color.`,
  },
  {
    q: `What is the allowed file size for ${examName} photo?`,
    a: `The file size must be strictly between 20 KB and 50 KB in JPG or JPEG format. Our tool automatically targets 35 KB for safe acceptance.`,
  },
  {
    q: `Does IBPS require a live photo capture as well?`,
    a: `Yes, during recent IBPS examinations, the portal captures a live photo via webcam or QR scan in addition to the uploaded passport photo. Both must match.`,
  },
];

const IBPS_SIGNATURE_FAQS = (examName) => [
  {
    q: `What are the signature specifications for ${examName}?`,
    a: `The signature must be 140 × 60 pixels (Aspect ratio ~2.33:1) at 200 DPI scanner resolution. Dimensions on paper are approximately 4.0 cm × 2.0 cm.`,
  },
  {
    q: `What ink color is mandatory for ${examName} signature?`,
    a: `The applicant must sign on white paper with a BLACK INK PEN. Signatures in other ink colors or in CAPITAL LETTERS will not be accepted.`,
  },
  {
    q: `What is the file size limit for ${examName} signature?`,
    a: `The signature file size must be strictly between 10 KB and 20 KB in JPG/JPEG format (target default: 15 KB).`,
  },
];

const IBPS_THUMB_FAQS = (examName) => [
  {
    q: `What are the Left Thumb Impression (LTI) dimensions for ${examName}?`,
    a: `The left thumb impression must be 240 × 240 pixels (Aspect ratio 1:1, ~3.0 cm × 3.0 cm) with scanner resolution set to 200 DPI.`,
  },
  {
    q: `What is the file size and ink requirement for ${examName} thumb impression?`,
    a: `The file size must be between 20 KB and 50 KB in JPG/JPEG format (target: 35 KB). Left thumb impression must be taken with BLACK or BLUE ink on white paper with clear ridges without smudging.`,
  },
  {
    q: `What if a candidate does not have a left thumb?`,
    a: `As per official guidelines, if an applicant does not have a left thumb, the right thumb impression may be used, clearly stated in the application.`,
  },
];

const IBPS_DECLARATION_FAQS = (examName) => [
  {
    q: `What are the handwritten declaration dimensions for ${examName}?`,
    a: `The handwritten declaration image must be 800 × 400 pixels (Aspect ratio 2:1, ~10.0 cm × 5.0 cm) at 200 DPI True Color.`,
  },
  {
    q: `What is the file size requirement for ${examName} declaration?`,
    a: `The file size must be strictly between 50 KB and 100 KB in JPG/JPEG format (target default: 75 KB). Files smaller than 50 KB or larger than 100 KB are rejected by the IBPS/SBI upload server.`,
  },
  {
    q: `What text and ink are mandatory for ${examName} declaration?`,
    a: `The text must be written in English on white paper with a BLACK INK PEN in the applicant's own handwriting. Declarations written in CAPITAL LETTERS or in another person's handwriting will be rejected.`,
  },
];

// ==========================================
// State PSC (MPPSC & UPPSC) Specifications & FAQs
// ==========================================

const MPPSC_PHOTO_SPECS = {
  widthPx: 275,
  heightPx: 354,
  minKB: 25,
  maxKB: 200,
  targetKB: 100,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 275 / 354,
  unit: 'px',
  liveNotice: 'MPPSC Official Standard: 275 × 354 px (Aspect Ratio 1:1.29), strictly between 25 KB and 200 KB in JPG format.',
};

const MPPSC_SIGNATURE_SPECS = {
  widthPx: 275,
  heightPx: 118,
  minKB: 25,
  maxKB: 200,
  targetKB: 70,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 275 / 118,
  unit: 'px',
  fitMode: 'contain',
  warningNotice: 'Signed with black or blue ink on clean unruled white paper. Dimensions must be 275 × 118 px between 25 KB and 200 KB.',
};

const UPPSC_PHOTO_SPECS = {
  widthPx: 180,
  heightPx: 216,
  widthCm: 3.5,
  heightCm: 4.5,
  minKB: 20,
  maxKB: 50,
  targetKB: 35,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 180 / 216, // 5:6
  unit: 'px',
  liveNotice: 'UPPSC Official Specification: 180 × 216 px (3.5 × 4.5 cm) colored passport photo between 20 KB and 50 KB.',
};

const UPPSC_SIGNATURE_SPECS = {
  widthPx: 216,
  heightPx: 108,
  widthCm: 3.5,
  heightCm: 1.5,
  minKB: 10,
  maxKB: 30,
  targetKB: 20,
  dpi: 200,
  format: 'JPEG',
  aspectRatio: 216 / 108, // 2:1
  unit: 'px',
  fitMode: 'contain',
  warningNotice: 'Signed with black ink on white paper in running handwriting (strictly 216 × 108 px, 10 KB to 30 KB). CAPITAL LETTERS NOT ACCEPTED.',
};

const MPPSC_PHOTO_FAQS = (examName = 'MPPSC') => [
  {
    q: `What are the official photo dimensions for ${examName}?`,
    a: `Per Madhya Pradesh Public Service Commission guidelines, the photograph must have dimensions of exactly 275 × 354 pixels (width × height) in JPG/JPEG format.`,
  },
  {
    q: `What is the allowed file size for ${examName} photo?`,
    a: `The file size must be between 25 KB and 200 KB. Our resizer automatically targets 100 KB for crystal-clear clarity without exceeding portal upload limits.`,
  },
  {
    q: `What background and photo guidelines should be followed for ${examName}?`,
    a: `Use a recent front-facing color passport photo with clear face visibility, neutral facial expression, and a plain light or white background. Both ears must be clearly visible.`,
  },
];

const MPPSC_SIGNATURE_FAQS = (examName = 'MPPSC') => [
  {
    q: `What are the signature specifications for ${examName}?`,
    a: `The signature must be sized to 275 × 118 pixels (Aspect ratio ~2.33:1) in JPG/JPEG format.`,
  },
  {
    q: `What is the file size requirement for ${examName} signature?`,
    a: `The signature file size must be strictly between 25 KB and 200 KB in JPG format (target default: 70 KB).`,
  },
  {
    q: `What pen ink is recommended for ${examName} signature?`,
    a: `Sign with a dark black or dark blue pen on clean, unruled white paper. Signatures written in capital letters or cropped illegibly will be rejected.`,
  },
];

const UPPSC_PHOTO_FAQS = (examName = 'UPPSC') => [
  {
    q: `What are the official photo dimensions for ${examName}?`,
    a: `Per Uttar Pradesh Public Service Commission instructions, the passport photograph dimensions must be 180 × 216 pixels (~3.5 cm × 4.5 cm, aspect ratio 5:6) in JPG/JPEG format.`,
  },
  {
    q: `What is the allowed file size for ${examName} photo uploads?`,
    a: `The photograph file size must be between 20 KB and 50 KB (our tool targets 35 KB). Files below 20 KB or above 50 KB are rejected by the UPPSC server.`,
  },
  {
    q: `What are the background requirements for ${examName} photo?`,
    a: `The candidate should upload a recent color photograph against a plain white or off-white background with both eyes open and head centered. Caps, hats, and tinted glasses are prohibited.`,
  },
];

const UPPSC_SIGNATURE_FAQS = (examName = 'UPPSC') => [
  {
    q: `What are the signature specifications for ${examName}?`,
    a: `The signature must have dimensions of 216 × 108 pixels (~3.5 cm × 1.5 cm, aspect ratio 2:1) in JPG/JPEG format.`,
  },
  {
    q: `What is the file size limit for ${examName} signature?`,
    a: `The signature file size must be strictly between 10 KB and 30 KB in JPG/JPEG format (target default: 20 KB).`,
  },
  {
    q: `Can I sign in capital letters for ${examName}?`,
    a: `No. Signature must be written in running handwriting with a black ink pen on white paper. Capital/block letters will lead to immediate rejection.`,
  },
];

// ==========================================
// Passport Photo Maker & 4x6 Sheet Generator
// ==========================================

const PASSPORT_PHOTO_SPECS = {
  widthCm: 3.5,
  heightCm: 4.5,
  widthPx: 413,
  heightPx: 531,
  minKB: 20,
  maxKB: 100,
  targetKB: 50,
  dpi: 300,
  format: 'JPEG',
  aspectRatio: 3.5 / 4.5,
  unit: 'cm',
  isPassportMaker: true,
  liveNotice: 'Standard Indian Passport Photo: 3.5 × 4.5 cm (Aspect 7:9, ~413 × 531 px at 300 DPI). Download single photo or a 6-photo 4×6 inch sheet.',
};

const PASSPORT_PHOTO_FAQS = () => [
  {
    q: 'What are the official Indian passport size photo dimensions?',
    a: 'The standard dimensions for an Indian passport size photo are 3.5 cm in width by 4.5 cm in height (Aspect Ratio 7:9, approximately 413 × 531 pixels at 300 DPI high-resolution printing).',
  },
  {
    q: 'What background and appearance rules are required for passport photos?',
    a: 'The photo must have a plain white or light off-white background with uniform lighting (no shadows). The candidate must look straight into the camera with a neutral facial expression, both ears visible, eyes open, and without uniforms, hats, caps, or tinted spectacles.',
  },
  {
    q: 'How does the 4×6 inch (6-Photo) printable sheet generator work?',
    a: 'Our tool automatically arranges 6 standard passport size photos onto a standard 4×6 inch (1200 × 1800 px at 300 DPI) photo card layout with clean cut borders. You can print the generated JPG sheet at home or at any digital photo studio for a fraction of the cost, and easily cut them with scissors.',
  },
];

// ==========================================
// UPSC (Union Public Service Commission) Specs & FAQs
// ==========================================

const UPSC_PHOTO_SPECS = {
  widthPx: 350,
  heightPx: 350,
  minKB: 20,
  maxKB: 200,
  targetKB: 100,
  dpi: 300,
  format: 'JPEG',
  aspectRatio: 1.0, // Square 1:1
  unit: 'px',
  liveNotice: 'UPSC Official Standard: 350 × 350 px (Square 1:1), 20 KB to 200 KB in JPG format with clear white background and 75% face coverage.',
};

const UPSC_SIGNATURE_SPECS = {
  widthPx: 350,
  heightPx: 350,
  minKB: 20,
  maxKB: 100,
  targetKB: 50,
  dpi: 300,
  format: 'JPEG',
  aspectRatio: 1.0, // Square 1:1
  unit: 'px',
  fitMode: 'contain',
  warningNotice: 'Signed with black or blue ink on clean unruled white paper in running handwriting (350 × 350 px, 20 KB to 100 KB). Do not sign in ALL CAPITAL LETTERS.',
};

const UPSC_PHOTO_FAQS = (examName = 'UPSC') => [
  {
    q: `What are the official photo dimensions for ${examName}?`,
    a: `Per Union Public Service Commission (UPSC) One Time Registration (OTR) and exam guidelines, the photograph must be square: 350 × 350 pixels (Aspect Ratio 1:1) in JPG/JPEG format.`,
  },
  {
    q: `What is the allowed file size for ${examName} photo uploads?`,
    a: `The photograph file size must be between 20 KB and 200 KB in JPG/JPEG format. Our tool automatically targets 100 KB for optimal clarity without portal rejection.`,
  },
  {
    q: `What background and photo rules apply to ${examName}?`,
    a: `The photo must be recent (taken within 10 days of filling form), front-facing against a plain white background, with 3/4th face coverage, neutral expression, and no caps or dark glasses.`,
  },
];

const UPSC_SIGNATURE_FAQS = (examName = 'UPSC') => [
  {
    q: `What are the signature specifications for ${examName}?`,
    a: `Per UPSC OTR rules, the signature image must have square dimensions of 350 × 350 pixels in JPG/JPEG format.`,
  },
  {
    q: `What is the file size limit for ${examName} signature?`,
    a: `The signature file size must be strictly between 20 KB and 100 KB (our tool targets 50 KB).`,
  },
  {
    q: `Can I sign in CAPITAL letters for ${examName}?`,
    a: `No. Applicant must sign on unruled white paper with a black or dark blue ink pen in running handwriting. Signatures in ALL CAPITAL LETTERS will be rejected.`,
  },
];

export const EXAM_ROUTES = {
  // Canonical SSC General
  'ssc-photo-resizer': {
    slug: 'ssc-photo-resizer',
    examShortName: 'SSC Exams',
    examFullName: 'Staff Selection Commission (SSC All Examinations)',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Compress and resize photo for SSC portal upload to 3.5 × 4.5 cm between 20 KB and 50 KB with 300 DPI.',
    specs: PHOTO_SPECS,
    tags: ['SSC', 'CGL', 'CHSL', 'MTS', 'GD', 'CPO', 'Steno', 'Selection Post'],
    faqList: PHOTO_FAQS('SSC Examinations'),
  },
  'ssc-signature-resizer': {
    slug: 'ssc-signature-resizer',
    examShortName: 'SSC Exams',
    examFullName: 'Staff Selection Commission (SSC All Examinations)',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize signature for SSC application forms to 4.0 × 2.0 cm between 10 KB and 20 KB with 300 DPI.',
    specs: SIGNATURE_SPECS,
    tags: ['SSC', 'CGL', 'CHSL', 'MTS', 'GD', 'CPO', 'Steno', 'Selection Post'],
    faqList: SIGNATURE_FAQS('SSC Examinations'),
  },

  // SSC CGL
  'ssc-cgl-photo-resizer': {
    slug: 'ssc-cgl-photo-resizer',
    examShortName: 'SSC CGL',
    examFullName: 'SSC Combined Graduate Level Examination (CGL)',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC CGL Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Accurately resize SSC CGL passport photo to 3.5 × 4.5 cm and compress to 20 KB - 50 KB at 300 DPI.',
    specs: PHOTO_SPECS,
    tags: ['CGL', 'Graduate', 'Inspector', 'Assistant Section Officer', 'SSC'],
    faqList: PHOTO_FAQS('SSC CGL'),
  },
  'ssc-cgl-signature-resizer': {
    slug: 'ssc-cgl-signature-resizer',
    examShortName: 'SSC CGL',
    examFullName: 'SSC Combined Graduate Level Examination (CGL)',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC CGL Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SSC CGL signature to 4.0 × 2.0 cm and compress between 10 KB and 20 KB.',
    specs: SIGNATURE_SPECS,
    tags: ['CGL', 'Graduate', 'Signature', 'SSC'],
    faqList: SIGNATURE_FAQS('SSC CGL'),
  },

  // SSC CHSL
  'ssc-chsl-photo-resizer': {
    slug: 'ssc-chsl-photo-resizer',
    examShortName: 'SSC CHSL',
    examFullName: 'SSC Combined Higher Secondary Level (10+2) Examination',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC CHSL Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SSC CHSL application photo to 3.5 × 4.5 cm between 20 KB and 50 KB.',
    specs: PHOTO_SPECS,
    tags: ['CHSL', '10+2', 'LDC', 'DEO', 'Postal Assistant', 'SSC'],
    faqList: PHOTO_FAQS('SSC CHSL'),
  },
  'ssc-chsl-signature-resizer': {
    slug: 'ssc-chsl-signature-resizer',
    examShortName: 'SSC CHSL',
    examFullName: 'SSC Combined Higher Secondary Level (10+2) Examination',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC CHSL Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SSC CHSL signature to 4.0 × 2.0 cm between 10 KB and 20 KB.',
    specs: SIGNATURE_SPECS,
    tags: ['CHSL', '10+2', 'Signature', 'SSC'],
    faqList: SIGNATURE_FAQS('SSC CHSL'),
  },

  // SSC MTS
  'ssc-mts-photo-resizer': {
    slug: 'ssc-mts-photo-resizer',
    examShortName: 'SSC MTS',
    examFullName: 'SSC Multi-Tasking (Non-Technical) Staff & Havaldar Examination',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC MTS Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SSC MTS and Havaldar photo to 3.5 × 4.5 cm between 20 KB and 50 KB with 300 DPI.',
    specs: PHOTO_SPECS,
    tags: ['MTS', 'Havaldar', '10th Pass', 'Multi Tasking', 'SSC'],
    faqList: PHOTO_FAQS('SSC MTS'),
  },
  'ssc-mts-signature-resizer': {
    slug: 'ssc-mts-signature-resizer',
    examShortName: 'SSC MTS',
    examFullName: 'SSC Multi-Tasking (Non-Technical) Staff & Havaldar Examination',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC MTS Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SSC MTS signature to 4.0 × 2.0 cm between 10 KB and 20 KB.',
    specs: SIGNATURE_SPECS,
    tags: ['MTS', 'Havaldar', 'Signature', 'SSC'],
    faqList: SIGNATURE_FAQS('SSC MTS'),
  },

  // SSC GD Constable
  'ssc-gd-photo-resizer': {
    slug: 'ssc-gd-photo-resizer',
    examShortName: 'SSC GD Constable',
    examFullName: 'SSC General Duty (GD) Constable in CAPFs, SSF & Rifleman',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC GD Constable Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SSC GD Constable photo to 3.5 × 4.5 cm between 20 KB and 50 KB.',
    specs: PHOTO_SPECS,
    tags: ['GD', 'Constable', 'CAPF', 'BSF', 'CISF', 'CRPF', 'SSC'],
    faqList: PHOTO_FAQS('SSC GD Constable'),
  },
  'ssc-gd-signature-resizer': {
    slug: 'ssc-gd-signature-resizer',
    examShortName: 'SSC GD Constable',
    examFullName: 'SSC General Duty (GD) Constable in CAPFs, SSF & Rifleman',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC GD Constable Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SSC GD Constable signature to 4.0 × 2.0 cm between 10 KB and 20 KB.',
    specs: SIGNATURE_SPECS,
    tags: ['GD', 'Constable', 'Signature', 'SSC'],
    faqList: SIGNATURE_FAQS('SSC GD Constable'),
  },

  // SSC CPO
  'ssc-cpo-photo-resizer': {
    slug: 'ssc-cpo-photo-resizer',
    examShortName: 'SSC CPO',
    examFullName: 'SSC Central Police Organization - Sub-Inspector in Delhi Police & CAPFs',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC CPO Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SSC CPO Sub-Inspector photo to 3.5 × 4.5 cm between 20 KB and 50 KB.',
    specs: PHOTO_SPECS,
    tags: ['CPO', 'Sub-Inspector', 'Delhi Police', 'CAPF', 'SI', 'SSC'],
    faqList: PHOTO_FAQS('SSC CPO'),
  },
  'ssc-cpo-signature-resizer': {
    slug: 'ssc-cpo-signature-resizer',
    examShortName: 'SSC CPO',
    examFullName: 'SSC Central Police Organization - Sub-Inspector in Delhi Police & CAPFs',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC CPO Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SSC CPO Sub-Inspector signature to 4.0 × 2.0 cm between 10 KB and 20 KB.',
    specs: SIGNATURE_SPECS,
    tags: ['CPO', 'Sub-Inspector', 'Signature', 'SSC'],
    faqList: SIGNATURE_FAQS('SSC CPO'),
  },

  // SSC Stenographer
  'ssc-stenographer-photo-resizer': {
    slug: 'ssc-stenographer-photo-resizer',
    examShortName: 'SSC Stenographer',
    examFullName: 'SSC Stenographer Grade C & D Examination',
    category: 'SSC Exams',
    docType: 'photo',
    title: 'SSC Stenographer Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SSC Stenographer photo to 3.5 × 4.5 cm between 20 KB and 50 KB.',
    specs: PHOTO_SPECS,
    tags: ['Stenographer', 'Steno', 'Grade C', 'Grade D', 'SSC'],
    faqList: PHOTO_FAQS('SSC Stenographer'),
  },
  'ssc-stenographer-signature-resizer': {
    slug: 'ssc-stenographer-signature-resizer',
    examShortName: 'SSC Stenographer',
    examFullName: 'SSC Stenographer Grade C & D Examination',
    category: 'SSC Exams',
    docType: 'signature',
    title: 'SSC Stenographer Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SSC Stenographer signature to 4.0 × 2.0 cm between 10 KB and 20 KB.',
    specs: SIGNATURE_SPECS,
    tags: ['Stenographer', 'Steno', 'Signature', 'SSC'],
    faqList: SIGNATURE_FAQS('SSC Stenographer'),
  },

  // ==========================================
  // Railway Recruitment Board (RRB) Presets (Signatures Only - Live Photo is Mandated)
  // ==========================================

  // Canonical RRB Signature Preset
  'rrb-signature-resizer': {
    slug: 'rrb-signature-resizer',
    examShortName: 'RRB Exams',
    examFullName: 'Railway Recruitment Board (RRB All Examinations)',
    category: 'Railways (RRB)',
    docType: 'signature',
    title: 'RRB Signature Resizer & Reducer (30KB - 49KB)',
    description: 'Resize signature for Railway Recruitment Board (RRB) to 50 × 20 mm (5:2 aspect ratio) strictly between 30 KB and 49 KB in black ink at 300 DPI.',
    specs: RRB_SIGNATURE_SPECS,
    tags: ['RRB', 'Railway', 'Signature', 'NTPC', 'Group D', 'ALP', 'JE', 'CEN', 'RRC'],
    faqList: RRB_SIGNATURE_FAQS('RRB Examinations'),
  },

  // RRB NTPC Signature
  'rrb-ntpc-signature-resizer': {
    slug: 'rrb-ntpc-signature-resizer',
    examShortName: 'RRB NTPC',
    examFullName: 'RRB Non-Technical Popular Categories (NTPC Graduate & Undergraduate)',
    category: 'Railways (RRB)',
    docType: 'signature',
    title: 'RRB NTPC Signature Resizer & Reducer (30KB - 49KB)',
    description: 'Resize RRB NTPC signature to 50 × 20 mm (5:2 ratio) and compress strictly between 30 KB and 49 KB in black ink per CEN regulations.',
    specs: RRB_SIGNATURE_SPECS,
    tags: ['NTPC', 'RRB', 'Railway', 'Signature', 'Station Master', 'Clerk', 'CEN'],
    faqList: RRB_SIGNATURE_FAQS('RRB NTPC'),
  },

  // RRB Group D / Level 1 Signature
  'rrb-group-d-signature-resizer': {
    slug: 'rrb-group-d-signature-resizer',
    examShortName: 'RRB Group D',
    examFullName: 'RRB Level 1 / Group D (Track Maintainer, Pointsman, Helper)',
    category: 'Railways (RRB)',
    docType: 'signature',
    title: 'RRB Group D Signature Resizer & Reducer (30KB - 49KB)',
    description: 'Resize RRB Group D / Level 1 signature to 50 × 20 mm strictly between 30 KB and 49 KB in black ink at 300 DPI.',
    specs: RRB_SIGNATURE_SPECS,
    tags: ['Group D', 'Level 1', 'Signature', 'Trackman', 'Pointsman', 'RRB', 'Railway', 'RRC'],
    faqList: RRB_SIGNATURE_FAQS('RRB Group D (Level 1)'),
  },

  // RRB ALP (Assistant Loco Pilot & Technician) Signature
  'rrb-alp-signature-resizer': {
    slug: 'rrb-alp-signature-resizer',
    examShortName: 'RRB ALP',
    examFullName: 'RRB Assistant Loco Pilot & Technician (ALP & Tech CEN)',
    category: 'Railways (RRB)',
    docType: 'signature',
    title: 'RRB ALP Signature Resizer & Reducer (30KB - 49KB)',
    description: 'Resize RRB Assistant Loco Pilot signature to 50 × 20 mm strictly between 30 KB and 49 KB in black ink.',
    specs: RRB_SIGNATURE_SPECS,
    tags: ['ALP', 'Loco Pilot', 'Technician', 'Signature', 'RRB', 'Railway', 'CEN'],
    faqList: RRB_SIGNATURE_FAQS('RRB ALP & Technician'),
  },

  // RRB JE (Junior Engineer) Signature
  'rrb-je-signature-resizer': {
    slug: 'rrb-je-signature-resizer',
    examShortName: 'RRB JE',
    examFullName: 'RRB Junior Engineer, Depot Material Superintendent (DMS) & CMA',
    category: 'Railways (RRB)',
    docType: 'signature',
    title: 'RRB JE Signature Resizer & Reducer (30KB - 49KB)',
    description: 'Resize RRB JE signature to 50 × 20 mm strictly between 30 KB and 49 KB in black ink per CEN rules.',
    specs: RRB_SIGNATURE_SPECS,
    tags: ['JE', 'Junior Engineer', 'Signature', 'DMS', 'CMA', 'Engineering', 'RRB', 'Railway'],
    faqList: RRB_SIGNATURE_FAQS('RRB Junior Engineer (JE)'),
  },

  // ==========================================
  // Banking (IBPS / SBI) Presets
  // ==========================================

  // Canonical IBPS Photo
  'ibps-photo-resizer': {
    slug: 'ibps-photo-resizer',
    examShortName: 'IBPS Exams',
    examFullName: 'Institute of Banking Personnel Selection (IBPS / SBI Banking Exams)',
    category: 'Banking (IBPS / SBI)',
    docType: 'photo',
    title: 'IBPS Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize passport photo for IBPS and SBI portal upload to 200 × 230 px (4.5 × 3.5 cm) between 20 KB and 50 KB at 200 DPI.',
    specs: IBPS_PHOTO_SPECS,
    tags: ['IBPS', 'Banking', 'Bank', 'Photo', 'Passport', 'PO', 'Clerk', 'SBI', 'SO', 'RRB'],
    faqList: IBPS_PHOTO_FAQS('IBPS & SBI Banking Exams'),
  },

  // Canonical IBPS Signature
  'ibps-signature-resizer': {
    slug: 'ibps-signature-resizer',
    examShortName: 'IBPS Exams',
    examFullName: 'Institute of Banking Personnel Selection (IBPS / SBI Banking Exams)',
    category: 'Banking (IBPS / SBI)',
    docType: 'signature',
    title: 'IBPS Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize signature for IBPS and SBI exams to 140 × 60 px between 10 KB and 20 KB in black ink at 200 DPI.',
    specs: IBPS_SIGNATURE_SPECS,
    tags: ['IBPS', 'Banking', 'Bank', 'Signature', 'Sign', 'PO', 'Clerk', 'SBI', 'SO'],
    faqList: IBPS_SIGNATURE_FAQS('IBPS & SBI Banking Exams'),
  },

  // Canonical IBPS Thumb Impression
  'ibps-thumb-impression-resizer': {
    slug: 'ibps-thumb-impression-resizer',
    examShortName: 'IBPS Exams',
    examFullName: 'Institute of Banking Personnel Selection (IBPS / SBI Banking Exams)',
    category: 'Banking (IBPS / SBI)',
    docType: 'thumb',
    title: 'IBPS Thumb Impression Resizer & Reducer (20KB - 50KB)',
    description: 'Resize left thumb impression (LTI) for IBPS and SBI exams to 240 × 240 px (3 × 3 cm) between 20 KB and 50 KB at 200 DPI.',
    specs: IBPS_THUMB_SPECS,
    tags: ['IBPS', 'Banking', 'Bank', 'Thumb', 'LTI', 'Left Thumb Impression', 'SBI', 'PO', 'Clerk'],
    faqList: IBPS_THUMB_FAQS('IBPS & SBI Banking Exams'),
  },

  // Canonical IBPS Declaration
  'ibps-declaration-resizer': {
    slug: 'ibps-declaration-resizer',
    examShortName: 'IBPS Exams',
    examFullName: 'Institute of Banking Personnel Selection (IBPS / SBI Banking Exams)',
    category: 'Banking (IBPS / SBI)',
    docType: 'declaration',
    title: 'IBPS Handwritten Declaration Resizer (50KB - 100KB)',
    description: 'Resize and compress IBPS handwritten declaration to 800 × 400 px (10 × 5 cm) strictly between 50 KB and 100 KB in black ink at 200 DPI.',
    specs: IBPS_DECLARATION_SPECS,
    tags: ['IBPS', 'Banking', 'Bank', 'Declaration', 'Handwritten Declaration', 'PO', 'Clerk', 'SBI'],
    faqList: IBPS_DECLARATION_FAQS('IBPS & SBI Banking Exams'),
  },

  // IBPS PO
  'ibps-po-photo-resizer': {
    slug: 'ibps-po-photo-resizer',
    examShortName: 'IBPS PO',
    examFullName: 'IBPS Probationary Officers / Management Trainees (PO/MT)',
    category: 'Banking (IBPS / SBI)',
    docType: 'photo',
    title: 'IBPS PO Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize IBPS PO photograph to 200 × 230 px between 20 KB and 50 KB.',
    specs: IBPS_PHOTO_SPECS,
    tags: ['IBPS', 'PO', 'Probationary Officer', 'Bank', 'Photo', 'Banking'],
    faqList: IBPS_PHOTO_FAQS('IBPS PO'),
  },
  'ibps-po-signature-resizer': {
    slug: 'ibps-po-signature-resizer',
    examShortName: 'IBPS PO',
    examFullName: 'IBPS Probationary Officers / Management Trainees (PO/MT)',
    category: 'Banking (IBPS / SBI)',
    docType: 'signature',
    title: 'IBPS PO Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize IBPS PO signature to 140 × 60 px between 10 KB and 20 KB in black ink.',
    specs: IBPS_SIGNATURE_SPECS,
    tags: ['IBPS', 'PO', 'Probationary Officer', 'Bank', 'Signature', 'Banking'],
    faqList: IBPS_SIGNATURE_FAQS('IBPS PO'),
  },
  'ibps-po-thumb-resizer': {
    slug: 'ibps-po-thumb-resizer',
    examShortName: 'IBPS PO',
    examFullName: 'IBPS Probationary Officers / Management Trainees (PO/MT)',
    category: 'Banking (IBPS / SBI)',
    docType: 'thumb',
    title: 'IBPS PO Thumb Impression Resizer (20KB - 50KB)',
    description: 'Resize IBPS PO left thumb impression to 240 × 240 px between 20 KB and 50 KB.',
    specs: IBPS_THUMB_SPECS,
    tags: ['IBPS', 'PO', 'Thumb', 'LTI', 'Bank', 'Banking'],
    faqList: IBPS_THUMB_FAQS('IBPS PO'),
  },
  'ibps-po-declaration-resizer': {
    slug: 'ibps-po-declaration-resizer',
    examShortName: 'IBPS PO',
    examFullName: 'IBPS Probationary Officers / Management Trainees (PO/MT)',
    category: 'Banking (IBPS / SBI)',
    docType: 'declaration',
    title: 'IBPS PO Handwritten Declaration Resizer (50KB - 100KB)',
    description: 'Resize IBPS PO handwritten declaration to 800 × 400 px strictly between 50 KB and 100 KB in black ink.',
    specs: IBPS_DECLARATION_SPECS,
    tags: ['IBPS', 'PO', 'Declaration', 'Handwritten Declaration', 'Bank', 'Banking'],
    faqList: IBPS_DECLARATION_FAQS('IBPS PO'),
  },

  // IBPS Clerk
  'ibps-clerk-photo-resizer': {
    slug: 'ibps-clerk-photo-resizer',
    examShortName: 'IBPS Clerk',
    examFullName: 'IBPS Customer Service Associate / Clerk (CRP Clerical)',
    category: 'Banking (IBPS / SBI)',
    docType: 'photo',
    title: 'IBPS Clerk Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize IBPS Clerk application photo to 200 × 230 px between 20 KB and 50 KB.',
    specs: IBPS_PHOTO_SPECS,
    tags: ['IBPS', 'Clerk', 'Clerical', 'Bank', 'Photo', 'Banking'],
    faqList: IBPS_PHOTO_FAQS('IBPS Clerk'),
  },
  'ibps-clerk-signature-resizer': {
    slug: 'ibps-clerk-signature-resizer',
    examShortName: 'IBPS Clerk',
    examFullName: 'IBPS Customer Service Associate / Clerk (CRP Clerical)',
    category: 'Banking (IBPS / SBI)',
    docType: 'signature',
    title: 'IBPS Clerk Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize IBPS Clerk signature to 140 × 60 px between 10 KB and 20 KB in black ink.',
    specs: IBPS_SIGNATURE_SPECS,
    tags: ['IBPS', 'Clerk', 'Clerical', 'Bank', 'Signature', 'Banking'],
    faqList: IBPS_SIGNATURE_FAQS('IBPS Clerk'),
  },

  // SBI Clerk
  'sbi-clerk-photo-resizer': {
    slug: 'sbi-clerk-photo-resizer',
    examShortName: 'SBI Clerk',
    examFullName: 'State Bank of India Junior Associates (SBI Clerk JA)',
    category: 'Banking (IBPS / SBI)',
    docType: 'photo',
    title: 'SBI Clerk Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SBI Clerk Junior Associates photo to 200 × 230 px between 20 KB and 50 KB at 200 DPI.',
    specs: IBPS_PHOTO_SPECS,
    tags: ['SBI', 'Clerk', 'Junior Associates', 'JA', 'Bank', 'Photo', 'Banking'],
    faqList: IBPS_PHOTO_FAQS('SBI Clerk (Junior Associates)'),
  },
  'sbi-clerk-signature-resizer': {
    slug: 'sbi-clerk-signature-resizer',
    examShortName: 'SBI Clerk',
    examFullName: 'State Bank of India Junior Associates (SBI Clerk JA)',
    category: 'Banking (IBPS / SBI)',
    docType: 'signature',
    title: 'SBI Clerk Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SBI Clerk signature to 140 × 60 px between 10 KB and 20 KB in black ink.',
    specs: IBPS_SIGNATURE_SPECS,
    tags: ['SBI', 'Clerk', 'Junior Associates', 'JA', 'Bank', 'Signature', 'Banking'],
    faqList: IBPS_SIGNATURE_FAQS('SBI Clerk (Junior Associates)'),
  },

  // SBI PO
  'sbi-po-photo-resizer': {
    slug: 'sbi-po-photo-resizer',
    examShortName: 'SBI PO',
    examFullName: 'State Bank of India Probationary Officers (SBI PO)',
    category: 'Banking (IBPS / SBI)',
    docType: 'photo',
    title: 'SBI PO Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize SBI PO photo to 200 × 230 px between 20 KB and 50 KB at 200 DPI.',
    specs: IBPS_PHOTO_SPECS,
    tags: ['SBI', 'PO', 'Probationary Officer', 'Bank', 'Photo', 'Banking'],
    faqList: IBPS_PHOTO_FAQS('SBI PO'),
  },
  'sbi-po-signature-resizer': {
    slug: 'sbi-po-signature-resizer',
    examShortName: 'SBI PO',
    examFullName: 'State Bank of India Probationary Officers (SBI PO)',
    category: 'Banking (IBPS / SBI)',
    docType: 'signature',
    title: 'SBI PO Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize SBI PO signature to 140 × 60 px between 10 KB and 20 KB in black ink.',
    specs: IBPS_SIGNATURE_SPECS,
    tags: ['SBI', 'PO', 'Probationary Officer', 'Bank', 'Signature', 'Banking'],
    faqList: IBPS_SIGNATURE_FAQS('SBI PO'),
  },
  'sbi-po-declaration-resizer': {
    slug: 'sbi-po-declaration-resizer',
    examShortName: 'SBI PO',
    examFullName: 'State Bank of India Probationary Officers (SBI PO)',
    category: 'Banking (IBPS / SBI)',
    docType: 'declaration',
    title: 'SBI PO Handwritten Declaration Resizer (50KB - 100KB)',
    description: 'Resize SBI PO handwritten declaration to 800 × 400 px strictly between 50 KB and 100 KB in black ink.',
    specs: IBPS_DECLARATION_SPECS,
    tags: ['SBI', 'PO', 'Declaration', 'Handwritten Declaration', 'Bank', 'Banking'],
    faqList: IBPS_DECLARATION_FAQS('SBI PO'),
  },

  // IBPS RRB
  'ibps-rrb-photo-resizer': {
    slug: 'ibps-rrb-photo-resizer',
    examShortName: 'IBPS RRB',
    examFullName: 'IBPS Regional Rural Banks - Officers & Office Assistants',
    category: 'Banking (IBPS / SBI)',
    docType: 'photo',
    title: 'IBPS RRB Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize IBPS Regional Rural Bank photo to 200 × 230 px between 20 KB and 50 KB.',
    specs: IBPS_PHOTO_SPECS,
    tags: ['IBPS', 'RRB', 'Gramin Bank', 'Office Assistant', 'Officer Scale', 'Photo', 'Banking'],
    faqList: IBPS_PHOTO_FAQS('IBPS Regional Rural Banks (RRB)'),
  },
  'ibps-rrb-signature-resizer': {
    slug: 'ibps-rrb-signature-resizer',
    examShortName: 'IBPS RRB',
    examFullName: 'IBPS Regional Rural Banks - Officers & Office Assistants',
    category: 'Banking (IBPS / SBI)',
    docType: 'signature',
    title: 'IBPS RRB Signature Resizer & Reducer (10KB - 20KB)',
    description: 'Resize IBPS Regional Rural Bank signature to 140 × 60 px between 10 KB and 20 KB in black ink.',
    specs: IBPS_SIGNATURE_SPECS,
    tags: ['IBPS', 'RRB', 'Gramin Bank', 'Signature', 'Banking'],
    faqList: IBPS_SIGNATURE_FAQS('IBPS Regional Rural Banks (RRB)'),
  },
  'ibps-rrb-declaration-resizer': {
    slug: 'ibps-rrb-declaration-resizer',
    examShortName: 'IBPS RRB',
    examFullName: 'IBPS Regional Rural Banks - Officers & Office Assistants',
    category: 'Banking (IBPS / SBI)',
    docType: 'declaration',
    title: 'IBPS RRB Handwritten Declaration Resizer (50KB - 100KB)',
    description: 'Resize IBPS RRB handwritten declaration to 800 × 400 px strictly between 50 KB and 100 KB in black ink.',
    specs: IBPS_DECLARATION_SPECS,
    tags: ['IBPS', 'RRB', 'Gramin Bank', 'Declaration', 'Handwritten Declaration', 'Banking'],
    faqList: IBPS_DECLARATION_FAQS('IBPS Regional Rural Banks (RRB)'),
  },

  // ==========================================
  // State PSC Exams (MPPSC & UPPSC)
  // ==========================================
  'mppsc-photo-resizer': {
    slug: 'mppsc-photo-resizer',
    examShortName: 'MPPSC',
    examFullName: 'Madhya Pradesh Public Service Commission (MPPSC State Service)',
    category: 'State PSC',
    docType: 'photo',
    title: 'MPPSC Photo Resizer & KB Reducer (25KB - 200KB)',
    description: 'Accurately resize MPPSC passport photograph to 275 × 354 px between 25 KB and 200 KB strictly according to MPPSC official guidelines.',
    specs: MPPSC_PHOTO_SPECS,
    tags: ['MPPSC', 'State PSC', 'Madhya Pradesh', 'Civil Services', 'Photo', 'PCS'],
    faqList: MPPSC_PHOTO_FAQS('MPPSC State Service Exam'),
  },
  'mppsc-signature-resizer': {
    slug: 'mppsc-signature-resizer',
    examShortName: 'MPPSC',
    examFullName: 'Madhya Pradesh Public Service Commission (MPPSC State Service)',
    category: 'State PSC',
    docType: 'signature',
    title: 'MPPSC Signature Resizer & Reducer (25KB - 200KB)',
    description: 'Resize MPPSC scanned signature to 275 × 118 px between 25 KB and 200 KB with pure white background and crisp contrast.',
    specs: MPPSC_SIGNATURE_SPECS,
    tags: ['MPPSC', 'State PSC', 'Madhya Pradesh', 'Civil Services', 'Signature', 'PCS'],
    faqList: MPPSC_SIGNATURE_FAQS('MPPSC State Service Exam'),
  },
  'uppsc-photo-resizer': {
    slug: 'uppsc-photo-resizer',
    examShortName: 'UPPSC',
    examFullName: 'Uttar Pradesh Public Service Commission (UPPSC Combined State / Upper Subordinate)',
    category: 'State PSC',
    docType: 'photo',
    title: 'UPPSC Photo Resizer & KB Reducer (20KB - 50KB)',
    description: 'Resize UPPSC passport photograph to 180 × 216 px strictly between 20 KB and 50 KB in JPG format for UP PCS online portal.',
    specs: UPPSC_PHOTO_SPECS,
    tags: ['UPPSC', 'UP PCS', 'State PSC', 'Uttar Pradesh', 'RO ARO', 'Civil Services', 'Photo'],
    faqList: UPPSC_PHOTO_FAQS('UPPSC Combined State Exam'),
  },
  'uppsc-signature-resizer': {
    slug: 'uppsc-signature-resizer',
    examShortName: 'UPPSC',
    examFullName: 'Uttar Pradesh Public Service Commission (UPPSC Combined State / Upper Subordinate)',
    category: 'State PSC',
    docType: 'signature',
    title: 'UPPSC Signature Resizer & Reducer (10KB - 30KB)',
    description: 'Resize UPPSC signature to 216 × 108 px between 10 KB and 30 KB with black ink on white paper in running handwriting.',
    specs: UPPSC_SIGNATURE_SPECS,
    tags: ['UPPSC', 'UP PCS', 'State PSC', 'Uttar Pradesh', 'RO ARO', 'Civil Services', 'Signature'],
    faqList: UPPSC_SIGNATURE_FAQS('UPPSC Combined State Exam'),
  },

  // ==========================================
  // Passport Photo Maker & Print Sheet Generator
  // ==========================================
  'passport-size-photo-maker': {
    slug: 'passport-size-photo-maker',
    examShortName: 'Passport Photo',
    examFullName: 'Passport Size Photo Maker & Printable Sheet Generator',
    category: 'Passport Photo',
    docType: 'photo',
    title: 'Passport Size Photo Maker & Printable Sheet Generator (3.5 x 4.5 cm)',
    description: 'Create standard 3.5 × 4.5 cm passport size photos online and generate a 6-photo 4×6 inch printable sheet with cutting guidelines.',
    specs: PASSPORT_PHOTO_SPECS,
    tags: ['Passport', 'Print', '4x6', 'Sheet', 'Photo Maker', 'Visa', 'Identity', '3.5x4.5', 'Printable Sheet'],
    faqList: PASSPORT_PHOTO_FAQS(),
  },

  // ==========================================
  // UPSC (Union Public Service Commission)
  // ==========================================
  'upsc-photo-resizer': {
    slug: 'upsc-photo-resizer',
    examShortName: 'UPSC',
    examFullName: 'Union Public Service Commission (UPSC Civil Services / OTR)',
    category: 'UPSC',
    docType: 'photo',
    title: 'UPSC Photo Resizer & KB Reducer (20KB - 200KB)',
    description: 'Resize UPSC passport photograph to 350 × 350 px strictly between 20 KB and 200 KB in JPG format with white background.',
    specs: UPSC_PHOTO_SPECS,
    tags: ['UPSC', 'IAS', 'IPS', 'IFS', 'Civil Services', 'CSE', 'OTR', 'NDA', 'CDS', 'Photo'],
    faqList: UPSC_PHOTO_FAQS('UPSC Civil Services (CSE)'),
  },
  'upsc-signature-resizer': {
    slug: 'upsc-signature-resizer',
    examShortName: 'UPSC',
    examFullName: 'Union Public Service Commission (UPSC Civil Services / OTR)',
    category: 'UPSC',
    docType: 'signature',
    title: 'UPSC Signature Resizer & Reducer (20KB - 100KB)',
    description: 'Resize UPSC signature to 350 × 350 px between 20 KB and 100 KB with black or blue ink on clean white paper.',
    specs: UPSC_SIGNATURE_SPECS,
    tags: ['UPSC', 'IAS', 'IPS', 'IFS', 'Civil Services', 'CSE', 'OTR', 'NDA', 'CDS', 'Signature'],
    faqList: UPSC_SIGNATURE_FAQS('UPSC Civil Services (CSE)'),
  },

  // ==========================================
  // Image Utilities & Power Tools
  // ==========================================
  'remove-background': {
    slug: 'remove-background',
    examShortName: 'Remove BG',
    examFullName: 'Client-Side Background Cutout & Transparent PNG Tool',
    category: 'Utilities',
    docType: 'photo',
    title: 'Remove Image Background Online — Transparent PNG Cutout',
    description: 'Remove background from photos, passport pictures, and signatures 100% in browser with zero server uploads.',
    specs: { unit: 'px', minKB: 10, maxKB: 2000, targetKB: 100 },
    tags: ['Background Remover', 'Transparent PNG', 'Cutout', 'White Background', 'Photo Background', 'Utilities'],
    faqList: [
      { q: 'Is background removal 100% free and private?', a: 'Yes! All color keying and alpha masking executes locally in your browser memory via HTML5 Canvas. Your photos never leave your device.' },
      { q: 'Can I replace the background with solid white for passport photos?', a: 'Yes, simply check the "Replace with Pure White (#FFFFFF)" option to get an official white-background photo ready for online exam portals.' },
      { q: 'What image formats are supported?', a: 'You can upload JPG, JPEG, PNG, or WebP files and export as transparent PNG or white-background JPG.' },
    ],
  },
  'watermark-image': {
    slug: 'watermark-image',
    examShortName: 'Watermark',
    examFullName: 'Online Image Watermark & Stamp Tool',
    category: 'Utilities',
    docType: 'photo',
    title: 'Watermark Image Online — Add Text & Logo Watermarks Free',
    description: 'Add custom text stamps or logo watermarks to your certificates, identity documents, and photos with opacity and positioning.',
    specs: { unit: 'px', minKB: 10, maxKB: 2000, targetKB: 100 },
    tags: ['Watermark', 'Logo Stamp', 'Copyright', 'Confidential Stamp', 'Protect Photos', 'Utilities'],
    faqList: [
      { q: 'How does client-side watermarking work?', a: 'The tool renders your watermark text or logo directly onto an in-browser canvas with your chosen opacity, angle, and position.' },
      { q: 'Can I tile the watermark across the entire image?', a: 'Yes, enable the "Tile across entire image" option to repeat the watermark diagonally across the full image to prevent unauthorized use.' },
      { q: 'Are my original photos stored or uploaded?', a: 'No, every stamp operation runs completely offline in browser memory. Nothing is stored or transmitted.' },
    ],
  },
  'rotate-image': {
    slug: 'rotate-image',
    examShortName: 'Rotate Image',
    examFullName: 'Rotate & Flip Image Online (90° / 180° / Mirror)',
    category: 'Image Resizer',
    docType: 'photo',
    title: 'Rotate Image Online — Rotate 90 Degrees & Flip Vertically / Horizontally',
    description: 'Rotate photos 90° clockwise, counter-clockwise, or 180° inversion with lossless canvas coordinate transformation.',
    specs: { unit: 'px', minKB: 10, maxKB: 2000, targetKB: 50 },
    tags: ['Rotate Image', 'Flip Photo', 'Mirror Image', '90 Degree Rotate', 'Orientation', 'Utilities'],
    faqList: [
      { q: 'Does rotating reduce the image quality?', a: 'No. The canvas performs pure coordinate axis translation and rotation so image pixel fidelity is preserved completely.' },
      { q: 'Can I mirror or flip upside-down scanned signatures?', a: 'Yes, use the "Flip Horizontal" and "Flip Vertical" buttons to correct scanned documents and signatures.' },
      { q: 'What output formats can I download?', a: 'You can download the rotated image in JPG, PNG, or WebP format.' },
    ],
  },
  'blur-face': {
    slug: 'blur-face',
    examShortName: 'Blur & Redact',
    examFullName: 'Privacy Redact & Face Blur Tool',
    category: 'Utilities',
    docType: 'photo',
    title: 'Blur Face & Redact Sensitive Info Online — Privacy Censor',
    description: 'Censor faces, Aadhaar card numbers, phone numbers, and confidential details on admit cards, photos, or documents.',
    specs: { unit: 'px', minKB: 10, maxKB: 2000, targetKB: 50 },
    tags: ['Blur Face', 'Redact Photo', 'Censor Details', 'Aadhaar Blur', 'Privacy Redactor', 'Utilities'],
    faqList: [
      { q: 'How do I blur a face or ID number?', a: 'Simply drag a rectangular box over the area you want to censor. You can choose between smooth Gaussian Blur, Pixelate / Mosaic, or solid Blackout.' },
      { q: 'Can I draw multiple blur boxes on one document?', a: 'Yes, you can draw as many boxes as needed to censor multiple faces, roll numbers, or sensitive identity fields.' },
      { q: 'Is the original information recoverable from the exported image?', a: 'No. The pixel data under the redaction box is permanently overwritten in the output canvas, ensuring total privacy.' },
    ],
  },
  'upscale-image': {
    slug: 'upscale-image',
    examShortName: 'Upscale Image',
    examFullName: 'Image Upscaler & Super-Resolution Tool (2× / 4×)',
    category: 'Image Resizer',
    docType: 'photo',
    title: 'Upscale Image Online — Enlarge 2x & 4x Without Losing Quality',
    description: 'Super-resolution canvas enlargement using multi-pass stepped interpolation and edge enhancement.',
    specs: { unit: 'px', minKB: 10, maxKB: 5000, targetKB: 200 },
    tags: ['Upscale Image', 'Enlarge Photo', 'Super Resolution', '2x Scale', '4x Scale', 'High Res', 'Utilities'],
    faqList: [
      { q: 'How does in-browser super-resolution upscaling work?', a: 'Instead of single-step stretching which creates blur, our engine uses multi-pass stepped bilinear interpolation with subtle Laplace sharpening to maintain crisp edges.' },
      { q: 'What is the maximum upscale multiplier?', a: 'You can enlarge images by 2× (200%) or 4× (400%) for ultra-HD quality.' },
      { q: 'Does upscaling increase file size?', a: 'Yes, because the pixel dimensions increase, the resulting file will contain more image data.' },
    ],
  },
  'html-to-image': {
    slug: 'html-to-image',
    examShortName: 'HTML to Image',
    examFullName: 'HTML & CSS Code Snippet to PNG / JPG Converter',
    category: 'Utilities',
    docType: 'photo',
    title: 'HTML to Image Converter Online — Export HTML/CSS to PNG/JPG',
    description: 'Render HTML/CSS scorecards, admit card badges, and announcement banners to high-DPI image exports.',
    specs: { unit: 'px', minKB: 10, maxKB: 2000, targetKB: 100 },
    tags: ['HTML to Image', 'Convert HTML to PNG', 'Scorecard Generator', 'SVG ForeignObject', 'Code to Image', 'Utilities'],
    faqList: [
      { q: 'How does HTML to Image conversion work without a backend server?', a: 'It encapsulates your HTML and CSS code inside an SVG foreignObject and draws the rendered SVG vector into an HTML5 canvas at standard (1x) or Retina (2x) resolution.' },
      { q: 'Can I customize the styles and colors?', a: 'Yes, you can edit the HTML and CSS directly in the side-by-side code editor and click "Update Canvas" to see live updates.' },
      { q: 'Are pre-built templates provided?', a: 'Yes! Pre-made templates for Exam Scorecards, Admit Card ID Badges, and Announcement Quote Cards are included.' },
    ],
  },
};

/**
 * Retrieve exam by slug
 */
export function getExamBySlug(slug) {
  if (!slug) return null;
  return EXAM_ROUTES[slug.toLowerCase()] || null;
}

/**
 * Get all available exams as an array
 */
export function getAllExamPresets() {
  return Object.values(EXAM_ROUTES);
}

/**
 * Filter exams based on query string and optional category filter
 */
export function searchExams(query, category = 'All') {
  let list = getAllExamPresets();

  if (category && category !== 'All') {
    list = list.filter((item) => {
      if (category === 'SSC') return item.category === 'SSC Exams';
      if (category === 'Railways (RRB)') return item.category === 'Railways (RRB)';
      if (category === 'Banking' || category === 'Banking (IBPS / SBI)')
        return item.category === 'Banking (IBPS / SBI)';
      if (category === 'State PSC' || category === 'PSC')
        return item.category === 'State PSC';
      if (category === 'UPSC') return item.category === 'UPSC';
      if (category === 'Passport Photo' || category === 'Passport')
        return item.category === 'Passport Photo';
      return item.category === category;
    });
  }

  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();

  return list.filter((item) => {
    return (
      item.slug.toLowerCase().includes(q) ||
      item.examShortName.toLowerCase().includes(q) ||
      item.examFullName.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.docType.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}
