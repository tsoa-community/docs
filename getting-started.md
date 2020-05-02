---
title: Getting started
lang: en-US
---

# Getting started

**What we will talk about:**

[[toc]]

::: warning COMPATIBILITY NOTE
This guide requires Node.js >= 8 and will target [express](https://expressjs.com).
We currently recommend using [Yarn](https://yarnpkg.com/en/), npm should work but was not tested.
:::

## Initializing our project

```shell
# Create a new folder for our project
mkdir tsoa-project
cd tsoa-project

# Create a package.json and initialize git
git init
yarn init -y

# Add our dependencies
yarn add tsoa express body-parser
yarn add -D typescript @types/node @types/express @types/body-parser

# Initialize tsconfig.json
yarn run tsc --init
```

## Configuring tsoa and typescript

```js
// tsoa.json
{
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/**/*Controller.ts"],
  "spec": {
    "outputDirectory": "build",
    "specVersion": 3
  },
  "routes": {
    "routesDir": "build"
  }
}
```

Let's take a look at what we are telling tsoa here:
First, we specify where the entry point to our application will be.
Most likely, this file will be called `index.ts` or `app.ts`. We will create this file in a second.

Afterwards, the `controllerPathGlob` tells tsoa where it can look for controllers so we don't manually have to import them.

Next, we tell tsoa how strict excess property checking (to use the TypeScript term) or additionalProperty checking (to use OpenAPI terminology) should be.
We can choose to "ignore" additional Properties (the OpenAPI default), remove them during validation ("silently-remove-extras"), or throw an Error back to the Client ("throw-on-extras").
Next, we set the output directory for out OpenAPI specification (OAS) and our `routes.ts` file, which we will talk about later.

We set the `specVersion` to `3` so tsoa will generate an OpenAPI v3 specification.

For a full list of all the possible config, take a look at the [API Reference](https://tsoa-community.github.io/reference/interfaces/config.html)

::: tip
While the default ts config will work for this guide, an improved tsconfig.json would look something like this:
::: details

```js
{
  "compilerOptions": {
    /* Basic Options */
    "incremental": true,
    "target": "es6",
    "module": "commonjs",
    "outDir": "build",

    /* Strict Type-Checking Options */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Module Resolution Options */
    "moduleResolution": "node",
    "baseUrl": ".",
    "esModuleInterop": true,

    /* Experimental Options */
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    /* Advanced Options */
    "forceConsistentCasingInFileNames": true
  }
}
```

:::

## Defining our first model

If you already have an OpenAPI Specification, you can use existing OpenAPI tooling to generate your Models or Interfaces.
Otherwise, let's define a `User` Interface in `src/users/user.ts`.

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  status?: "Happy" | "Sad";
  phoneNumbers: string[];
}
```

Before we start defining our Controller, it's usually a good idea to create a Service that handles interaction with our Models instead of shoving all that logic into the controller layer.

```ts
// user/userService.ts
import { User } from "./user";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class UserService {
  public get(id: number, name?: string): User {
    return {
      id,
      email: "jane@doe.com",
      name: name ?? "Jane Doe",
      status: "Happy",
      phoneNumbers: [],
    };
  }

  public create(userCreationParams: UserCreationParams): User {
    return {
      id: Math.floor(Math.random() * 10000), // Random
      status: "Happy",
      ...userCreationParams,
    };
  }
}
```

## Defining a simple controller

```typescript {15,17,19,20,25,26,28}
// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { User } from "./user";
import { UserService, UserCreationParams } from "./userService";

@Route("users")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() name?: string
  ): Promise<User> {
    return new UserService().get(userId, name);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    new UserService().create(requestBody);
    return;
  }
}
```

Let's take a step back and talk about what's going on here.
As you can hopefully already tell, we are defining a `/users/` route using the `@Route()` decorator above our controller class.

Additionally, we define 2 methods: `getUser` and `createUser`.
The `@Get()` decorator in combination with our base route `/users/` will tell tsoa to invoke this method for every _GET_ request to `/users/{{userId}}`, where _{userId}_ is a template.

::: tip OpenAPI Path Templating
Routing in tsoa is closely mirroring OpenAPI's path templating for compatibility reasons.
Path templating refers to the usage of template expressions, delimited by curly braces ({}), to mark a section of a URL path as replaceable using path parameters.
:::

Under the hood, this would be like defining `app.get('users/:userId')`.
While express allows you to use regex-ish route definitions, we prefer to split the routing and the validation more clearly.
Because you're asking for the _id_ to be a _number_ by using the `@Path()` decorator with an `userId` of type number, tsoa will reject passing i.e. a _string_ here.
Similarly, if you want to accept a _string_ with a certain pattern, you can do that using JSON Schema annotations. You can learn more about that [here](#what-s-next).

tsoa will allow 4 types of parameters: Path parameters (using `@Path()`), Query Parameters (`@Query()`), Header Parameters (`@Header()`) and Body Parameters (`@Body()` or individual properties using `@BodyProp()`).

::: tip
If the parameter name is equal to the http message parameter, you may omit the argument to the decorators, otherwise you may provide an argument:

```ts
@Query('my-query') myQuery: string;
```

:::

A full list of all the decorators can be found [here](https://tsoa-community.github.io/reference/globals.html#body).

## Creating our express server

Let's now create an `app.ts` and a `server.ts` file in our source directory like this:

```ts
// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

RegisterRoutes(app);
```

```ts
// src/server.ts
import { app } from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
```

## Building the routes file

At this point you may have notices that TypeScript will not find the `RegisterRoutes` import from `build/routes`. That's because we haven't asked tsoa to create that yet.
Let's do that now:

```shell
yarn run tsoa routes
```

Now your routes.ts file should've been created and you can compile TypeScript and start your server:

```shell
yarn run tsc --outDir build --experimentalDecorators
node build/server.js
```

## What's next?

- Manually invoking `tsc` and `tsoa routes` in development isn't very convenient.
- Inspecting our first OpenAPI specification and supercharging our feedback loop by serving an up-to-date version of SwaggerUI during development.

We can improve that using [live reloading](./live-reloading).

- Improving our response for validation errors using proper [error handling](./error-handling)
- Using [Descriptions](./descriptions), [Examples](./examples) and [Annotations](./annotations) for advanced validation and better documentation
