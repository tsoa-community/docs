---
title: Upgrading to tsoa 7
lang: en-US
---

# Upgrading to tsoa 7

This guide compares tsoa 7 with tsoa 6.6.0, the last 6.x release on npm.

**What we will talk about:**

[[toc]]

## Checklist

1. [Install the packages for your framework](#install-your-framework-packages-yourself).
2. Replace imports of `ExpressTemplateService`, `HapiTemplateService` or `KoaTemplateService` [with their subpaths](#import-template-services-from-a-subpath).
3. Remove `multerOpts` from `tsoa.json` and [pass a multer instance](#multeropts-is-removed).
4. Rename `@Query` to `@QueryParam` and `@Queries` to `@QueryParams` [in your controllers](#query-and-queries-are-renamed).
5. If your `tsoa.json` has no `spec.specVersion`, [set it to `2`](#spec-version) to keep Swagger 2.0 output, or move to the new default, OpenAPI 3.1.
6. Regenerate your routes and your spec, then compare the spec with the old one. Most changes come from [the tsconfig.json tsoa now reads](#tsoa-reads-your-tsconfig-json).
7. Read [Validation](#validation) and [Responses](#express-responses) if clients depend on exact error messages or response bodies.

## Requirements

- TypeScript 5.7 or later, or TypeScript 6.
- Express 4 or 5, Koa with `@types/koa` 2 or 3, or Hapi 21.
- The test suite runs on Node.js 22, 24 and 26.

## Packages and imports

### Install your framework packages yourself

`@tsoa/runtime` used to depend on Express, Hapi, `@hapi/boom` and `@types/koa`, so every project installed all three frameworks. They are now optional peer dependencies. Install the ones for your framework:

| Framework | Packages                             |
| --------- | ------------------------------------ |
| Express   | `express`, `@types/express` (4 or 5) |
| Koa       | `koa`, `@types/koa` (2 or 3)         |
| Hapi      | `@hapi/hapi`, `@hapi/boom`           |

Hapi projects must list `@hapi/boom` in their own `package.json`, because the generated routes import it.

`@tsoa/runtime` and `@tsoa/cli` no longer depend on `@types/multer`. If your code uses `Express.Multer.File`, install it yourself:

```shell
yarn add -D @types/multer
```

With TypeScript 6, or with `types` set in your `tsconfig.json`, also list `multer` there, because TypeScript only loads the global `Express.Multer` types from packages it includes.

See [Framework packages](./frameworks.md).

### Import template services from a subpath

`@tsoa/runtime` and `tsoa` no longer export `ExpressTemplateService`, `HapiTemplateService` or `KoaTemplateService`. Custom route templates and classes that extend a template service import them from the framework's subpath:

```diff
- import { ExpressTemplateService } from '@tsoa/runtime';
+ import { ExpressTemplateService } from '@tsoa/runtime/express';
```

The same applies to `@tsoa/runtime/hapi` and `@tsoa/runtime/koa`. The generated routes import from the new subpaths, so regenerate them.

`@tsoa/runtime` now has an `exports` map. Deep imports work only under `@tsoa/runtime/dist/...`.

### Code that uses tsoa's internals

These changes affect only code that extends tsoa or imports its internal files:

- `@tsoa/cli` no longer has `metadataGeneration/typeResolver` or `metadataGeneration/transformer/*`. Use `MetadataGenerator.resolveType` and `MetadataGenerator.resolveTypeNode`.
- The `Swagger` namespace changed. `Swagger.Schema` and `Swagger.Parameter` are removed; use `Swagger.Schema2`, `Swagger.Schema3`, `Swagger.Schema31`, `Swagger.Parameter2` or `Swagger.Parameter3`. `Swagger.Spec3` is now `Spec30 | Spec31`. `Swagger.Header3` no longer has `type` and `format`; set them on its `schema`. `discriminator` is a string in `Schema2` and an object in `Schema3`.
- `Tsoa.Type` has a new member, `Tsoa.TupleType`. A `switch` that checks every `dataType` needs a `'tuple'` case.
- `ValidationService.validateBuffer` now takes `(name, value, fieldErrors, parent)` and reports a field error instead of throwing.
- The generated route templates changed. If you keep a copy as `routes.middlewareTemplate`, start again from the new template.

## Decorators

### `@Query` and `@Queries` are renamed

The parameter decorators `@Query` and `@Queries` are now `@QueryParam` and `@QueryParams`. `@Query` is now a method decorator for the HTTP `QUERY` method (RFC 10008), next to `@Get` and `@Post`.

```diff
- import { Get, Query, Route } from 'tsoa';
+ import { Get, QueryParam, Route } from 'tsoa';

  @Get()
- public async list(@Query() page?: number) {}
+ public async list(@QueryParam() page?: number) {}
```

tsoa keeps no alias for the old names, so TypeScript reports each place you missed. The generated spec and routes do not change.

## Configuration

### `multerOpts` is removed

`multerOpts` was deprecated in 6.4.0. Remove it from `tsoa.json` and pass a multer instance to the generated routes:

```diff
  // tsoa.json
  "routes": {
-   "multerOpts": { "dest": "/tmp" }
  }
```

```ts
import multer from "multer";

RegisterRoutes(app, { multer: multer({ dest: "/tmp" }) });
```

tsoa 7 ignores `multerOpts` without a warning. Without an instance, the routes use a default one limited to 8 MB per file.

### tsoa reads your tsconfig.json

tsoa 6 compiled your controllers with only the `compilerOptions` from `tsoa.json`. tsoa 7 reads the nearest `tsconfig.json`, searching up from the directory you run tsoa in, and applies `tsoa.json`'s `compilerOptions` on top. `paths`, `moduleResolution`, `customConditions` and the strict flags now take effect.

This can change your spec:

- With `strict` or `strictNullChecks` on, tsoa keeps `null` and `undefined` that tsoa 6 dropped inside mapped types. For example, a `string | null` property of `Partial<T>` is now `nullable`.
- An invalid `tsconfig.json` now stops generation with TypeScript's error.

To keep tsoa 6's output, set `"compilerOptions": { "strictNullChecks": false }` in `tsoa.json`.

### TypeScript 6 defaults

On TypeScript 6:

- `types` defaults to none instead of every package under `node_modules/@types`. If a model uses a global type that nothing imports, list its package in `compilerOptions.types`.
- A model that extends `Error` gains an optional `cause` property from TypeScript 6's default lib.

### Spec version

Without `spec.specVersion`, tsoa now generates OpenAPI 3.1 instead of Swagger 2.0, both from the `tsoa` CLI and from `generateSpec()`. To keep Swagger 2.0, set it:

```json
"spec": {
  "specVersion": 2
}
```

## Spec generation

### Type resolution uses the TypeScript checker

tsoa now takes each type from the TypeScript checker instead of rebuilding it from the source text. Specs for written types such as interfaces, aliases, generics, `Pick`, `Omit`, `Partial`, `Record` and enums do not change. These do:

- **Component names of type arguments tsoa could not name.** Template literal types, tuples and other types tsoa 6 named `any` now get their own names. `Box<[string, number]>` becomes `Box__string.number__`. This changes those `$ref`s and the names in clients generated from your spec.
- **Objects from TypeScript's own libraries.** A class or interface declared only in TypeScript's libraries must have a supported mapping or a `toJSON` method. `Set`, `Map`, `RegExp`, typed arrays, `WeakRef`, `PropertyDescriptor` and error subtypes such as `TypeError` fail generation. tsoa 6 failed on most of them as well, with a less useful message. `Date`, `Buffer`, `Error`, and models with `toJSON` such as `URL` still work.
- **Inferred object types.** For a type tsoa infers from a value, such as a method without a return type that returns `{ count: 1 }`, or `typeof someConstant`, tsoa 7 marks each property as optional with the value as its `default`. tsoa 6 marked them as required. Write the return type to keep them required.
- **Error messages** for a return type end with `in 'Controller.method' return type`.

Several types now generate where tsoa 6 failed: tuples (OpenAPI 3.1 only), template literal types such as `` `user_${string}` ``, `typeof value`, indexed access such as `Params[Kind.A]`, `Uppercase<'a' | 'b'>`, `DeepPartial<T>`-style recursive mapped types, and models that reference each other while inheriting.

### Discriminated unions

In OpenAPI 3 and 3.1, a union of models that share one required string-literal property now generates `oneOf` with a `discriminator` instead of `anyOf`:

```ts
interface Cat {
  kind: "cat";
  meows: boolean;
}
interface Dog {
  kind: "dog";
  barks: boolean;
}
type Pet = Cat | Dog;
```

Validation uses the tag to choose the member. See [Validation](#validation).

### `@pattern`

- An invalid regular expression in `@pattern` now stops generation. tsoa 6 wrote it to the spec as it was.
- A pattern wrapped in single backticks may contain spaces: `` @pattern `^[a-z ]+$` Letters and spaces ``. tsoa 6 cut it at the first space.

### Other spec changes

- `@FormField()` takes its parameter's type. `@FormField() n: number` is now a number in the spec and in validation. tsoa 6 always used a string.
- `@Body() body: Readable` gets the raw request stream. Its spec is `application/octet-stream` with `format: binary`. tsoa 6 treated it as a JSON `byte` string.
- `@example 0`, `@example false` and `@example ""` now appear in the spec.
- `@deprecated` and `@example` on a type alias now appear in its schema.
- `@title` sets a schema's `title`.

## Validation

Requests that tsoa 6 accepted may now fail:

- **Discriminated unions** validate only the member the tag selects. An error names the failing field, such as `body.barks`, instead of a summary of every member. A missing or unknown tag gives one error on the tag property.
- **Enums** never match an array or an object: `["admin"]` no longer matches `"admin"`. In a body, the string `"1"` matches the number `1`, or `"true"` matches `true`, only when `bodyCoercion` is on.
- **Self-referencing models** are checked at every depth.
- **`minItems` and `maxItems`** of 0 are enforced.
- **`Buffer`** accepts a string, a buffer, an array of bytes or the JSON form `{ "type": "Buffer", "data": [...] }`. Any other value is a field error. tsoa 6 passed it to `Buffer.from`, which could allocate a buffer of any size from `{ "length": n }` or throw a 500.
- **`T | null`** keeps `null`. tsoa 6 turned `null` into `false` for `boolean | null`.

Error responses change too:

- Field errors for `@Body()` and `@BodyProp()` no longer include the rejected `value`, only the `message`.
- Errors for unions and intersections are summarized and cut to 1000 characters, and the value they echo is cut to the same length.
- The keys of errors inside arrays carry the full path, such as `body.children.$0.children.$0.name`. tsoa 6 dropped the part above the array.

## Express responses

| Controller returns                        | tsoa 6                                | tsoa 7                                             |
| ----------------------------------------- | ------------------------------------- | -------------------------------------------------- |
| a `Buffer` or `Uint8Array`                | JSON `{"type":"Buffer","data":[...]}` | the bytes, as `application/octet-stream`           |
| a string, with `Content-Type: text/plain` | the string as JSON, in quotes         | the string as it is                                |
| a stream that fails before sending data   | the Node process stops                | the error goes to `next()` and your error handler  |

Strings without a `Content-Type`, numbers, objects and `null` are sent as before.

An optional `@Body()` is `undefined` when the request has no body. tsoa 6 passed the `{}` that body-parser leaves. A required `@Body()` still gets `{}`.

If you move to Express 5 as well, read the [Express 5 notes](./frameworks.md#express-5).

## Security

An empty entry in a route's security list now allows anonymous access (see [Optional authentication](#optional-authentication)). So that no route opens by mistake, generation fails for two `@Security` decorators that tsoa 6 accepted:

- `@Security({ api_key: makeScopes() })`, or any object whose scopes come from a function call. tsoa 6 generated an empty entry for it, `security: [{}]`.
- `@Security('__proto__')`.

Other forms generate as before, including names and scopes held in constants.

## New features

### OpenAPI 3.1

Set `"specVersion": 3.1`. OpenAPI 3.1 describes tuples with `prefixItems`.

### Optional authentication

`@Security({})` next to a scheme makes authentication optional:

```ts
@Security("bearerAuth")
@Security({})
@Get()
public async list(@Request() request: express.Request) {}
```

A request without credentials continues with `request.user` undefined, provided your authentication function rejects with `MissingCredentialsError` (exported from `tsoa`) when the credentials are absent. Any other rejection, such as an invalid token, still refuses the request, with 401 by default.

### Raw binary request bodies

A `@Body()` parameter typed as `Readable` from `stream` receives the request stream, without parsing or validation. Write the type as `Readable`; `stream.Readable`, aliases and unions are not recognized. Express and Koa reject the request if a body parser has already read the stream.

### Other additions

- `@Queries()` accepts type aliases and nested object types.
- `spec.disableBasePathPrefixSlash` drops the `/` between the server URL and `basePath` (OpenAPI 3 and later).
- `425 Too Early` is a known status code.
- Spread syntax works in values tsoa reads, such as `@Example({ ...base, id: 1 })`.
- An empty `@returns` tag no longer stops generation.
- The generated routes build their per-route data once instead of on every request.
