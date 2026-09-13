import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

/**
 * List the photo files inside `public/pictures/<album>/`.
 * Runs at build time (and in dev on every request), so photos dropped
 * into the folder are picked up without any code changes.
 */
export function listAlbumPhotos(album: string): string[] {
  const dir = join(process.cwd(), 'public', 'pictures', album);
  try {
    return readdirSync(dir)
      .filter((file) => IMAGE_EXTENSIONS.has(extname(file).toLowerCase()))
      .sort();
  } catch {
    return [];
  }
}

/** Public URL for a photo inside an album folder. */
export function photoUrl(album: string, fileName: string): string {
  return `/pictures/${album}/${encodeURIComponent(fileName)}`;
}

/** All public URLs of an album, sorted. */
export function listAlbumPhotoUrls(album: string): string[] {
  return listAlbumPhotos(album).map((name) => photoUrl(album, name));
}

/** Cover image URL (explicit cover or first photo). */
export function coverPhotoUrl(album: string, cover?: string): string | undefined {
  if (cover) return photoUrl(album, cover);
  const photos = listAlbumPhotos(album);
  return photos.length > 0 ? photoUrl(album, photos[0]) : undefined;
}
