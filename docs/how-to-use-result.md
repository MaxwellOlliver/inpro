# Result Utility (TypeScript)

This project provides a lightweight `Result<T, E>` utility to represent the outcome of operations that can **succeed** (`Ok`) or **fail** (`Err`) without relying on `try/catch` in your calling code.

It’s inspired by functional patterns (Rust-like Result) and is especially useful for:

- validating inputs
- mapping external API responses
- handling async flows (`Promise`) with explicit error paths
- composing multiple operations safely

---

## Quick mental model

A `Result<T, E>` is **either**:

- ✅ **Ok(T)** → operation succeeded, carries a value of type `T`
- ❌ **Err(E)** → operation failed, carries an `Error` (or subclass) of type `E`

Instead of throwing, functions return `Result`, and the caller decides what to do.

---

## Import

This utility **must always be imported from `@inpro/core`**.

```ts
import { Result, Ok, Err, Combine, Some } from '@inpro/core';
```

Do **not** reimplement or copy this utility locally.

---

## Exports

- `class Result<T, E extends Error>`
- `Ok<T>(value?)`
- `Err<E extends Error>(error)`
- `Combine(results)`
- `Some(results)`

---

## Creating Results

### `Ok(value?)`

Use when an operation succeeds.

```ts
import { Ok } from './result';

const r = Ok(42); // Result<number, never>
```

### `Err(error)`

Use when an operation fails.

```ts
import { Err } from './result';

const r = Err(new Error('Something went wrong')); // Result<never, Error>
```

### `Result.ok(value?)` and `Result.err(error?)`

Same idea, but as static methods.

```ts
const ok = Result.ok('hello');
const err = Result.err(new TypeError('Invalid type'));
```

---

## Reading a Result

### `isOk()` / `isErr()`

Use these to branch safely.

```ts
const r = doSomething();

if (r.isOk()) {
  // inside here, r is typed as Result<T, never>
  const value = r.unwrap();
} else {
  // inside here, r is typed as Result<never, E>
  const error = r.unwrapErr();
}
```

---

## Unwrapping (use with care)

### `unwrap() : T`

Returns the success value **or throws** the error if it is `Err`.

```ts
const value = r.unwrap(); // throws if Err
```

Use `unwrap()` when:

- you're at an application boundary (e.g., controller / handler)
- you deliberately want to fail fast
- tests

### `unwrapErr() : E`

Returns the error value **or throws** if it is `Ok`.

```ts
const error = r.unwrapErr(); // throws if Ok
```

### `expect(msgOrError) : T`

Returns the success value or throws with a **custom message** (or a provided error).

```ts
const user = r.expect('User not found');
```

---

## Getting the error without throwing

### `getErr() : E | null`

```ts
const error = r.getErr();
if (error) {
  console.error(error.message);
}
```

---

## Converting exceptions into Result

### `Result.catch(fn, error?)`

Runs a function that may throw. If it throws, you get an `Err`.

```ts
const r = Result.catch(() => JSON.parse(input), new Error('Invalid JSON'));

if (r.isErr()) {
  // r.unwrapErr() will be the provided error (or the thrown error if not provided)
}
```

---

## Working with Promises

### `Result.fromPromise(promise)`

Wraps any Promise and returns `Result<T, E>`.

```ts
const r = await Result.fromPromise(fetchUser());

if (r.isOk()) {
  console.log('User:', r.unwrap());
} else {
  console.error('Failed:', r.unwrapErr());
}
```

---

## Composition helpers

### `Combine(results)`

Combines an array/tuple of Results into a single Result:

- If **any** item is `Err`, returns the **first** `Err`.
- Otherwise returns `Ok([...values])`.

```ts
const r = Combine([validateEmail(email), validatePassword(password)] as const);

if (r.isOk()) {
  const [validEmail, validPassword] = r.unwrap();
}
```

### `Some(results)`

Returns the **first successful** `Ok` from an array.
If none succeed, returns `Err("No results were successful")`.

```ts
const r = Some([tryCache(), tryDatabase(), tryExternalApi()]);

if (r.isOk()) {
  return r.unwrap();
}

console.error(r.unwrapErr());
```

---

## Recommended usage patterns

### 1) Prefer returning Result from domain/service functions

```ts
function parseAge(input: string) {
  const n = Number(input);
  if (!Number.isFinite(n) || n < 0) return Err(new Error('Invalid age'));
  return Ok(n);
}
```

### 2) Avoid calling `unwrap()` too early

```ts
function createUser(dto: CreateUserDto): Result<User, Error> {
  const age = parseAge(dto.age);
  if (age.isErr()) return Err(age.unwrapErr());

  return Ok({ name: dto.name, age: age.unwrap() });
}
```

### 3) Boundary unwrap (controllers / handlers)

```ts
const result = service.createUser(dto);

if (result.isErr()) {
  return reply.status(400).send({ message: result.unwrapErr().message });
}

return reply.send(result.unwrap());
```

---

## Typing notes

- `Result<T, never>` means: success result, cannot be an error.
- `Result<never, E>` means: error result, cannot be a success.
- `E extends Error` ensures errors behave like real errors.

---

## Common pitfalls

- Don’t call `unwrap()` without checking `isOk()` unless you intentionally want to throw.
- `Some()` returns a generic error; customize it if you need richer diagnostics.
- `Result.fromPromise()` assumes rejected values behave like `Error`.

---

## Cheat sheet

```ts
Ok(value)
Err(error)

r.isOk() / r.isErr()

r.unwrap()
r.unwrapErr()
r.expect('msg')
r.getErr()

Result.catch(fn)
Result.fromPromise(p)

Combine([...])
Some([...])
```
