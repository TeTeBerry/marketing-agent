import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { InstagramGeneratedImage } from '../types/instagram-publishing-package.js';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

export function resolveLocalInstagramImagePath(imagePath: string): string {
  return path.join(packageRoot, imagePath);
}

export async function saveInstagramImagesLocally(
  images: InstagramGeneratedImage[],
): Promise<string[]> {
  const savedPaths: string[] = [];

  for (const image of images) {
    if (!image.downloadUrl) {
      throw new Error(
        `Missing downloadUrl for slide ${image.slide} (${image.imagePath})`,
      );
    }

    const localPath = resolveLocalInstagramImagePath(image.imagePath);
    await mkdir(path.dirname(localPath), { recursive: true });

    const response = await fetch(image.downloadUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download slide ${image.slide} (${response.status} ${response.statusText})`,
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) {
      throw new Error(`Downloaded empty image for slide ${image.slide}`);
    }

    await writeFile(localPath, buffer);
    savedPaths.push(localPath);
  }

  return savedPaths;
}
