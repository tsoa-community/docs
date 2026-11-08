---
title: Framework packages
lang: en-US
---

# Framework packages

**What we will talk about:**

[[toc]]

## Install the packages for your framework

`@tsoa/runtime` does not install a web framework. Its framework packages are optional peer dependencies, so install the ones for the framework you use:

| Framework | Packages                             |
| --------- | ------------------------------------ |
| Express   | `express`, `@types/express` (4 or 5) |
| Koa       | `koa`, `@types/koa` (2 or 3)         |
| Hapi      | `@hapi/hapi`, `@hapi/boom`           |

Routes that accept file uploads also import `multer` (Express) or `@koa/multer` (Koa), so install that package as well. See [File upload](./file-upload.md).

### Hapi

The generated Hapi routes import `boomify` and `isBoom` from `@hapi/boom`. `@hapi/hapi` depends on it, but list it in your own `package.json` as well: with pnpm or another strict layout, the routes cannot resolve it otherwise.

## Express 5

tsoa supports Express 4 and 5. It does not change its runtime for Express 5 defaults. Set these two options to keep query and form parsing the same as on Express 4:

```ts
app.set("query parser", "extended"); // bracket syntax such as ?filter[a]=x and ?ids[]=1
app.use(express.urlencoded({ extended: true })); // nested form fields such as a[b]=1
```

- With `express.json()`, a request without a body leaves `req.body` `undefined` on Express 5, so a required `@Body()` fails validation. Express 4 and body-parser 1 leave `{}`, which passes if the body schema accepts an empty object.
- Express 5 reserves `()[]?+!` in route paths and requires a name for each `*` wildcard. A decorator path that breaks these rules fails at route registration. tsoa emits path parameters as `:name`. See the [Express 5 migration guide](https://expressjs.com/en/guide/migrating-5.html#path-route-matching-syntax).
- Express 5 forwards a rejected promise from an async custom `@Middlewares` function to the error handler. On Express 4, catch the error and call `next(err)`, or the unhandled rejection can stop the Node process.
