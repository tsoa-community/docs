---
sidebarDepth: 1
---

# Upgrading from tsoa 2.5

[Jump to the breaking changes](#breaking-changes)

## New Features

### Support for type aliases

This release comes with proper support for type alias definitions.

They can range from simple scenarios

```ts
/**
 * A Word shall be a non-empty sting
 * @minLength 1
 */
type Word = string;
```

to more complex scenarios like unions and intersections of aliases

```ts
type IntersectionAlias = { value1: string; value2: string } & TypeAliasModel1;

// or
type OneOrTwo = TypeAliasModel1 | TypeAliasModel2;
```

or even generic type aliases:

```ts
type GenericAlias<T> = T | string;
type ForwardGenericAlias<T, U> = GenericAlias<U> | T;
```

Please note that this means that tsoa does not only generate the specification (OpenAPI v3 and Swagger2\*), but will also validate the input against the types including the jsDoc annotations.

\* There may be certain scenarios where we may not be able to generate Swagger 2 from your TypeScript, tsoa will log warnings to infor you about any issues we are aware of.

### Support for mapped types

> TypeScript 2.1 introduced mapped types, a powerful addition to the type system. In essence, mapped types allow you to create new types from existing ones by mapping over property types. Each property of the existing type is transformed according to a rule that you specify. The transformed properties then make up the new type.
> \- Marius Schulz, https://mariusschulz.com/blog/mapped-types-in-typescript

tsoa now works with the ts type checker to resolve mapped types. We will actively try to support all cases, however the test suite for now only covers the utility mapped types typescript ships with, like:

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### Support for conditional types

As of version 2.8, TypeScript supports conditional types. The syntax is very close to the ternary operator and enables expression of 2 (or more) different types based on a condition. Please refer to the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types) for details.

```ts
type Diff<T, U> = T extends U ? never : T; // Remove types from T that are assignable to U
```

tsoa now works with the ts type checker to resolve conditional types. We will actively try to support most cases, however the test suite for now only covers the utility types typescript ships with, like:

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Support for combinations and utility types

The combination of mapped and conditional types allow for powerful utility types like the `Omit` type.

```
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Support for `Record<>` [\#662](https://github.com/lukeautry/tsoa/pull/662) ([Eywek](https://github.com/Eywek))`

### Enums: See [\#594](https://github.com/lukeautry/tsoa/pull/594) for the Spec and [\#599](https://github.com/lukeautry/tsoa/pull/599) and [\#593](https://github.com/lukeautry/tsoa/pull/593)

### Null Keyword: See [\#601](https://github.com/lukeautry/tsoa/pull/601)

### Ability to use a colon delimiter instead of bracelets in path [\#602](https://github.com/lukeautry/tsoa/pull/602)([itamarco](https://github.com/itamarco))

### added @example support for parameters / properties [\#616](https://github.com/lukeautry/tsoa/pull/616) ([jfrconley](https://github.com/jfrconley))

### feat: ignore class methods [\#643](https://github.com/lukeautry/tsoa/pull/643) ([Eywek](https://github.com/Eywek))

### feat: handle enum members [\#656](https://github.com/lukeautry/tsoa/pull/656) ([Eywek](https://github.com/Eywek))

### Handle indexed types [\#636](https://github.com/lukeautry/tsoa/pull/636) ([Eywek](https://github.com/Eywek))

### handle `typeof` [\#635](https://github.com/lukeautry/tsoa/pull/635) ([Eywek](https://github.com/Eywek))

### `@format` support for type aliases [\#620](https://github.com/lukeautry/tsoa/pull/620) ([jfrconley](https://github.com/jfrconley))

## Bug Fixes

