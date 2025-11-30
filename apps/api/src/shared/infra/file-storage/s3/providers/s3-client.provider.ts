import { Provider } from '@nestjs/common';
import { S3_CLIENT } from '../tokens/s3.tokens';
import { S3Client } from '@aws-sdk/client-s3';
import { EnvService } from '@config/env/env.service';

export const S3ClientProvider: Provider = {
  provide: S3_CLIENT,
  useFactory: (env: EnvService) => {
    return new S3Client({
      region: env.get('S3_REGION'),
      endpoint: env.get('S3_ENDPOINT'),
      forcePathStyle: true,
    });
  },
  inject: [EnvService],
};
