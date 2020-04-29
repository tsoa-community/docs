# Decorators

Please note that this Section only covers Decorators that are not described seperately, such as [`@Response`]("error-handling") or [`Parameters`]("getting-started").
For a full overwiew, please check out the [API Reference](https://tsoa-community.github.io/reference/interfaces/_index_.config.html).

## Security

The `Security` decorator can be used above controller methods to indicate that there should be authentication before running those methods. As described above, the authentication is done in a file that's referenced in tsoa's configuration. When using the `Security` decorator, you can choose between having one or multiple authentication methods. If you choose to have multiple authentication methods, you can choose between having to pass one of the methods (OR):

```ts
@Security('tsoa_auth', ['write:pets', 'read:pets'])
@Security('api_key')
@Get('OauthOrAPIkey')
public async GetWithOrSecurity(@Request() request: express.Request): Promise<any> {
}
```

or having to pass all of them (AND):

```ts
@Security({
  tsoa_auth: ['write:pets', 'read:pets'],
  api_key: [],
})
@Get('OauthAndAPIkey')
public async GetWithAndSecurity(@Request() request: express.Request): Promise<any> {
}
```

## Tags

Tags are defined with the `@Tags('tag1', 'tag2', ...)` decorator in the controllers and/or in the methods like in the following examples.

```ts
import { Get, Route, Response, Tags } from "tsoa";

@Route("user")
@Tags("User")
export class UserController {
  @Response<ErrorResponseModel>("Unexpected error")
  @Get("UserInfo")
  @Tags("Info", "Get")
  public async userInfo(@Request() request: any): Promise<UserResponseModel> {
    return Promise.resolve(request.user);
  }

  @Get("EditUser")
  @Tags("Edit")
  public async userInfo(@Request() request: any): Promise<string> {
    // Do something here
  }
}
```

If you have a project that needs a description and/or external docs for tags, you can configure the internal generators to use the correct tags definitions and external docs by providing a tags property to spec property in tsoa.json.

```js
{
  "spec": {
    "tags":  [
      {
        "name": "User",
        "description": "Operations about users",
        "externalDocs": {
          "description": "Find out more about users",
          "url": "http://swagger.io"
        }
      }
    ],
    ...
  },
  "routes": {
    ...
  }
}
```

## OperationId

Set operationId parameter under operation's path.
Useful for use with OpenAPI code generation tool since this parameter is used to name the function generated in the client SDK.

```ts
@Get()
@OperationId('findDomain')
public async find(): Promise<any> {

}
```

## Deprecated

Declares this endpoint to be deprecated. Useful for when you are migrating endpoints and wants to keep a outdated
version live until all consumers migrate to use the new endpoint version.

```ts
@Get()
@Deprecated()
public async find(): Promise<any> {

}
```

## Hidden

Excludes this endpoint from the generated OpenAPI Specification document.

```ts
  @Get()
  @Hidden()
  public async find(): Promise<any> {

  }
```

It can also be set at the controller level to exclude all of its endpoints from the OpenAPI Specification document.

```ts
@Hidden()
export class HiddenController {
  @Get()
  public async find(): Promise<any> {}

  @Post()
  public async create(): Promise<any> {}
}
```

## Request

To access the request object of express in a controller method use the `@Request`-decorator:

```typescript
// controllers/usersController.ts

import * as express from "express";
import { Get, Route, Request } from "tsoa";
import { User, UserCreationRequest } from "../models/user";

@Route("Users")
export class UsersController {
  @Get("{id}")
  public async getUser(
    id: number,
    @Request() request: express.Request
  ): Promise<User> {
    // TODO: implement some code that uses the request as well
  }
}
```

To access Koa's request object (which has the ctx object) in a controller method use the `@Request`-decorator:

```typescript
// controllers/usersController.ts

import * as koa from "koa";
import { Get, Route, Request } from "tsoa";
import { User, UserCreationRequest } from "../models/user";

@Route("Users")
export class UsersController {
  @Get("{id}")
  public async getUser(
    id: number,
    @Request() request: koa.Request
  ): Promise<User> {
    const ctx = request.ctx;
    // TODO: implement some code that uses the request as well
  }
}
```

::: danger
Note that the parameter `request` does not appear in your OAS file.
Likewise you can use the decorator `@Inject` to mark a parameter as being injected manually and should be omitted in Spec generation.
In this case you should write your own custom template where you inject the needed objects/values in the method-call.
:::
