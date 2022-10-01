---
title: FAQ
lang: en-US
---

# FAQ

## Can I use OpenAPI 3 instead of OpenAPI 2 (formerly Swagger)?

Yes, set `spec.specVersion` to `3` in your `tsoa.json` file. See more config options by looking at [the config type definition](https://github.com/lukeautry/tsoa/blob/master/src/config.ts).

## How do I use tsoa with koa, hapi, or other frameworks?

Set the middleware property in your tsoa config. Out of the box, express, hapi and koa are supported.
You can also provide a custom template, for more information, please check out [the guide](./templates.md)

## How to ensure no additional properties come in at runtime

By default, OpenAPI allows for models to have [`additionalProperties`](https://swagger.io/docs/specification/data-models/dictionaries/). If you would like to ensure at runtime that the data has only the properties defined in your models, set the `noImplicitAdditionalProperties` [config](https://github.com/lukeautry/tsoa/blob/master/src/config.ts) option to either `"silently-remove-extras"` or `"throw-on-extras"`.
Caveats:

- The following types will always allow additional properties due to the nature of the way they work:
  - The `any` type
  - An indexed type (which explicitly allows additional properties) like `export interface IStringToStringDictionary { [key: string] : string }`
- If you are using tsoa for an existing service that has consumers...
  - you will need to inform your consumers before setting `noImplicitAdditionalProperties` to `"throw-on-extras"` since it would be a breaking change (due to the fact that request bodies that previously worked would now get an error).
- Regardless, `"noImplicitAdditionalProperties" : "silently-remove-extras"` is a great choice for both legacy AND new APIs (since this mirrors the behavior of C# serializers and other popular JSON serializers).

## Dealing with duplicate model names

If you have multiple models with the same name, you may get errors indicating that there are multiple matching models. If you'd like to designate a class/interface as the 'canonical' version of a model, add a jsdoc element marking it as such:

```ts
/**
 * @tsoaModel
 */
export interface MyModel {
  ...
}
```

## How can I get the most from my OAS?

Now that you have a OpenAPI Specification (OAS) (swagger.json), you can use all kinds of amazing tools that generate documentation, client SDKs, and more [here](http://openapi.tools//)
