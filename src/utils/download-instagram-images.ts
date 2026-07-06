import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { InstagramGeneratedImage } from '../types/instagram-publishing-package.js';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

export async function downloadInstagramCarouselImages(input: {
  images: InstagramGeneratedImage[];
  date: string;
}): Promise<InstagramGeneratedImage[]> {
  const assetsDir = path.join(
    packageRoot,
    'generated',
    'daily',
    'assets',
    input.date,
  );
  await mkdir(assetsDir, { recursive: true });

  return Promise.all(
    input.images.map(async (image) => {
      if (!image.imageUrl) {
        return image;
      }

      const filename = path.basename(image.imagePath);
      const localPath = path.join(assetsDir, filename);
      const response = await fetch(image.imageUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to download Instagram slide ${image.slide} (${response.status})`,
        );
      }

      await writeFile(localPath, Buffer.from(await response.arrayBuffer()));

      return {
        ...image,
        imageLocalPath: `./assets/${input.date}/${filename}`,
      };
    }),
  );
}
