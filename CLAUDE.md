# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InPro is a monorepo using Turborepo with pnpm. It consists of a NestJS API backend, an Expo React Native mobile app, and shared packages.

## Commands

### Root-level commands (from repo root)

```bash
pnpm install          # Install dependencies
turbo build           # Build all packages
turbo dev             # Run all apps in development
turbo lint            # Lint all packages
turbo build --filter=api  # Build specific package
```

### API (`apps/api`)

```bash
pnpm run start:dev    # Development server with watch
pnpm run build        # Build for production
pnpm run test         # Run unit tests (uses .env.test)
pnpm run test:watch   # Run tests in watch mode
pnpm run test:e2e     # Run E2E tests
pnpm run db:test:reset  # Reset test database
```

### Core package (`packages/core`)

```bash
pnpm run test         # Run tests
pnpm run build        # Build (TypeScript compilation)
```

### Mobile (`apps/mobile`)

```bash
pnpm run start        # Start Expo
pnpm run android      # Run on Android
pnpm run ios          # Run on iOS
```

## Architecture

### API (`apps/api`)

The API follows **Domain-Driven Design** with a **Hexagonal Architecture** (Ports & Adapters) pattern.

**Module Structure:**

```
modules/{module-name}/
├── application/       # Use cases, commands, queries, events
│   ├── commands/      # CQRS command handlers
│   ├── queries/       # CQRS query handlers
│   ├── events/        # Domain event handlers
│   ├── ports/in/      # Input port interfaces (DTOs)
│   └── services/      # Application services
├── domain/            # Pure domain logic
│   ├── aggregates/    # Aggregate roots
│   ├── entities/      # Domain entities
│   ├── value-objects/ # Value objects
│   ├── events/        # Domain events
│   └── interfaces/    # Repository interfaces
├── infra/             # External adapters
│   ├── db/            # Database schemas/models
│   ├── mappers/       # Domain <-> Persistence mapping
│   ├── factories/     # Domain object factories
│   └── nest/providers/ # NestJS DI providers
└── presentation/      # HTTP layer
    ├── controllers/   # REST controllers
    ├── dtos/          # Request/Response DTOs
    ├── schemas/       # Zod validation schemas
    ├── presenters/    # Domain -> ViewModel mapping
    └── view-model/    # API response models
```

**Key Patterns:**

- **CQRS with NestJS** (`@nestjs/cqrs`): Commands extend `Command<T>`, handlers use `@CommandHandler()`
- **Result type**: Use `Result<T, E>`, `Ok()`, `Err()` from `@inpro/core` instead of throwing exceptions
- **Domain Events**: Aggregates emit events via `.apply(new Event())`, handled by event handlers
- **Validation**: Zod schemas in `presentation/schemas/`, DTOs use `@anatine/zod-nestjs`
- **Repository pattern**: Interfaces in `domain/interfaces/`, implementations in `infra/`

### Core Package (`packages/core`)

Provides DDD building blocks:

- `Aggregate<T>`: Base class extending NestJS CQRS AggregateRoot
- `Entity<T>`: Base class for domain entities with identity
- `ValueObject<T>`: Base class for immutable value objects
- `ID`: UUID-based identity value object
- `Result<T, E>`, `Ok()`, `Err()`, `Combine()`: Functional error handling

### Databases

- **PostgreSQL** via Prisma: User accounts, profiles, posts, media
- **MongoDB** via Mongoose: Sessions (used with custom `MongooseModule.register()`)
- **Redis**: BullMQ job queues, caching

### Path Aliases (API)

```
@modules/*  -> src/modules/*
@shared/*   -> src/shared/*
@config/*   -> src/config/*
@test/*     -> test/*
```

## Testing

Tests use Jest with `jest-mock-extended` for mocking. Test files mirror source structure under `test/`.

**Run single test file:**

```bash
cd apps/api
pnpm run test -- path/to/file.spec.ts
```

**Test naming:** `*.spec.ts` for unit tests, `*.e2e-spec.ts` for E2E tests.

## Key Files

- `apps/api/prisma/schema.prisma` - PostgreSQL models
- `apps/api/src/app.module.ts` - Root module, global guards
- `apps/api/src/main.ts` - Bootstrap, Swagger setup, global pipes/filters
- `packages/core/src/` - Domain building blocks

## Documentation

- `docs/` - Markdown documentation for API, domain, infrastructure and AI instructions.
