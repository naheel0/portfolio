import { getPlaiceholder } from "plaiceholder";

/**
 * Generate blur placeholder data URL for an image
 * Works with local files or URLs
 * Usage: const { base64, width, height } = await getBlurDataURL(src)
 */
export async function getBlurDataURL(src: string): Promise<{ base64: string; width: number; height: number }> {
  let buffer: Buffer;
  
  if (src.startsWith("http") || src.startsWith("/")) {
    // Fetch remote or local file
    const res = await fetch(src.startsWith("http") ? src : `http://localhost:3000${src}`);
    if (!res.ok) throw new Error(`Failed to fetch image: ${src}`);
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    // Assume it's already a buffer or base64
    buffer = Buffer.from(src, "base64");
  }
  
  const result = await getPlaiceholder(buffer, { size: 10 });
  
  return {
    base64: result.base64,
    width: result.metadata.width || 0,
    height: result.metadata.height || 0,
  };
}

/**
 * Pre-generate blur placeholders for known static images
 * Call this at build time
 */
export async function getStaticBlurDataURLs(paths: string[]) {
  const results: Record<string, { base64: string; width: number; height: number }> = {};
  for (const path of paths) {
    try {
      results[path] = await getBlurDataURL(path);
    } catch (error) {
      console.warn(`Failed to generate blur placeholder for ${path}:`, error);
    }
  }
  return results;
}
