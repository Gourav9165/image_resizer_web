/**
 * Image Resizer & Reducer Compression Engine
 * Uses client-side HTML5 Canvas with binary search quality tuning,
 * transparent PNG background safety guard (always white background),
 * one-click Signature Enhancer (crisp B&W), and SSC Name & Date strip.
 */

export const DPI_PRESETS = [
  { label: 'Screen (96 DPI)', value: 96 },
  { label: 'Print Standard (300 DPI)', value: 300 },
  { label: 'Web Low (72 DPI)', value: 72 },
  { label: 'Medium (150 DPI)', value: 150 },
];

/**
 * Unit conversions
 * 1 inch = 25.4 mm = 2.54 cm
 */
export function convertUnit(value, fromUnit, toUnit, dpi = 96) {
  if (value === '' || isNaN(value) || value <= 0) return '';
  if (fromUnit === toUnit) return Math.round(value * 100) / 100;

  let px = 0;
  if (fromUnit === 'px') {
    px = Number(value);
  } else if (fromUnit === 'mm') {
    px = (Number(value) / 25.4) * dpi;
  } else if (fromUnit === 'cm') {
    px = (Number(value) / 2.54) * dpi;
  }

  let result = 0;
  if (toUnit === 'px') {
    result = Math.round(px);
  } else if (toUnit === 'mm') {
    result = Math.round(((px * 25.4) / dpi) * 10) / 10;
  } else if (toUnit === 'cm') {
    result = Math.round(((px * 2.54) / dpi) * 100) / 100;
  }

  return result;
}

/**
 * Convert any unit value to pixels
 */
export function toPixels(value, unit, dpi = 96) {
  const num = Number(value);
  if (!num || isNaN(num) || num <= 0) return 0;
  if (unit === 'px') return Math.round(num);
  if (unit === 'mm') return Math.round((num / 25.4) * dpi);
  if (unit === 'cm') return Math.round((num / 2.54) * dpi);
  return Math.round(num);
}

/**
 * Convert pixels to specified unit
 */
export function fromPixels(px, unit, dpi = 96) {
  if (!px || isNaN(px) || px <= 0) return 0;
  if (unit === 'px') return Math.round(px);
  if (unit === 'mm') return Math.round(((px * 25.4) / dpi) * 10) / 10;
  if (unit === 'cm') return Math.round(((px * 2.54) / dpi) * 100) / 100;
  return Math.round(px);
}

/**
 * Format bytes to readable string
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Helper to turn canvas to blob with promise
 */
function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

/**
 * One-Click Signature Enhancer:
 * Converts to grayscale, removes paper shadows/yellow tint to pure white (#FFFFFF),
 * and enhances pen strokes to deep crisp black (#000000).
 */
