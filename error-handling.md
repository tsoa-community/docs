---
title: Error Handling
lang: en-US
---

# Specifying error response types for OpenAPI

```ts
@Response('400', 'Bad request')
@Response<ErrorResponse>('default', 'Unexpected error')
@Get('Response')
public async getResponse(): Promise<TestModel> {
  return new ModelService().getModel();
}
```

For information on how to return a specific error [see this example](https://github.com/lukeautry/tsoa/issues/382)
