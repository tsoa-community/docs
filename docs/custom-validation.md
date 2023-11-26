# Custom Validation with class-validator

Sometimes TSOA builtin validation is not enough, in this case we can utilise more powerful libraries like `class-validator`

This chapter will explain how to use `class-validator` with TSOA/Express.



The `@Middlewares` decorator can be used to apply custom middleware to an endpoint in your TypeScript code.

For example, to apply two middlewares pass array of middleware functions to `@Middlewares` decorator, like this:
```ts
@Middlewares([jwt, validateBody(RequestClass)])
```

## Install class-validator package

Install `class-validator` and `class-transformer` as it described in their repos

[https://github.com/typestack/class-transformer](https://github.com/typestack/class-transformer)

[https://github.com/typestack/class-validator](https://github.com/typestack/class-validator)

## Write custom middleware

The example class for validation middleware using `class-validator`:

```ts
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';

export function validateBody<T extends object>(targetClass: ClassConstructor<T>) {
   return async (req: Request, _res: Response, next: NextFunction) => {
      const instance = plainToInstance(targetClass, req.body);
      const errors = validateSync(instance, {
         forbidUnknownValues: true,
         validationError: {
            target: false
         }
      });
      const fieldsErrors: { [name: string]: { message: string; value: string } } = {};

      if (errors.length > 0) {
         errors.forEach(error => {
            if (error.constraints) {
               fieldsErrors[error.property] = {
                  message: Object.values(error.constraints).join(', '),
                  value: error.value
               };
            }
            if (error.children) {
               error.children.forEach(errorNested => {
                  if (errorNested.constraints) {
                     fieldsErrors[errorNested.property] = {
                        message: Object.values(errorNested.constraints!).join(', '),
                        value: errorNested.value
                     };
                  }
               })
            }
         });
         next(new ValidateError(fieldsErrors, 'Validation failed'));
         return;
      }
      next();
   };
}
```

## Annotate class with class validator:

```ts
class RequestClass {
   @Length(1, 2000)
   text: string;
}
```

## Usage in controller: 

```ts
import {
    Controller,
    Middlewares,
    Post,
    Route,
    SuccessResponse,
    Body
} from 'tsoa';
import { provide } from 'inversify-binding-decorators';
import {validateBody} from "../middleware/ValidationMiddleware";

@provide(PostController)
@Route('/post')
export class PostController extends Controller {

    @SuccessResponse(200, 'Post created')
    @Post()
    @Middlewares([jwt, validateBody(RequestClass)])
    public async create(
        @Body() request: RequestClass
    ): Promise<void> {
        console.log(`validated request: ${request}`);
    }
}
```


