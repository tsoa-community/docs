### Path mapping

Per the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html) under [module resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html):

> Sometimes modules are not directly located under baseUrl. For instance, an import to a module "jquery" would be translated at runtime to "node_modules\jquery\dist\jquery.slim.min.js". Loaders use a mapping configuration to map module names to files at run-time, see RequireJs documentation and SystemJS documentation.
>
> The TypeScript compiler supports the declaration of such mappings using "paths" property in tsconfig.json files. Here is an example for how to specify the "paths" property for jquery.

```js
{
  "compilerOptions": {
    "baseUrl": ".", // This must be specified if "paths" is.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // This mapping is relative to "baseUrl"
    }
  }
}
```

If you have a project that utilized this functionality, you can configure the internal generators to use the correct paths by providing a compilerOptions property to route configuration property in tsoa.json.

```js
{
  "spec": {
    ...
  },
  "routes": {
    ...
  },
   "compilerOptions": {
        "baseUrl": "./path/to/base/url",
        "paths": {
            "exampleLib": "./path/to/example/lib"
        }
    }
}
```
