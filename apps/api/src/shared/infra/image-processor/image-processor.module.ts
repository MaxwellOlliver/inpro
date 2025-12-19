import { Module } from '@nestjs/common';
import { ImageProcessorGateway } from '@shared/application/gateways/image-processor.gateway';
import { SharpImageProcessorService } from './sharp/services/sharp-image-processor.service';

@Module({
  providers: [
    {
      provide: ImageProcessorGateway,
      useClass: SharpImageProcessorService,
    },
  ],
  exports: [ImageProcessorGateway],
})
export class ImageProcessorModule {}
