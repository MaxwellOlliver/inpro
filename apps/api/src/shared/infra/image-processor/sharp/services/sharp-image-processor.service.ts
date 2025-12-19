import { Err, Ok, Result } from '@inpro/core';
import { Injectable } from '@nestjs/common';
import {
  ImageProcessorGateway,
  ResizeImageOptions,
} from '@shared/application/gateways/image-processor.gateway';
import sharp from 'sharp';

@Injectable()
export class SharpImageProcessorService implements ImageProcessorGateway {
  constructor() {}

  async resize(
    file: Buffer,
    width: number,
    height: number,
    options?: ResizeImageOptions,
  ): Promise<Result<Buffer, Error>> {
    const { fit, format, quality } = options ?? {
      fit: 'cover',
      format: 'webp',
      quality: 82,
    };

    const out = await Result.fromPromise(
      sharp(file)
        .resize(width, height, { fit })
        .toFormat(format, { quality })
        .toBuffer(),
    );

    if (out.isErr()) {
      return Err(out.getErr()!);
    }

    return Ok(out.unwrap());
  }
}