export function applySignatureEnhancer(ctx, width, height) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const len = data.length;

  // 1. Build luminance histogram
  const histogram = new Uint32Array(256);
  let totalPixels = 0;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    histogram[y]++;
    totalPixels++;
  }

  // 2. Identify background paper level vs ink stroke level
  let accum = 0;
  let inkLuminance = 80;
  let paperLuminance = 200;

  for (let i = 0; i < 256; i++) {
    accum += histogram[i];
    if (accum >= totalPixels * 0.05 && inkLuminance === 80) {
      inkLuminance = i;
    }
    if (accum >= totalPixels * 0.70 && paperLuminance === 200) {
      paperLuminance = i;
      break;
    }
  }

  const low = Math.max(15, Math.min(130, inkLuminance + 20));
  const high = Math.min(252, Math.max(low + 35, paperLuminance - 10));
  const range = high - low;

  // 3. Pixel contrast transformation
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const y = 0.299 * r + 0.587 * g + 0.114 * b;

    let val;
    if (y >= high) {
      // Paper background turns pure solid white
      val = 255;
    } else if (y <= low) {
      // Pen stroke turns deep crisp black
      val = 0;
    } else {
      // Smooth anti-aliased edge
      const norm = (y - low) / range;
      val = Math.round(Math.pow(norm, 1.6) * 255);
    }

    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Multi-step high-quality canvas draw with:
 * - Transparent PNG Safety Guard: Paints solid white (#FFFFFF) across canvas first.
 * - Fit & Pad Mode for Signatures: NEVER crops or clips letters; fits entire signature comfortably with 5-8% padding.
 * - Automatic centered aspect-ratio cropping for Photos / General images.
 * - Optional One-Click Signature Enhancer (crisp B&W, solid #FFFFFF background).
 * - Optional Name & Date of Photo (DoP) banner.
 */
function drawImageHighQuality(
  canvas,
  img,
  targetWidth,
  targetHeight,
  nameDateOptions = null,
  enhanceSignature = false,
  isSignature = false,
  fitMode = 'cover',
  docType = null
) {
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // SAFETY GUARD: Always paint solid pure white (#FFFFFF) across canvas first
  // so transparent PNGs and padded signature margins never render with dark/black backgrounds
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  const sourceWidth = img.naturalWidth || img.width;
  const sourceHeight = img.naturalHeight || img.height;

  // Signatures, Thumbs, Declarations should NEVER be aspect-filled or center-cropped!
  const isFitAndPad =
    isSignature ||
    fitMode === 'contain' ||
    docType === 'signature' ||
    docType === 'thumb' ||
    docType === 'declaration';

  if (isFitAndPad) {
    // FIT & PAD MODE FOR SIGNATURES, THUMBS & DECLARATIONS:
    // Scale using Math.min so the full content fits comfortably with 6-10% padding without edge clipping
    const paddingFactor = docType === 'declaration' ? 0.92 : 0.88; // leaves clean margins
    const scale = Math.min(
      (targetWidth * paddingFactor) / sourceWidth,
      (targetHeight * paddingFactor) / sourceHeight
    );
    const drawWidth = Math.round(sourceWidth * scale);
    const drawHeight = Math.round(sourceHeight * scale);
    const drawX = Math.round((targetWidth - drawWidth) / 2);
    const drawY = Math.round((targetHeight - drawHeight) / 2);

    // Multi-step stepped downsampling if downsizing by more than 2x
    if (drawWidth < sourceWidth * 0.5 && drawHeight < sourceHeight * 0.5) {
      let oc = document.createElement('canvas');
      let octx = oc.getContext('2d');
      oc.width = sourceWidth;
      oc.height = sourceHeight;
      octx.fillStyle = '#FFFFFF';
      octx.fillRect(0, 0, sourceWidth, sourceHeight);
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      octx.drawImage(img, 0, 0, sourceWidth, sourceHeight);

      let curWidth = sourceWidth;
      let curHeight = sourceHeight;

      while (curWidth * 0.5 > drawWidth && curHeight * 0.5 > drawHeight) {
        curWidth = Math.floor(curWidth * 0.5);
        curHeight = Math.floor(curHeight * 0.5);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = curWidth;
        tempCanvas.height = curHeight;
        const tctx = tempCanvas.getContext('2d');
        tctx.fillStyle = '#FFFFFF';
        tctx.fillRect(0, 0, curWidth, curHeight);
        tctx.imageSmoothingEnabled = true;
        tctx.imageSmoothingQuality = 'high';
        tctx.drawImage(oc, 0, 0, curWidth, curHeight);
        oc = tempCanvas;
      }

      ctx.drawImage(oc, 0, 0, curWidth, curHeight, drawX, drawY, drawWidth, drawHeight);
    } else {
      ctx.drawImage(
        img,
        0,
        0,
        sourceWidth,
        sourceHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );
    }
  } else {
    // COVER / CROP MODE FOR PHOTOS & GENERAL IMAGES:
    const srcAspect = sourceWidth / sourceHeight;
    const targetAspect = targetWidth / targetHeight;

    // Compute automatic centered crop source coordinates
    let sx = 0;
    let sy = 0;
    let sWidth = sourceWidth;
    let sHeight = sourceHeight;

    if (Math.abs(srcAspect - targetAspect) > 0.005) {
      if (srcAspect > targetAspect) {
        // Source is wider than target: crop equal amounts left and right
        sWidth = Math.round(sourceHeight * targetAspect);
        sx = Math.round((sourceWidth - sWidth) / 2);
      } else {
        // Source is taller than target: crop top & bottom (35% top bias for passport portrait framing)
        sHeight = Math.round(sourceWidth / targetAspect);
        sy = Math.round((sourceHeight - sHeight) * 0.35);
        if (sy < 0) sy = 0;
        if (sy + sHeight > sourceHeight) sy = sourceHeight - sHeight;
      }
    }

    // Multi-step stepped downsampling if downsizing by more than 2x
    if (targetWidth < sWidth * 0.5 || targetHeight < sHeight * 0.5) {
      let oc = document.createElement('canvas');
      let octx = oc.getContext('2d');
      oc.width = sWidth;
      oc.height = sHeight;
      octx.fillStyle = '#FFFFFF';
      octx.fillRect(0, 0, sWidth, sHeight);
      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      octx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

      let curWidth = sWidth;
      let curHeight = sHeight;

      while (curWidth * 0.5 > targetWidth && curHeight * 0.5 > targetHeight) {
        curWidth = Math.floor(curWidth * 0.5);
        curHeight = Math.floor(curHeight * 0.5);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = curWidth;
        tempCanvas.height = curHeight;
        const tctx = tempCanvas.getContext('2d');
        tctx.fillStyle = '#FFFFFF';
        tctx.fillRect(0, 0, curWidth, curHeight);
        tctx.imageSmoothingEnabled = true;
        tctx.imageSmoothingQuality = 'high';
        tctx.drawImage(oc, 0, 0, curWidth, curHeight);
        oc = tempCanvas;
      }

      ctx.drawImage(oc, 0, 0, targetWidth, targetHeight);
    } else {
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
    }
  }

  // Apply One-Click Signature Enhancer STRICTLY to signatures:
  // NEVER run for declarations, thumb impressions, or photos to preserve natural gradations.
  const isStrictSignature =
    docType === 'signature' ||
    (!docType && !nameDateOptions?.enabled && isSignature);

  if (
    enhanceSignature &&
    isStrictSignature &&
    docType !== 'declaration' &&
    docType !== 'thumb' &&
    docType !== 'photo'
  ) {
    applySignatureEnhancer(ctx, targetWidth, targetHeight);
  }

  // Paint Name & Date of Photo (DoP) Strip if requested (only for photos)
  if (
    !isFitAndPad &&
    nameDateOptions &&
    nameDateOptions.enabled &&
    (nameDateOptions.name || nameDateOptions.date)
  ) {
    const bannerHeight = Math.max(30, Math.round(targetHeight * 0.17));
    const bannerY = targetHeight - bannerHeight;

    // Clean solid white background banner
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, bannerY, targetWidth, bannerHeight);

    // Subtle crisp top border line
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, bannerY, targetWidth, 1.5);

    // Render crisp centered text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const candidateName = (nameDateOptions.name || '').trim().toUpperCase();
    const photoDate = (nameDateOptions.date || '').trim();

    if (candidateName && photoDate) {
      const fontSize = Math.max(10, Math.round(bannerHeight * 0.32));
      ctx.font = `700 ${fontSize}px sans-serif`;
      ctx.fillText(candidateName, targetWidth / 2, bannerY + bannerHeight * 0.32);

      const dateText =
        photoDate.toUpperCase().startsWith('DOP') || photoDate.toUpperCase().startsWith('DATE')
          ? photoDate
          : `DOP: ${photoDate}`;
      ctx.font = `600 ${fontSize * 0.9}px sans-serif`;
      ctx.fillText(dateText, targetWidth / 2, bannerY + bannerHeight * 0.72);
    } else {
      const text = candidateName || photoDate;
      const fontSize = Math.max(11, Math.round(bannerHeight * 0.45));
      ctx.font = `700 ${fontSize}px sans-serif`;
      ctx.fillText(text, targetWidth / 2, bannerY + bannerHeight * 0.5);
    }
  }

  return ctx;
}

