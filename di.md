# Dependency injection or IOC

By default all the controllers are created by the auto-generated routes template using an empty default constructor.
If you want to use dependency injection and let the DI-framework handle the creation of your controllers, we need set up an IoC Module tsoa can call.

To tell `tsoa` to use your DI-container you have to reference your module exporting the DI-container in the [config](https://github.com/lukeautry/tsoa/blob/master/src/config.ts) file (e.g. `tsoa.json`):

```js
{
  "entryFile": "...",
  "spec": {
    ...
  },
  "routes": {
    "routesDir": "...",
    "middleware": "...",
    "iocModule": "src/ioc",
    ...
  }
}
```

## IoC Module

Now you can create a module that exports either a container or a function as `iocContainer`.

Containers must conform to the following interface.
```ts
interface Container {
  get<T>: (T) => Controller
}
```

Functions must conform to the following siganture, where `Request` is your web framework's request object.
```ts
(request: Request) => Container
```

### Example
```ts
// src/ioc.ts
import { Container } from "di-package";

// Assign a container to `iocContainer`.
const iocContainer = new Container();

// Or assign a function with to `iocContainer`.
const iocContainer = function (request: Request) {
  const container = new Container();
  container.bind(request);
  return container;
}

// export according to convention
export { iocContainer }
```

::: tip
If you want to use a DI framework other than the examples below, adding it isn't hard.
If you set an iocModule, tsoa will call this module (to get a `FooController`) with:

```ts
import { iocContainer } from "./the/path/to/the/module/from/tsoa.json";

iocContainer.get<FooController>(FooController);
```

If you wrap your DI's API or even a ControllerFactory to accept this call and respond with a FooController, it'll work.
:::

## InversifyJS

Here is some example code to setup the container and your controller with inversify.js.
Usually, you'll have to tell inversify how to create your controller, but since this is not supposed to cover inversify,
we'll just refer to their [docs](http://inversify.io/).
For convenience, we will use inversify-binding-controllers here, which makes it very simple to tell inversify how to create tsoa controllers.
More information can be found [here](https://github.com/inversify/inversify-binding-decorators).

```ts
// src/ioc.ts
import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";

// Create a new container tsoa can use
const iocContainer = new Container();

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

// export according to convention
export { iocContainer };
```

We usually don't want to create a new controller instance for every call, so let's create a convenience wrapper around [`@fluentProvide()`](https://github.com/inversify/inversify-binding-decorators#fluent-binding-decorator)

```ts
// src/util/provideSingleton.ts
import { fluentProvide } from "inversify-binding-decorators";
import { interfaces } from "inversify";

export const provideSingleton = function <T>(
  identifier: interfaces.ServiceIdentifier<T>
) {
  return fluentProvide(identifier).inSingletonScope().done();
};
```

Now, in our controllers, we can use `@provideSingleton()`

```ts
// src/users/usersController.ts
import { Route } from 'tsoa';
import { provideSingleton, inject } from '../inversify/ioc';

@Route('foo')
@provideSingleton(FooController)
export class UsersController {
  constructor(
    @inject(FooService) private fooService: FooService
  ) { }
  ...
}

@provideSingleton(FooService) // or @provide(FooService)
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
