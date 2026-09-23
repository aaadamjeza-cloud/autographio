export type ResizedPhoto = {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
};

const MAX_DIMENSION = 1200;
const TARGET_BYTES = 150 * 1024;
const MIN_QUALITY = 0.5;

// Resizes + re-encodes an image entirely client-side (canvas), which both
// shrinks it and strips EXIF (GPS included) — canvas re-encoding never
// preserves EXIF, so no separate "strip metadata" step is needed.
// Options let callers that persist the result somewhere space-constrained
// (e.g. PersonPortrait's localStorage cache) ask for a smaller target than
// the default — PhotoPicker's real Supabase Storage uploads have no such
// constraint and keep using the roomier defaults.
export async function resizeImageToWebp(
  file: File,
  options?: { maxDimension?: number; targetBytes?: number }
): Promise<ResizedPhoto> {
  const maxDimension = options?.maxDimension ?? MAX_DIMENSION;
  const targetBytes = options?.targetBytes ?? TARGET_BYTES;

  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap) bitmap.close();

  let quality = 0.82;
  let blob = await canvasToBlob(canvas, quality);
  while (blob && blob.size > targetBytes && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }
  if (!blob) throw new Error("Nepodařilo se zpracovat obrázek");

  return {
    blob,
    previewUrl: URL.createObjectURL(blob),
    width,
    height,
    originalSize: file.size,
    compressedSize: blob.size,
  };
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in window) {
    return createImageBitmap(file);
  }
  // Safari-old-versions fallback path.
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    return createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

// Object URLs (blob:) die on reload — for anything that should survive a
// refresh with no backend yet (e.g. a person portrait cached in
// localStorage), a data: URL is what actually persists.
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
