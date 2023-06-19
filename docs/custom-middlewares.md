# Custom Middlewares

The `@Middlewares` decorator is used to apply custom middleware to an endpoint in your TypeScript code. This middleware intercepts incoming HTTP requests before they reach the endpoint and allows you to perform additional operations or modifications. It provides support for Express, Koa, and Hapi middlewares.

## Example 

```ts
async function customMiddleware(req: Req, res: ExpRes, next: NextFunction) {
    // Perform any necessary operations or modifications
    next();
}

@Get("/custom-middleware")
@Middlewares(customMiddleware)
async exampleGetEndpoint(@Request() req: Req): Promise<void> {
    console.log(`Custom middleware`);
}
```

## Execution Flow

When an HTTP request is made to the endpoint decorated with `@Middlewares`, the execution flow is as follows:

The request first goes through the custom middleware function specified in the `@Middlewares` decorator.
Inside the middleware function, you can perform any necessary operations or modifications on the request or response objects.

After completing the middleware logic, you must call the `next()` function to pass the request to the next middleware or the endpoint itself.

Finally, the request reaches the exampleGetEndpoint method, where you can handle the request and provide the appropriate response.

It's important to note that the order of the decorators and middlewares matters. If multiple middlewares are specified, they are executed in the order they are applied.