- correctly propagate field name in validateModel [@fantapop](https://github.com/fantapop)

- Aliased void Api Response types document 200 response instead of 204 [\#629](https://github.com/lukeautry/tsoa/pull/629) ([WoH](https://github.com/WoH))

- ValidateError should extend Error [\#661](https://github.com/lukeautry/tsoa/pull/661) ([aldenquimby](https://github.com/aldenquimby))

- Upgrade koa-router to @koa/router, fix type errors [\#646](https://github.com/lukeautry/tsoa/pull/646) ([michaelbeaumont](https://github.com/michaelbeaumont))
- Remove object type [\#642](https://github.com/lukeautry/tsoa/pull/642) ([dimitor115](https://github.com/dimitor115))
- Fix adding static properties to model definition [\#639](https://github.com/lukeautry/tsoa/pull/639) ([dimitor115](https://github.com/dimitor115))

## Breaking changes

### Null vs. undefined

Unless you declare a type to accept `null`, we will no longer mark your optional properties as `nullable: true` or `x-nullable: true`.
This applies to validation aswell, so while sending `null` instead of sending `undefined` / no properties on an object was fine, now it's not any more.
Sending `undefined` instead of, i.e. `string | null` is also rejected by the validation.

### Naming

In order to support type aliases and avoid name clashes, the names for the generated component schemas / definitions may have changed (generic interfaces are affected mostly).
If you rely on the component names generated from tsoa, this is a breaking change.

Because tsoa supported some type aliases in the past and now generated definitions differently, this may break your code.
If you relied on tsoa not supporting type aliases properly to avoid issues, this may break your code.
Proceed with caution and report issues.

### Improve nested object validation

See [\#574](https://github.com/lukeautry/tsoa/pull/574) and [\#575](https://github.com/lukeautry/tsoa/pull/575).
These SHOULD not be breaking changes, but since it affects validation, better safe than sorry.

### Change default behavior when no host is defined:

Explicitly set your host in case you want to have absolute urls. This is a breaking change for those who were using OpenAPI 3, but it actually brings tsoa into parity with how we were handling the `host` property in Swagger 2. Previously OpenAPI 3 users had to result to passing `null` which we all felt was strange. Now omitting `host` will cause tsoa to assume the url should be relative.

### Remove .. in fieldErrors

When detecting illegal additional properties (if you are using tsoa setting `additionalProperties: 'throw-on-extras'`), the key on the error would contain an additional dot.

```js
{
  "TestModel..additionalProp: : {
    ...
  }
}
```

This is now fixed and the key is `TestModel.additionalProp`.

### Use Spec instead of Swagger (`tsoa swagger` is still available for now, but will be removed eventually) [\#664](https://github.com/lukeautry/tsoa/pull/664) ([WoH](https://github.com/WoH))

```diff
Calling the tsoa command
- tsoa swagger
+ tsoa spec

- tsoa swagger-and-routes
+ tsoa spec-and-routes

Manually calling spec generation
- await generateSwaggerSpec(swaggerConfig, routesConfig, compilerOptions, config.ignore);
+ await generateSpec(openapiConfig, compilerOptions, config.ignore);
```

tsoa.json:

```js
{
  "swagger": {}
}
```

becomes

```js
{
  "spec": {}
}
```

- Move shared config to top level [\#628](https://github.com/lukeautry/tsoa/pull/628) ([WoH](https://github.com/WoH))

Instead of duplicating config and handling a lot of edge cases, the new config is a lot simpler.
Config settings, that impact both routes and spec are now located at the top level of the config object.

```json
{
  "entryFile": "./tests/fixtures/express/server.ts",
  "noImplicitAdditionalProperties": "silently-remove-extras",
  "routes": {},
  "spec": {}
}
```

This means if your settings are different (for example the entry file), you'll have to call the `generateRoutes()` and `generateSpec()` yourself.
Note that these methods now have a simpler config aswell:

```diff
-    await generateSwaggerSpec(swaggerConfig, routesConfig, compilerOptions, config.ignore);
+    await generateSpec(openapiConfig, compilerOptions, config.ignore);
```

```diff
-    await generateRoutes(routesConfig, swaggerConfig, compilerOptions, config.ignore);
+    await generateRoutes(routesConfig, compilerOptions, config.ignore);
```

EntryFile and noImplicitAdditionalProperties can now be set on the swagger/routesConfig.

Also, boolean settings for noImplicitAdditionalProperties have been removed: #503
Valid settings are now: `'throw-on-extras' | 'silently-remove-extras' | 'ignore'`, everything else falls back to `'ignore'`.

**For reference, see the TS interface of the entire config [here](https://tsoa-community.github.io/reference/interfaces/_index_.config.html)**

### TypeScript Unions are now implemented as `anyOf` in OpenAPI [\#671](https://github.com/lukeautry/tsoa/issues/671)
