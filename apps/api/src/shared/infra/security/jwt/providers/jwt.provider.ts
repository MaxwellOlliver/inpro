import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EnvService } from '@config/env/env.service';
import { TokenService } from '../services/token.service';
import { TokenGateway } from '@shared/application/gateways/token.gateway';

export const JwtProvider = {
  provide: TokenGateway,
  useFactory: (envService: EnvService, jwtService: NestJwtService) => {
    return new TokenService(envService, jwtService);
  },
  inject: [EnvService, NestJwtService],
};
