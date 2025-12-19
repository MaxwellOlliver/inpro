import { Module } from '@nestjs/common';
import { SharpImageProcessorService } from './services/sharp-image-processor.service';

@Module({
  providers: [SharpImageProcessorService],
  exports: [SharpImageProcessorService],
})
export class SharpModule {}
