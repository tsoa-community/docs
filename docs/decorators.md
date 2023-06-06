# Decorators

Please note that this Section only covers Decorators that are not described separately, such as [`@Response`](./error-handling) or [`@Parameters`](./getting-started).
For a full overview, please check out the [API Reference](https://tsoa-community.github.io/reference/index.html).

## Security

The `@Security` decorator can be used above controller methods to indicate that there should be authentication before running those methods. As described above, the authentication is done in a file that's referenced in tsoa's configuration. When using the `@Security` decorator, you can choose between having one or multiple authentication methods. If you choose to have multiple authentication methods, you can choose between having to pass one of the methods (OR):

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

@Route("users")
@Tags("User")
export class UsersController {
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

OpenAPI allows you to deprecate [operations](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#user-content-operationdeprecated), [parameters](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#user-content-parameterdeprecated), and [schemas](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#user-content-schemadeprecated). This lets you indicate that certain endpoint/formats/etc. should no longer be used, while allowing clients time to migrate to the new approach.

To deprecate parts of your API, you can attach the `@Deprecated` decorator to class properties, methods, and parameters. For constructs that don't support decorators (e.g. interfaces and type aliases), you can use a `@deprecated` JSDoc annotation. Some examples:

### Operations

```ts
@Get()
@Deprecated()
public async find(): Promise<any> {

}
```

### Parameters (OpenAPI 3+ only)

```ts
@Get("v2")
public async findV2(
  @Query() text: string,
  @Deprecated() @Query() dontUse?: string
): Promise<any> {

}
```

### Schemas (OpenAPI 3+ only)

```ts
class CreateUserRequest {
  name: string;
  @Deprecated() firstName?: string;

  constructor(
    public emailAddress: string,
    @Deprecated() public icqHandle?: string
  ) {}
}

interface CreateUserResponse {
  /** @deprecated */ durationMs?: number;
  details: UserDetails;
}

type UserDetails = {
  name: string;
  /** @deprecated */ firstName?: string;
};
```


## Hidden

Use on methods to exclude an endpoint from the generated OpenAPI Specification document.

```ts
  @Get()
  @Hidden()
  public async find(): Promise<any> {

  }
```

Use on controllers to exclude all of its endpoints from the generated OpenAPI Specification document.

```ts
@Hidden()
export class HiddenController {
  @Get()
  public async find(): Promise<any> {}

  @Post()
  public async create(): Promise<any> {}
}
```

Use on `@Query` parameters to exclude query params from the generated OpenAPI Specification document. The parameter must either allow undefined or have a default value to be hidden.

```ts
  @Get()
  public async find(
    @Query() normalParam: string,
    @Query() @Hidden() defaultSecret = true,
    @Query() @Hidden() optionalSecret?: string
  ): Promise<any> {

  }
```

## Request

To access the request object of express in a controller method use the `@Request`-decorator:

```typescript
// src/users/usersController.ts

import * as express from "express";
import { Get, Route, Request } from "tsoa";
import { User, UserCreationRequest } from "../models/user";

@Route("users")
export class UsersController {
  @Get("{userId}")
  public async getUser(
    userId: number,
    @Request() request: express.Request
  ): Promise<User> {
    // TODO: implement some code that uses the request as well
  }
}
```
To access Koa's request object (which has the ctx object) in a controller method use the `@Request`-decorator:

```typescript
// src/users/usersController.ts

import * as koa from "koa";
import { Get, Route, Request } from "tsoa";
import { User, UserCreationRequest } from "../models/user";

@Route("users")
export class UsersController {
  @Get("{userId}")
  public async getUser(
    userrId: number,
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

## Produces

The `@Produces` decorator is used to define custom media types for the responses of controller methods in the OpenAPI generator. It allows you to specify a specific media type for each method, without overwriting the default Content-Type response.

Here's an example of how to use the `@Produces` decorator:

```typescript
@Route('MediaTypeTest')
@Produces('application/vnd.mycompany.myapp+json')
export class MediaTypeTestController extends Controller {
  @Get('users/{userId}')
  public async getDefaultProduces(@Path() userId: number): Promise<UserResponseModel> {
    this.setHeader('Content-Type', 'application/vnd.mycompany.myapp+json');
    return Promise.resolve({
      id: userId,
      name: 'foo',
    });
  }
  @Get('custom/security.txt')
  @Produces('text/plain')
  public async getCustomProduces(): Promise<string> {
    const securityTxt = 'Contact: mailto: security@example.com\nExpires: 2012-12-12T12:37:00.000Z';
    this.setHeader('Content-Type', 'text/plain');
    return securityTxt;
  }
}
```

::: danger
Please note that using the `@Produces` decorator only affects the generated OpenAPI Specification. You must also ensure that you send the correct header using `this.setHeader('Content-Type', 'MEDIA_TYPE')` in your controller methods.
:::
