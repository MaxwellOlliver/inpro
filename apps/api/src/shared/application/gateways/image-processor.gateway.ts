import { Result } from '@inpro/core';

export interface ResizeImageOptions {
  fit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  format: 'webp' | 'jpeg' | 'png';
  quality?: number;
}
export abstract class ImageProcessorGateway {
  abstract resize(
    file: Buffer,
    width?: number,
    height?: number,
    options?: ResizeImageOptions,
  ): Promise<Result<Buffer, Error>>;
}