/**
 * Main compression and resize routine
 */
export async function processImage(img, options) {
  const {
    width,
    height,
    targetSizeKB = null,
    mimeType = 'image/jpeg',
    initialQuality = 0.92,
    toleranceKB = 2.0,
    nameDateOptions = null,
    enhanceSignature = false,
    isSignature = false,
    fitMode = 'cover',
    docType = null,
  } = options;

  let targetW = Math.max(1, Math.round(width));
  let targetH = Math.max(1, Math.round(height));

  const canvas = document.createElement('canvas');
  drawImageHighQuality(
    canvas,
    img,
    targetW,
    targetH,
    nameDateOptions,
    enhanceSignature,
    isSignature,
    fitMode,
    docType
  );

  const isLossy = mimeType === 'image/jpeg' || mimeType === 'image/webp';

  // CASE 1: No target KB specified -> Just export at target dimensions and initialQuality
  if (!targetSizeKB || targetSizeKB <= 0) {
    const quality = isLossy ? initialQuality : undefined;
    const blob = await canvasToBlob(canvas, mimeType, quality);
    const sizeKB = blob.size / 1024;
    return {
      blob,
      url: URL.createObjectURL(blob),
      sizeKB: Math.round(sizeKB * 10) / 10,
      width: targetW,
      height: targetH,
      quality: isLossy ? initialQuality : 1,
      iterations: 1,
      targetHit: true,
    };
  }

  // CASE 2: Lossless PNG with target KB constraint
  if (!isLossy) {
    let currentBlob = await canvasToBlob(canvas, 'image/png');
    let currentKB = currentBlob.size / 1024;

    if (currentKB <= targetSizeKB + toleranceKB) {
      return {
        blob: currentBlob,
        url: URL.createObjectURL(currentBlob),
        sizeKB: Math.round(currentKB * 10) / 10,
        width: targetW,
        height: targetH,
        quality: 1,
        iterations: 1,
        targetHit: Math.abs(currentKB - targetSizeKB) <= toleranceKB,
      };
    }

    let minScale = 0.1;
    let maxScale = 1.0;
    let bestBlob = currentBlob;
    let bestKB = currentKB;
    let bestW = targetW;
    let bestH = targetH;
    let iterations = 0;

    while (iterations < 8) {
      iterations++;
      const midScale = (minScale + maxScale) / 2;
      const testW = Math.max(1, Math.round(targetW * midScale));
      const testH = Math.max(1, Math.round(targetH * midScale));
      drawImageHighQuality(
        canvas,
        img,
        testW,
        testH,
        nameDateOptions,
        enhanceSignature,
        isSignature,
        fitMode,
        docType
      );

      const testBlob = await canvasToBlob(canvas, 'image/png');
      const testKB = testBlob.size / 1024;

      if (Math.abs(testKB - targetSizeKB) <= toleranceKB) {
        bestBlob = testBlob;
        bestKB = testKB;
        bestW = testW;
        bestH = testH;
        break;
      }

      if (testKB > targetSizeKB) {
        maxScale = midScale;
      } else {
        minScale = midScale;
        bestBlob = testBlob;
        bestKB = testKB;
        bestW = testW;
        bestH = testH;
      }
    }

    return {
      blob: bestBlob,
      url: URL.createObjectURL(bestBlob),
      sizeKB: Math.round(bestKB * 10) / 10,
      width: bestW,
      height: bestH,
      quality: 1,
      iterations,
      targetHit: Math.abs(bestKB - targetSizeKB) <= toleranceKB,
    };
  }

  // CASE 3: JPEG / WebP with target KB - Precision Binary Search on Quality
  let lowQuality = 0.01;
  let highQuality = 1.0;
  let bestBlob = null;
  let bestKB = 0;
  let bestQuality = initialQuality;
  let iterations = 0;
  const maxIterations = 16;

  // First check if max quality is already below target
  const maxBlob = await canvasToBlob(canvas, mimeType, 1.0);
  const maxKB = maxBlob.size / 1024;
  if (maxKB <= targetSizeKB) {
    return {
      blob: maxBlob,
      url: URL.createObjectURL(maxBlob),
      sizeKB: Math.round(maxKB * 10) / 10,
      width: targetW,
      height: targetH,
      quality: 1.0,
      iterations: 1,
      targetHit: true,
      note: 'Already smaller than target at maximum quality',
    };
  }

  // Check if minimum quality (0.01) is still too large
  const minBlob = await canvasToBlob(canvas, mimeType, 0.01);
  const minKB = minBlob.size / 1024;

  if (minKB > targetSizeKB + toleranceKB) {
    let scale = Math.sqrt(targetSizeKB / minKB) * 0.95;
    scale = Math.max(0.1, Math.min(0.95, scale));
    targetW = Math.max(1, Math.round(targetW * scale));
    targetH = Math.max(1, Math.round(targetH * scale));
    drawImageHighQuality(
      canvas,
      img,
      targetW,
      targetH,
      nameDateOptions,
      enhanceSignature,
      isSignature,
      fitMode,
      docType
    );
  }

  bestBlob = minBlob;
  bestKB = minKB;
  bestQuality = 0.01;

  while (iterations < maxIterations) {
    iterations++;
    const midQuality = (lowQuality + highQuality) / 2;
    const testBlob = await canvasToBlob(canvas, mimeType, midQuality);
    const testKB = testBlob.size / 1024;

    const diff = Math.abs(testKB - targetSizeKB);

    if (diff <= toleranceKB) {
      bestBlob = testBlob;
      bestKB = testKB;
      bestQuality = midQuality;
      break;
    }

    if (testKB > targetSizeKB) {
      highQuality = midQuality;
    } else {
      lowQuality = midQuality;
      bestBlob = testBlob;
      bestKB = testKB;
      bestQuality = midQuality;
    }

    if (!bestBlob || Math.abs(testKB - targetSizeKB) < Math.abs(bestKB - targetSizeKB)) {
      bestBlob = testBlob;
      bestKB = testKB;
      bestQuality = midQuality;
    }

    if (highQuality - lowQuality < 0.005) {
      break;
    }
  }

  const finalKB = bestBlob ? bestBlob.size / 1024 : 0;
  const isWithinTolerance = Math.abs(finalKB - targetSizeKB) <= toleranceKB;

  return {
    blob: bestBlob,
    url: URL.createObjectURL(bestBlob),
    sizeKB: Math.round(finalKB * 10) / 10,
    width: targetW,
    height: targetH,
    quality: Math.round(bestQuality * 100) / 100,
    iterations,
    targetHit: isWithinTolerance,
  };
}

