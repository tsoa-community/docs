# Dependency injection or IOC

By default all the controllers are created by the auto-generated routes template using an empty default constructor.
If you want to use dependency injection and let the DI-framework handle the creation of your controllers you can use [inversifyJS](https://github.com/inversify/InversifyJS) or [typescript-ioc](https://github.com/thiagobustamante/typescript-ioc)

## InversifyJS

To tell `tsoa` to use your DI-container you have to reference your module exporting the DI-container in the [config](https://github.com/lukeautry/tsoa/blob/master/src/config.ts) file (e.g. `tsoa.json`):
The convention is that you have to name your inversify `Container` `iocContainer` and export it in the given module.

```js
{
  "entryFile": "...",
  "spec": {
    ...
  },
  "routes": {
    "routesDir": "...",
    "middleware": "...",
    "iocModule": "./inversify/ioc",
    ...
  }
}
```

Note that as of 1.1.1 the path is now relative to the your current working directory like the other paths.

Here is some example code to setup the container and your controller with inversify.js.

`./inversify/ioc.ts`:

```ts
import { Container, inject, interfaces } from "inversify";
import {
  autoProvide,
  makeProvideDecorator,
  makeFluentProvideDecorator,
} from "inversify-binding-decorators";

let iocContainer = new Container();

let provide = makeProvideDecorator(iocContainer);
let fluentProvider = makeFluentProvideDecorator(iocContainer);

let provideNamed = function (
  identifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>,
  name: string
) {
  return fluentProvider(identifier).whenTargetNamed(name).done();
};

let provideSingleton = function (
  identifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>
) {
  return fluentProvider(identifier).inSingletonScope().done();
};

export {
  iocContainer,
  autoProvide,
  provide,
  provideSingleton,
  provideNamed,
  inject,
};
```

`./controllers/fooController.ts`

```ts
import { Route } from 'tsoa';
import { provideSingleton, inject } from '../inversify/ioc';

@Route('foo')
@provideSingleton(FooController)
export class FooController {
  constructor(
    @inject(FooService) private fooService: FooService
  ) { }
  ...
}

@provideSingleton(FooService)
export class FooService {
  constructor(
    // maybe even more dependencies to be injected...
  )
}
```

## typescript-ioc

Here is some example code to setup the controller with typescript-ioc.

`./controllers/fooController.ts`

```ts
import { Route } from 'tsoa';
import { Inject, Provides } from "typescript-ioc";

@Route('foo')
export class FooController {

  @Inject
  private fooService: FooService
  ...

}

@Provides(FooService)
export class FooService {

}
```

The controllers need to be included in the application in order to be linked.

`index.ts`

```ts
import "./controllers/fooController.ts"
...

```
