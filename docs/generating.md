# Generating Routes and OAS

## Using CLI

### Basic Commands

```bash
# generate OAS
tsoa spec

# generate routes
tsoa routes
```

### Options

#### OpenAPI Specification (OAS) generation

```
Usage: tsoa spec [options]

Options:
   --configuration, -c  tsoa configuration file; default is tsoa.json in the working directory  [string]
   --host  API host                                                                             [string]
   --basePath  Base API path                                                                    [string]
```

#### Route generation

```
Usage: tsoa routes [options]

Options:
  --configuration, -c  tsoa configuration file; default is tsoa.json in the working directory   [string]
  --basePath  Base API path                                                                     [string]
```

You can find the Reference for the tsoa configuration file [here](https://tsoa-community.github.io/reference/interfaces/_tsoa_runtime.config-1.html)

For information on the configuration object (tsoa.json), you may also me interested in:

[Configuration definition](https://github.com/lukeautry/tsoa/blob/master/packages/runtime/src/config.ts)

[Configuration sample](https://github.com/lukeautry/tsoa/blob/master/tests/tsoa.json)

## Programmatic

```typescript
import {
  generateRoutes,
  generateSpec,
  ExtendedRoutesConfig,
  ExtendedSpecConfig,
} from "tsoa";

(async () => {
  const specOptions: ExtendedSpecConfig = {
    basePath: "/api",
    entryFile: "./api/server.ts",
    specVersion: 3,
    outputDirectory: "./api/dist",
    controllerPathGlobs: ["./routeControllers/**/*Controller.ts"],
  };

  const routeOptions: ExtendedRoutesConfig = {
    basePath: "/api",
    entryFile: "./api/server.ts",
    routesDir: "./api",
  };

  await generateSpec(specOptions);

  await generateRoutes(routeOptions);
})();
```

**Note:** If you use tsoa programmatically, please be aware that tsoa's methods can (under rare circumstances) change in minor and patch releases. But if you are using tsoa in a .ts file, then TypeScript will help you migrate to any changes. We reserve this right to change what are essentially our internal methods so that we can continue to provide incremental value to the majority user (our CLI users). The CLI however will only receive breaking changes during a major release.