/**
 * Creates a sample test image using canvas
 */
export function generateSampleImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
    grad.addColorStop(0, '#f3edf7');
    grad.addColorStop(0.5, '#eaddff');
    grad.addColorStop(1, '#d0bcff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1080);

    const drawGlowCircle = (x, y, r, color) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    drawGlowCircle(400, 350, 300, 'rgba(103, 80, 164, 0.25)');
    drawGlowCircle(1450, 400, 450, 'rgba(125, 82, 96, 0.2)');
    drawGlowCircle(960, 750, 400, 'rgba(25, 104, 54, 0.2)');

    ctx.fillStyle = '#1d1b20';
    ctx.font = 'bold 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Image Resizer Web', 960, 480);

    ctx.fillStyle = '#49454f';
    ctx.font = '32px sans-serif';
    ctx.fillText('1920 × 1080 px High-Res Benchmark Sample', 960, 560);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1920; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1080);
      ctx.stroke();
    }
    for (let y = 0; y < 1080; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1920, y);
      ctx.stroke();
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], 'sample-artwork-1920x1080.jpg', {
        type: 'image/jpeg',
      });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Creates a realistic sample signature on slightly warm/shadowed paper
 * to test the One-Click Signature Enhancer (converting gray paper to pure white
 * and strokes to crisp deep black).
 */
