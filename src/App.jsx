import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dropzone from './components/Dropzone';
import ControlPanel from './components/ControlPanel';
import PreviewSection from './components/PreviewSection';
import InfoModal from './components/InfoModal';
import CropToolModal from './components/CropToolModal';
import SignatureMakerModal from './components/SignatureMakerModal';
import HandwritingModal from './components/HandwritingModal';
import OcrModal from './components/OcrModal';
import RemoveBgModal from './components/RemoveBgModal';
import WatermarkModal from './components/WatermarkModal';
import RotateModal from './components/RotateModal';
import BlurFaceModal from './components/BlurFaceModal';
import UpscaleModal from './components/UpscaleModal';
import HtmlToImageModal from './components/HtmlToImageModal';
import ExamFaqSection from './components/ExamFaqSection';
import SeoStructuredData from './components/SeoStructuredData';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutContact from './pages/AboutContact';
import { ADS_ENABLED } from './config/ads';
import {
  processImage,
  convertUnit,
  toPixels,
  fromPixels,
  generateSampleImage,
  generateSampleSignature,
} from './utils/compressor';
import { getExamBySlug } from './data/examRoutes';

function MainResizerApp({ theme, toggleTheme }) {
  const { examSlug } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imgElement, setImgElement] = useState(null);
  const [originalInfo, setOriginalInfo] = useState(null);

  // Active Tool state: null | 'compress' | 'resize' | 'convert' | 'passport'
  const [activeTool, setActiveTool] = useState(null);

  // Active Exam Config (from URL slug or selection)
  const [activeExam, setActiveExam] = useState(null);

  // Modes: 'manual' (Default to General Resizer) | 'ssc' | 'rrb' | 'banking' | 'psc' | 'upsc'
  const [mode, setMode] = useState('manual');
  const [sscPreset, setSscPreset] = useState(null); // 'photo' | 'signature' | 'thumb' | 'declaration' | null

  // Modals state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isHandwritingModalOpen, setIsHandwritingModalOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isRemoveBgOpen, setIsRemoveBgOpen] = useState(false);
  const [isWatermarkOpen, setIsWatermarkOpen] = useState(false);
  const [isRotateOpen, setIsRotateOpen] = useState(false);
  const [isBlurFaceOpen, setIsBlurFaceOpen] = useState(false);
  const [isUpscaleOpen, setIsUpscaleOpen] = useState(false);
  const [isHtmlToImageOpen, setIsHtmlToImageOpen] = useState(false);

  // Name & Date of Photo (DoP) Strip
  const [nameDateOptions, setNameDateOptions] = useState({
    enabled: false,
    name: '',
    date: '',
  });

  // One-Click Signature Enhancer (Crisp B&W)
  const [enhanceSignature, setEnhanceSignature] = useState(true);

  // Compression & Resize Settings
  const [targetKB, setTargetKB] = useState(50);
  const [useTargetKB, setUseTargetKB] = useState(true);
  const [unit, setUnit] = useState('px'); // 'px' | 'mm' | 'cm'
  const [dpi, setDpi] = useState(96);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [aspectLocked, setAspectLocked] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [quality, setQuality] = useState(90);

  // Output
  const [processedResult, setProcessedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Debounce ref
  const debounceTimerRef = useRef(null);

  // Sync state with URL parameter (:examSlug)
  useEffect(() => {
    if (examSlug) {
      if (examSlug === 'remove-background') setIsRemoveBgOpen(true);
      if (examSlug === 'watermark-image') setIsWatermarkOpen(true);
      if (examSlug === 'rotate-image') setIsRotateOpen(true);
      if (examSlug === 'blur-face') setIsBlurFaceOpen(true);
      if (examSlug === 'upscale-image') setIsUpscaleOpen(true);
      if (examSlug === 'html-to-image') setIsHtmlToImageOpen(true);

      const exam = getExamBySlug(examSlug);
      if (exam) {
        setActiveExam(exam);
        const examMode =
          exam.category === 'Railways (RRB)'
            ? 'rrb'
            : exam.category === 'Banking (IBPS / SBI)'
            ? 'banking'
            : exam.category === 'State PSC'
            ? 'psc'
            : exam.category === 'UPSC'
            ? 'upsc'
            : exam.category === 'Passport Photo'
            ? 'manual'
            : 'ssc';
        setMode(examMode);
        setSscPreset(exam.docType);
        if (exam.docType === 'signature') {
          setEnhanceSignature(true);
        } else {
          setEnhanceSignature(false);
        }
        const isPx = exam.specs.unit === 'px';
        setUnit(isPx ? 'px' : 'cm');
        setDpi(exam.specs.dpi || (examMode === 'banking' ? 200 : 300));
        setWidth(isPx ? exam.specs.widthPx : exam.specs.widthCm);
        setHeight(isPx ? exam.specs.heightPx : exam.specs.heightCm);
        setAspectLocked(true);
        setAspectRatio(exam.specs.aspectRatio);
        setTargetKB(exam.specs.targetKB);
        setUseTargetKB(true);
        setMimeType('image/jpeg');

        if (exam.slug === 'passport-size-photo-maker') {
          setActiveTool('passport');
          document.title = 'Passport Size Photo Maker & Printable Sheet Generator | Image Resizer Web';
        } else {
          setActiveTool(null);
          const docTypeLabel =
            exam.docType === 'photo'
              ? 'Photo'
              : exam.docType === 'signature'
              ? 'Signature'
              : exam.docType === 'thumb'
              ? 'Thumb Impression'
              : 'Declaration';
          document.title = `${exam.examShortName} ${docTypeLabel} Resizer | Image Resizer Web`;
        }

        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', exam.description);
        }
        return;
      }
    }

    // Default route: '/'
    setActiveExam(null);
    setMode('manual');
    setSscPreset(null);
    setUnit('px');
    setDpi(96);
    setTargetKB(50);
    setUseTargetKB(true);
    setAspectLocked(true);
    document.title = 'Image Resizer Web — Client-Side Image Resizer & KB Compressor';
  }, [examSlug]);

  // Navigate to an exam route
  const handleSelectExamRoute = (exam) => {
    setActiveTool(null);
    navigate(`/${exam.slug}`);
  };

  // Reset entirely to Homepage View
  const handleResetToHome = () => {
    setActiveTool(null);
    setActiveExam(null);
    handleReset();
    setIsCropModalOpen(false);
    setIsSignatureModalOpen(false);
    setIsHandwritingModalOpen(false);
    setIsOcrModalOpen(false);
    setIsRemoveBgOpen(false);
    setIsWatermarkOpen(false);
    setIsRotateOpen(false);
    setIsBlurFaceOpen(false);
    setIsUpscaleOpen(false);
    setIsHtmlToImageOpen(false);
    setMode('manual');
    setSscPreset(null);
    setUnit('px');
    setDpi(96);
    setTargetKB(50);
    setUseTargetKB(true);
    setAspectLocked(true);
    setMimeType('image/jpeg');
    navigate('/');
  };

  // Handle Mode Switch from Controls
  const handleModeChange = (newMode) => {
    setActiveTool(null);
    if (newMode === 'ssc') {
      navigate('/ssc-signature-resizer');
    } else if (newMode === 'rrb') {
      navigate('/rrb-signature-resizer');
    } else if (newMode === 'banking') {
      navigate('/ibps-declaration-resizer');
    } else if (newMode === 'psc') {
      navigate('/mppsc-photo-resizer');
    } else if (newMode === 'upsc') {
      navigate('/upsc-photo-resizer');
    } else {
      handleResetToHome();
    }
  };

  // Apply Exam Preset directly from controls
  const handlePresetChange = (preset) => {
    setActiveTool(null);
    if (mode === 'rrb') {
      setEnhanceSignature(true);
      navigate('/rrb-signature-resizer');
    } else if (mode === 'banking') {
      if (preset === 'photo') {
        setEnhanceSignature(false);
        navigate('/ibps-photo-resizer');
      } else if (preset === 'thumb') {
        setEnhanceSignature(false);
        navigate('/ibps-thumb-impression-resizer');
      } else if (preset === 'declaration') {
        setEnhanceSignature(false);
        navigate('/ibps-declaration-resizer');
      } else {
        setEnhanceSignature(true);
        navigate('/ibps-signature-resizer');
      }
    } else if (mode === 'psc') {
      if (preset === 'mppsc-photo') {
        setEnhanceSignature(false);
        navigate('/mppsc-photo-resizer');
      } else if (preset === 'mppsc-signature') {
        setEnhanceSignature(true);
        navigate('/mppsc-signature-resizer');
      } else if (preset === 'uppsc-photo') {
        setEnhanceSignature(false);
        navigate('/uppsc-photo-resizer');
      } else if (preset === 'uppsc-signature') {
        setEnhanceSignature(true);
        navigate('/uppsc-signature-resizer');
      } else {
        setEnhanceSignature(preset === 'signature');
        navigate(preset === 'photo' ? '/mppsc-photo-resizer' : '/mppsc-signature-resizer');
      }
    } else if (mode === 'upsc') {
      if (preset === 'photo') {
        setEnhanceSignature(false);
        navigate('/upsc-photo-resizer');
      } else {
        setEnhanceSignature(true);
        navigate('/upsc-signature-resizer');
      }
    } else {
      if (preset === 'photo') {
        setEnhanceSignature(false);
        navigate('/ssc-photo-resizer');
      } else {
        setEnhanceSignature(true);
        navigate('/ssc-signature-resizer');
      }
    }
  };

  // Handle Tool selection from Grid on Homepage
  const handleToolSelect = (tool) => {
    switch (tool.id) {
      case 'passport': {
        setActiveTool('passport');
        setActiveExam(null);
        setWidth(3.5);
        setHeight(4.5);
        setUnit('cm');
        setDpi(300);
        setAspectRatio(3.5 / 4.5);
        setAspectLocked(true);
        setTargetKB(50);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
        navigate('/passport-size-photo-maker');
        break;
      }
      case 'compress': {
        setActiveTool('compress');
        setActiveExam(null);
        setMode('manual');
        setUseTargetKB(true);
        setTargetKB(50);
        break;
      }
      case 'resize': {
        setActiveTool('resize');
        setActiveExam(null);
        setMode('manual');
        setUseTargetKB(false);
        break;
      }
      case 'convert': {
        setActiveTool('convert');
        setActiveExam(null);
        setMode('manual');
        setUseTargetKB(false);
        setMimeType('image/webp');
        setQuality(90);
        break;
      }
      case 'crop': {
        setIsCropModalOpen(true);
        break;
      }
      case 'signature': {
        setIsSignatureModalOpen(true);
        break;
      }
      case 'handwriting': {
        setIsHandwritingModalOpen(true);
        break;
      }
      case 'ocr': {
        setIsOcrModalOpen(true);
        break;
      }
      case 'remove-bg': {
        setIsRemoveBgOpen(true);
        break;
      }
      case 'watermark': {
        setIsWatermarkOpen(true);
        break;
      }
      case 'rotate': {
        setIsRotateOpen(true);
        break;
      }
      case 'blur-face': {
        setIsBlurFaceOpen(true);
        break;
      }
      case 'upscale': {
        setIsUpscaleOpen(true);
        break;
      }
      case 'html-to-image': {
        setIsHtmlToImageOpen(true);
        break;
      }
      default:
        break;
    }
  };

  // Load Image File handler
  const loadFile = (selectedFile) => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();

    img.onload = () => {
      const w = img.naturalWidth || img.width || 800;
      const h = img.naturalHeight || img.height || 600;
      const ratio = w > 0 && h > 0 ? w / h : 1;

      setFile(selectedFile);
      setImgElement(img);

      const sizeKB = Math.round((selectedFile.size / 1024) * 10) / 10;
      setOriginalInfo({
        url: objectUrl,
        sizeBytes: selectedFile.size,
        sizeKB,
        width: w,
        height: h,
        mimeType: selectedFile.type || 'image/jpeg',
      });

      if (activeExam?.specs) {
        const isPx = activeExam.specs.unit === 'px';
        setWidth(isPx ? activeExam.specs.widthPx : (activeExam.specs.widthCm || 5.0));
        setHeight(isPx ? activeExam.specs.heightPx : (activeExam.specs.heightCm || 2.0));
        setUnit(isPx ? 'px' : 'cm');
        setDpi(activeExam.specs.dpi || (mode === 'banking' ? 200 : 300));
        setAspectRatio(activeExam.specs.aspectRatio || 2.0);
        setTargetKB(activeExam.specs.targetKB || 50);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
      } else if (activeTool === 'passport' || examSlug === 'passport-size-photo-maker') {
        setWidth(3.5);
        setHeight(4.5);
        setUnit('cm');
        setDpi(300);
        setAspectRatio(3.5 / 4.5);
        setAspectLocked(true);
        setTargetKB(50);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
      } else if (activeTool === 'compress') {
        setAspectRatio(ratio);
        setWidth(w);
        setHeight(h);
        setUnit('px');
        setDpi(96);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
        if (sizeKB <= 50) {
          setTargetKB(20);
        } else if (sizeKB <= 150) {
          setTargetKB(50);
        } else {
          setTargetKB(100);
        }
      } else if (activeTool === 'resize') {
        setAspectRatio(ratio);
        setWidth(w);
        setHeight(h);
        setUnit('px');
        setDpi(96);
        setUseTargetKB(false);
        setMimeType(selectedFile.type === 'image/webp' ? 'image/webp' : 'image/jpeg');
      } else if (activeTool === 'convert') {
        setAspectRatio(ratio);
        setWidth(w);
        setHeight(h);
        setUnit('px');
        setDpi(96);
        setUseTargetKB(false);
        setMimeType('image/webp');
        setQuality(90);
      } else if (mode === 'banking') {
        setWidth(800);
        setHeight(400);
        setUnit('px');
        setDpi(200);
        setAspectRatio(2.0);
        setTargetKB(75);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
      } else if (mode === 'rrb') {
        setWidth(5.0);
        setHeight(2.0);
        setUnit('cm');
        setDpi(300);
        setAspectRatio(5.0 / 2.0);
        setTargetKB(40);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
      } else if (mode === 'ssc') {
        if (sscPreset === 'photo') {
          setWidth(3.5);
          setHeight(4.5);
          setAspectRatio(3.5 / 4.5);
          setTargetKB(35);
        } else {
          setWidth(6.0);
          setHeight(2.0);
          setAspectRatio(3.0);
          setTargetKB(15);
        }
        setUnit('cm');
        setDpi(300);
        setUseTargetKB(true);
        setMimeType('image/jpeg');
      } else {
        setAspectRatio(ratio);
        setWidth(w);
        setHeight(h);
        setUnit('px');
        setDpi(96);
        setMimeType(
          selectedFile.type === 'image/webp'
            ? 'image/webp'
            : 'image/jpeg'
        );

        if (sizeKB <= 50) {
          setTargetKB(20);
        } else if (sizeKB <= 150) {
          setTargetKB(50);
        } else {
          setTargetKB(100);
        }
      }
    };

    img.onerror = (err) => {
      console.error('Failed to decode image file:', err);
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  // Sample image demo loader
  const handleSampleSelected = async () => {
    try {
      setIsLoadingSample(true);
      const isSignature =
        mode === 'rrb' ||
        (mode === 'ssc' && sscPreset === 'signature') ||
        (mode === 'banking' && sscPreset !== 'photo') ||
        (mode === 'psc' && (sscPreset === 'signature' || sscPreset === 'mppsc-signature' || sscPreset === 'uppsc-signature')) ||
        (mode === 'upsc' && sscPreset === 'signature') ||
        activeExam?.docType === 'signature' ||
        activeExam?.docType === 'declaration' ||
        activeExam?.docType === 'thumb';
      const sampleFile = isSignature
        ? await generateSampleSignature()
        : await generateSampleImage();
      loadFile(sampleFile);
    } catch (e) {
      console.error('Demo sample loader error:', e);
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Reset to initial state
  const handleReset = () => {
    if (originalInfo?.url) {
      URL.revokeObjectURL(originalInfo.url);
    }
    if (processedResult?.url) {
      URL.revokeObjectURL(processedResult.url);
    }
    setFile(null);
    setImgElement(null);
    setOriginalInfo(null);
    setProcessedResult(null);
    setWidth('');
    setHeight('');
  };

  // Convert unit change
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit || !width || !height) {
      setUnit(newUnit);
      return;
    }
    const newW = convertUnit(width, unit, newUnit, dpi);
    const newH = convertUnit(height, unit, newUnit, dpi);
    setUnit(newUnit);
    setWidth(newW);
    setHeight(newH);
  };

  // DPI change
  const handleDpiChange = (newDpi) => {
    if (unit === 'px') {
      setDpi(newDpi);
      return;
    }
    const pxW = toPixels(width, unit, dpi);
    const pxH = toPixels(height, unit, dpi);
    setDpi(newDpi);
    setWidth(fromPixels(pxW, unit, newDpi));
    setHeight(fromPixels(pxH, unit, newDpi));
  };

  // Width change
  const handleWidthChange = (val) => {
    setWidth(val);
    if (aspectLocked && val !== '' && !isNaN(val) && aspectRatio > 0) {
      const num = Number(val);
      const calcH = num / aspectRatio;
      setHeight(
        unit === 'px'
          ? Math.round(calcH)
          : Math.round(calcH * 100) / 100
      );
    }
  };

  // Height change
  const handleHeightChange = (val) => {
    setHeight(val);
    if (aspectLocked && val !== '' && !isNaN(val) && aspectRatio > 0) {
      const num = Number(val);
      const calcW = num * aspectRatio;
      setWidth(
        unit === 'px'
          ? Math.round(calcW)
          : Math.round(calcW * 100) / 100
      );
    }
  };

  // Quick scale preset
  const handleScalePreset = (scale) => {
    if (!originalInfo) return;
    const targetPxW = Math.round(originalInfo.width * scale);
    const targetPxH = Math.round(originalInfo.height * scale);
    setWidth(fromPixels(targetPxW, unit, dpi));
    setHeight(fromPixels(targetPxH, unit, dpi));
  };

  // Run Compression Engine
  const runCompression = useCallback(async () => {
    if (!imgElement || !originalInfo) return;

    const pxW = toPixels(width, unit, dpi);
    const pxH = toPixels(height, unit, dpi);

    if (pxW <= 0 || pxH <= 0) return;

    setIsProcessing(true);
    try {
      const docType = activeExam?.docType || sscPreset;
      const isStrictSignature =
        (mode === 'ssc' || mode === 'rrb' || mode === 'banking' || mode === 'psc' || mode === 'upsc') &&
        (docType === 'signature' || (!docType && mode === 'rrb'));

      const isContainMode =
        (mode === 'ssc' || mode === 'rrb' || mode === 'banking' || mode === 'psc' || mode === 'upsc') &&
        (docType === 'signature' ||
          docType === 'thumb' ||
          docType === 'declaration');

      const result = await processImage(imgElement, {
        width: pxW,
        height: pxH,
        targetSizeKB: useTargetKB && targetKB ? Number(targetKB) : null,
        mimeType,
        initialQuality: quality / 100,
        toleranceKB: 2.0, // ±2 KB accuracy
        nameDateOptions:
          (mode === 'ssc' || mode === 'rrb') && docType === 'photo'
            ? nameDateOptions
            : null,
        enhanceSignature: isStrictSignature ? enhanceSignature : false,
        isSignature: isContainMode,
        fitMode: isContainMode ? 'contain' : 'cover',
        docType: docType,
      });

      if (processedResult?.url && processedResult.url !== result.url) {
        URL.revokeObjectURL(processedResult.url);
      }

      setProcessedResult(result);
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [
    imgElement,
    originalInfo,
    width,
    height,
    unit,
    dpi,
    useTargetKB,
    targetKB,
    mimeType,
    quality,
    mode,
    sscPreset,
    activeExam,
    nameDateOptions,
    enhanceSignature,
  ]);

  // Debounced execution whenever parameters change
  useEffect(() => {
    if (!imgElement || !width || !height) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      runCompression();
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    runCompression,
    imgElement,
    width,
    height,
    targetKB,
    useTargetKB,
    mimeType,
    quality,
    unit,
    dpi,
    nameDateOptions,
    enhanceSignature,
  ]);

  const isRootHome = !examSlug && !activeExam && !activeTool && !originalInfo && !file;

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface flex flex-col font-sans selection:bg-m3-primary-container selection:text-m3-on-primary-container transition-colors">
      {/* Dynamic SEO JSON-LD Structured Data */}
      <SeoStructuredData activeExam={activeExam} />

      {/* Header with Theme Toggle & Back Navigation */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenInfo={() => setIsInfoOpen(true)}
        onReset={handleResetToHome}
        hasImage={Boolean(originalInfo)}
        showBackButton={!isRootHome}
        onResetToHome={handleResetToHome}
      />

      {/* AdSense Top Slot - Hidden until AdSense approval */}
      {ADS_ENABLED && (
        <div className="adsense-slot-top w-full max-w-4xl mx-auto px-4 my-2 text-center">
          <div className="w-full min-h-[90px] rounded-2xl border border-dashed border-m3-outline-variant/40 bg-m3-surface-container-low/40 flex flex-col items-center justify-center p-3 text-xs text-m3-outline transition-colors hover:bg-m3-surface-container-low/60">
            <span className="text-[10px] tracking-wider uppercase font-bold text-m3-outline/80">Advertisement</span>
            <span className="text-[11px] text-m3-outline/60 mt-0.5">Responsive Display Banner Slot (728×90 / Responsive)</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col">
        {isRootHome ? (
          /* Step 1: Clean Root Homepage View (No Upload Dropzone) */
          <Home
            onSelectTool={handleToolSelect}
            onSelectExamRoute={handleSelectExamRoute}
          />
        ) : !originalInfo ? (
          /* Step 2: Dedicated Tool / Exam Dropzone */
          <div className="flex-1 flex flex-col justify-center items-center">
            <Dropzone
              activeExam={activeExam}
              activeTool={activeTool}
              mode={mode}
              sscPreset={sscPreset}
              onResetToGeneral={handleResetToHome}
              onFileSelected={loadFile}
              onSampleSelected={handleSampleSelected}
              isLoadingSample={isLoadingSample}
            />

            {/* If landed on a dedicated exam slug, display the FAQ section below dropzone */}
            {activeExam && <ExamFaqSection examConfig={activeExam} />}
          </div>
        ) : (
          /* Step 3: Streamlined Settings & Output Workspace */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Workspace Grid: Controls on Left, Previews & Pre-Flight Checklist on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls Column (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <ControlPanel
                  mode={mode}
                  setMode={handleModeChange}
                  sscPreset={sscPreset}
                  setSscPreset={handlePresetChange}
                  activeExam={activeExam}
                  activeTool={activeTool}
                  originalInfo={originalInfo}
                  targetKB={targetKB}
                  setTargetKB={setTargetKB}
                  useTargetKB={useTargetKB}
                  setUseTargetKB={setUseTargetKB}
                  width={width}
                  height={height}
                  unit={unit}
                  setUnit={handleUnitChange}
                  dpi={dpi}
                  setDpi={handleDpiChange}
                  aspectLocked={aspectLocked}
                  setAspectLocked={setAspectLocked}
                  onWidthChange={handleWidthChange}
                  onHeightChange={handleHeightChange}
                  onScalePreset={handleScalePreset}
                  mimeType={mimeType}
                  setMimeType={setMimeType}
                  quality={quality}
                  setQuality={setQuality}
                  nameDateOptions={nameDateOptions}
                  setNameDateOptions={setNameDateOptions}
                  enhanceSignature={enhanceSignature}
                  setEnhanceSignature={setEnhanceSignature}
                  isProcessing={isProcessing}
                  onApplyManual={runCompression}
                />
              </div>

              {/* Previews & Output Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <PreviewSection
                  mode={mode}
                  sscPreset={sscPreset}
                  activeExam={activeExam}
                  activeTool={activeTool}
                  originalInfo={originalInfo}
                  processedResult={processedResult}
                  targetKB={targetKB}
                  useTargetKB={useTargetKB}
                  dpi={dpi}
                  enhanceSignature={enhanceSignature}
                  isProcessing={isProcessing}
                  fileName={file?.name}
                />
              </div>
            </div>

            {/* If on a dedicated exam, show FAQs below workspace too */}
            {activeExam && <ExamFaqSection examConfig={activeExam} />}
          </div>
        )}
      </main>

      {/* AdSense Bottom Slot - Hidden until AdSense approval */}
      {ADS_ENABLED && (
        <div className="adsense-slot-bottom w-full max-w-4xl mx-auto px-4 my-4 text-center">
          <div className="w-full min-h-[90px] rounded-2xl border border-dashed border-m3-outline-variant/40 bg-m3-surface-container-low/40 flex flex-col items-center justify-center p-3 text-xs text-m3-outline transition-colors hover:bg-m3-surface-container-low/60">
            <span className="text-[10px] tracking-wider uppercase font-bold text-m3-outline/80">Advertisement</span>
            <span className="text-[11px] text-m3-outline/60 mt-0.5">Responsive Display Banner Slot (728×90 / Responsive)</span>
          </div>
        </div>
      )}

      {/* Full Material 3 SEO Directory Footer */}
      <Footer onOpenInfo={() => setIsInfoOpen(true)} />

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Crop Tool Modal */}
      <CropToolModal
        isOpen={isCropModalOpen}
        initialImageFile={file}
        onClose={() => setIsCropModalOpen(false)}
        onApplyCrop={(croppedFile) => {
          loadFile(croppedFile);
          setIsCropModalOpen(false);
        }}
      />

      {/* Signature Maker Modal */}
      <SignatureMakerModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onLoadIntoApp={(sigFile) => {
          loadFile(sigFile);
          setIsSignatureModalOpen(false);
        }}
      />

      {/* Text to Handwriting Modal */}
      <HandwritingModal
        isOpen={isHandwritingModalOpen}
        onClose={() => setIsHandwritingModalOpen(false)}
        onLoadIntoApp={(declFile) => {
          loadFile(declFile);
          setIsHandwritingModalOpen(false);
        }}
      />

      {/* In-Browser OCR Extractor Modal */}
      <OcrModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
      />

      {/* Remove Background Modal */}
      <RemoveBgModal
        isOpen={isRemoveBgOpen}
        initialImageFile={file}
        onClose={() => {
          setIsRemoveBgOpen(false);
          if (examSlug === 'remove-background') navigate('/');
        }}
        onLoadIntoApp={(resFile) => {
          loadFile(resFile);
          setIsRemoveBgOpen(false);
          if (examSlug === 'remove-background') navigate('/');
        }}
      />

      {/* Watermark Modal */}
      <WatermarkModal
        isOpen={isWatermarkOpen}
        initialImageFile={file}
        onClose={() => {
          setIsWatermarkOpen(false);
          if (examSlug === 'watermark-image') navigate('/');
        }}
        onLoadIntoApp={(resFile) => {
          loadFile(resFile);
          setIsWatermarkOpen(false);
          if (examSlug === 'watermark-image') navigate('/');
        }}
      />

      {/* Rotate & Flip Modal */}
      <RotateModal
        isOpen={isRotateOpen}
        initialImageFile={file}
        onClose={() => {
          setIsRotateOpen(false);
          if (examSlug === 'rotate-image') navigate('/');
        }}
        onLoadIntoApp={(resFile) => {
          loadFile(resFile);
          setIsRotateOpen(false);
          if (examSlug === 'rotate-image') navigate('/');
        }}
      />

      {/* Blur Face & Redact Modal */}
      <BlurFaceModal
        isOpen={isBlurFaceOpen}
        initialImageFile={file}
        onClose={() => {
          setIsBlurFaceOpen(false);
          if (examSlug === 'blur-face') navigate('/');
        }}
        onLoadIntoApp={(resFile) => {
          loadFile(resFile);
          setIsBlurFaceOpen(false);
          if (examSlug === 'blur-face') navigate('/');
        }}
      />

      {/* Upscale Modal */}
      <UpscaleModal
        isOpen={isUpscaleOpen}
        initialImageFile={file}
        onClose={() => {
          setIsUpscaleOpen(false);
          if (examSlug === 'upscale-image') navigate('/');
        }}
        onLoadIntoApp={(resFile) => {
          loadFile(resFile);
          setIsUpscaleOpen(false);
          if (examSlug === 'upscale-image') navigate('/');
        }}
      />

      {/* HTML to Image Modal */}
      <HtmlToImageModal
        isOpen={isHtmlToImageOpen}
        onClose={() => {
          setIsHtmlToImageOpen(false);
          if (examSlug === 'html-to-image') navigate('/');
        }}
        onLoadIntoApp={(resFile) => {
          loadFile(resFile);
          setIsHtmlToImageOpen(false);
          if (examSlug === 'html-to-image') navigate('/');
        }}
      />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Routes>
      <Route path="/" element={<MainResizerApp theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/privacy" element={<PrivacyPolicy theme={theme} onToggleTheme={toggleTheme} />} />
      <Route path="/terms" element={<TermsOfService theme={theme} onToggleTheme={toggleTheme} />} />
      <Route path="/about" element={<AboutContact theme={theme} onToggleTheme={toggleTheme} defaultTab="about" />} />
      <Route path="/contact" element={<AboutContact theme={theme} onToggleTheme={toggleTheme} defaultTab="contact" />} />
      <Route path="/:examSlug" element={<MainResizerApp theme={theme} toggleTheme={toggleTheme} />} />
    </Routes>
  );
}
