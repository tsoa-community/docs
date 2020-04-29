# Overriding route template

If you want functionality that tsoa doesn't provide, then one powerful (but potentially costly approach) is to provide tsoa with a custom handlebars template to use when generating the routes.ts file.

::: danger
Using a custom template means that you will have a more difficult time migrating to new versions of tsoa since your template interacts with the tsoa internals. So, to get the newest and best features of tsoa, please use one of provided templates by selecting your chosen `"middleware"` (i.e. "koa", "express", or "hapi") and by omitting `"middlewareTemplate"`.
:::

_Okay, but why would you want to override the route template?_

- Are you using a server framework that we don't yet support? If so, then [please open an issue first](https://github.com/lukeautry/tsoa/issues). It's likely that we will try to accept your custom template as one of the new standard options. If we can't support the new framework, then we'll recommend a custom route template.
- Do you have a very specific requirement? Have you already opened an issue and have the tsoa maintainers opted not to support this feature? Then a custom template might solve your needs best.

Route templates are generated from predefined handlebar templates. You can override and define your own template to use
by defining it in your tsoa.json configuration. Route paths are generated based on the middleware type you have defined.

```js
{
  "entryFile": "...",
  "spec": {
    ...
  },
  "routes": {
    "routesDir": "...",
    "middleware": "express",
    "middlewareTemplate": "custom-template.ts"
    ...
  }
}
```
