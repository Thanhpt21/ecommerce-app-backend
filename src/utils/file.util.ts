// src/utils/file.util.ts

export function extractPublicId(url: string | null): string | null {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const folder = parts[parts.length - 2]; // user/product/news
    const filename = parts[parts.length - 1].split('.')[0]; // publicId
    return `${folder}/${filename}`;
  } catch (err) {
    return null;
  }
}