export function generateSampleSignature() {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Simulate mobile camera photo of paper with phone shadow and warm tint
    const grad = ctx.createLinearGradient(0, 0, 800, 400);
    grad.addColorStop(0, '#e8e2d8');
    grad.addColorStop(0.4, '#ded7cd');
    grad.addColorStop(1, '#cbbfb1'); // Shadow on right
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 400);

    // Paper subtle guide line
    ctx.strokeStyle = 'rgba(70, 70, 90, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 280);
    ctx.lineTo(750, 280);
    ctx.stroke();

    // Draw realistic handwritten cursive signature
    ctx.strokeStyle = '#223366'; // Faded blue ballpoint ink
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Initial flourish 'R'
    ctx.moveTo(120, 260);
    ctx.bezierCurveTo(100, 160, 180, 120, 170, 270);
    ctx.bezierCurveTo(180, 180, 240, 190, 230, 270);
    // 'a'
    ctx.bezierCurveTo(240, 230, 270, 220, 275, 265);
    ctx.bezierCurveTo(280, 275, 290, 245, 305, 265);
    // 'h'
    ctx.bezierCurveTo(310, 160, 320, 150, 325, 265);
    ctx.bezierCurveTo(335, 230, 355, 230, 360, 265);
    // 'u'
    ctx.bezierCurveTo(370, 240, 385, 240, 395, 265);
    // 'l'
    ctx.bezierCurveTo(405, 140, 415, 140, 420, 265);
    // 'S'
    ctx.bezierCurveTo(460, 180, 440, 140, 480, 170);
    ctx.bezierCurveTo(500, 190, 470, 250, 520, 265);
    // flourish underline with dot
    ctx.bezierCurveTo(550, 240, 600, 235, 680, 260);
    ctx.stroke();

    // Underline sweep
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(140, 295);
    ctx.bezierCurveTo(280, 310, 500, 305, 690, 285);
    ctx.stroke();

    // Dots
    ctx.beginPath();
    ctx.arc(630, 315, 3, 0, Math.PI * 2);
    ctx.arc(655, 313, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#223366';
    ctx.fill();

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], 'sample-signature-camera.jpg', {
          type: 'image/jpeg',
        });
        resolve(file);
      },
      'image/jpeg',
      0.92
    );
  });
}
