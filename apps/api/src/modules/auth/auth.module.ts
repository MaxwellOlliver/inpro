import { Module } from '@nestjs/common';
import { SessionCreatedHandler } from '@modules/auth/application/events/session/session-created.handler';
import { HashModule } from '@shared/infra/security/hash/hash.module';
import { ListUserSessionsHandler } from './application/queries/session/list-user-sessions.handler';
import { RevokeSessionHandler } from '@modules/auth/application/commands/session/handlers/revoke-session.handler';
import { SessionRevokedHandler } from '@modules/auth/application/events/session/session-revoked.handler';
import { CreateSessionHandler } from '@modules/auth/application/commands/session/handlers/create-session.handler';
import { AccountModule } from '@modules/account/account.module';
import { SignInHandler } from '@modules/auth/application/commands/auth/handlers/sign-in.handler';
import { SignInController } from './presentation/controllers/auth/sign-in.controller';
import { ValidateUserCredentialsService } from './application/services/auth/validate-user-credentials.service';
import { GenerateTokensService } from './application/services/auth/generate-tokens.service';
import { GetRefreshTokenSessionService } from './application/services/auth/get-refresh-token-session.service';
import { RetrieveSessionByTokenService } from './application/services/session/retrieve-session-by-token.service';
import { RefreshTokenHandler } from '@modules/auth/application/commands/auth/handlers/refresh-token.handler';
import { ValidateSessionHandler } from '@modules/auth/application/commands/auth/handlers/validate-session.handler';
import { EnvModule } from '@config/env/env.module';
import { JwtModule } from '@shared/infra/security/jwt/jwt.module';
import { SignOutHandler } from '@modules/auth/application/commands/auth/handlers/sign-out.handler';
import { UpdateSessionRefreshTokenService } from './application/services/auth/update-session-refresh-token.service';
import { EncryptModule } from '@shared/infra/security/encrypt/encrypt.module';
import { listUserSessionsProvider } from './infra/nest/providers/list-user-sessions.service.provider';
import { SessionRepositoryProvider } from './infra/nest/providers/session.repository.provider';
import { sessionSchema } from './infra/db/schemas/session.schema';
import { RefreshTokenController } from './presentation/controllers/auth/refresh-token.controller';
import { SignOutController } from './presentation/controllers/auth/sign-out.controller';
import { RetrieveUserSessionsController } from './presentation/controllers/sessions/retrieve-user-sessions.controller';
import { RevokeSessionController } from './presentation/controllers/sessions/revoke-session.controller';
import { MongooseModule } from '@shared/infra/db/mongoose/mongoose.module';

@Module({
  imports: [
    HashModule,
    EncryptModule,
    AccountModule,
    JwtModule,
    EnvModule,
    MongooseModule.register({
      name: 'Session',
      schema: sessionSchema,
    }),
  ],
  controllers: [
    RetrieveUserSessionsController,
    RevokeSessionController,
    SignInController,
    RefreshTokenController,
    SignOutController,
  ],
  providers: [
    listUserSessionsProvider,
    SessionRepositoryProvider,
    // Services
    ValidateUserCredentialsService,
    GenerateTokensService,
    GetRefreshTokenSessionService,
    RetrieveSessionByTokenService,
    UpdateSessionRefreshTokenService,

    // CQRS: Commands & Queries & Events Handlers
    CreateSessionHandler,
    SessionCreatedHandler,
    ListUserSessionsHandler,
    RevokeSessionHandler,
    SessionRevokedHandler,
    SignInHandler,
    RefreshTokenHandler,
    ValidateSessionHandler,
    SignOutHandler,
  ],
  exports: [ValidateSessionHandler],
})
export class AuthModule {}
