# Authentication

Authentication is done using a middleware handler along with `@Security('name', ['scopes'])` decorator in your controller.

First, define the security definitions for OpenAPI, and also configure where the authentication middleware handler is. In this case, it is in the `authentication.ts` file.

```js
{
  "spec": {
    "securityDefinitions": {
        "api_key": {
            "type": "apiKey",
            "name": "access_token",
            "in": "query"
        },
        "tsoa_auth": {
            "type": "oauth2",
            "authorizationUrl": "http://swagger.io/api/oauth/dialog",
            "flow": "implicit",
            "scopes": {
                "write:pets": "modify things",
                "read:pets": "read things"
            }
        }
    },
    ...
  },
  "routes": {
    "authenticationModule": "./authentication.ts",
    ...
  }
}
```

In the middleware, export the function based on which library (Express, Koa, Hapi) you are using. You only create 1 function to handle all authenticate types. The `securityName` and `scopes` come from the annotation you put above your controller function.
`./authentication.ts`

```ts
import * as express from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_token") {
    let token;
    if (request.query && request.query.access_token) {
      token = request.query.access_token;
    }

    if (token === "abc123456") {
      return Promise.resolve({
        id: 1,
        name: "Ironman",
      });
    } else {
      return Promise.reject({});
    }
  }

  if (securityName === "jwt") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(token, "[secret]", function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          // Check if JWT contains all required scopes
          for (let scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(new Error("JWT does not contain required scope."));
            }
          }
          resolve(decoded);
        }
      });
    });
  }
}

import * as hapi from "@hapi/hapi";
export function hapiAuthentication(
  request: hapi.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  // See above
}

import { Request } from "koa";
export function koaAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  // See above
}
```

`./controllers/securityController.ts`

```ts
import { Get, Route, Security, Response } from "tsoa";

@Route("secure")
export class SecureController {
  @Response<ErrorResponseModel>("Unexpected error")
  @Security("api_token")
  @Get("UserInfo")
  public async userInfo(@Request() request: any): Promise<UserResponseModel> {
    return Promise.resolve(request.user);
  }

  @Security("jwt", ["admin"])
  @Get("EditUser")
  public async userInfo(@Request() request: any): Promise<string> {
    // Do something here
  }
}
```
