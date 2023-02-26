# Consuming generated routes

You have two options for how to tell tsoa where it can find the controllers that it will use to create the auto-generated `routes.ts` file.

## Using automatic controllers discovery

You can tell `tsoa` to use your automatic controllers discovery by providing a [minimatch glob](http://www.globtester.com/) in the [config](https://github.com/lukeautry/tsoa/blob/master/packages/runtime/src/config.ts) file (e.g. `tsoa.json`). It can be provided on `config.spec` or `config.routes`.

Pros:

- New developers can add a controller without having to know how tsoa "crawls" for the controllers. As long as their controller is caught by the glob that you provide, the controller will be added to the OpenAPI documentation and to the auto-generated `routes.ts` file.

Cons:

- It could be potentially slower (but not significantly slow) than the alternative option described further down in the readme.

As you can see from the the controllers globs patterns below, you can provide multiple globs of various patterns:

```js
{
  "entryFile": "...",
  "routes": {
    "routesDir": "...",
    "middleware": "...",
    "controllerPathGlobs": [
      "./dir-with-controllers/*",
      "./recursive-dir/**/*",
      "./custom-filerecursive-dir/**/*.controller.ts"
    ]
  }
}
```

## Manually telling tsoa which controllers to use in the app entry file

Tsoa can "crawl" the index file to look for controllers that have the `@Route` decorator.

Pros:

- The tsoa route generation will be faster.

Cons:

- New developers on your team might add a controller and not understand why the new controller was not exposed to the router or to the OpenAPI generation. If this is a problem for you, please us the automatic controller discovery option described above.

```typescript
import * as methodOverride from "method-override";
import * as express from "express";
import * as bodyParser from "body-parser";
import { RegisterRoutes } from "./routes";

// ########################################################################
// controllers need to be referenced in order to get crawled by the generator
import "./users/usersController";
// ########################################################################

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

RegisterRoutes(app);

app.listen(3000);
```
