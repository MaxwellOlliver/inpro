import { Provider } from '@nestjs/common';
import { S3_CLIENT } from '../tokens/s3.tokens';
import { S3Client } from '@aws-sdk/client-s3';
import { EnvService } from '@config/env/env.service';
import { NodeHttpHandler } from '@smithy/node-http-handler';

export const S3ClientProvider: Provider = {
  provide: S3_CLIENT,
  useFactory: (env: EnvService) => {
    return new S3Client({
      region: env.get('S3_REGION'),
      endpoint: env.get('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: env.get('S3_SECRET_ACCESS_KEY'),
      },
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 5000,
        requestTimeout: 30000,
        socketTimeout: 30000,
        throwOnRequestTimeout: true,
      }),
    });
  },
  inject: [EnvService],
};
