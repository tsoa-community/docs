# Uploading files

This requires to have multer installed:

```bash
yarn add multer
yarn add -D @types/multer
```

Inside a controller resource, call handleFile and pass the express Request to resolve 'file'. This also handles multipart/form-data. A quick sample:

```ts
import { Get, Route, Security, Response } from "tsoa";
import express from "express";
import multer from "multer";

@Route("files")
export class FilesController {
  @Post("uploadFile")
  public async uploadFile(@Request() request: express.Request): Promise<any> {
    await this.handleFile(request);
    // file will be in request.randomFileIsHere, it is a buffer
    return {};
  }

  private handleFile(request: express.Request): Promise<any> {
    const multerSingle = multer().single("randomFileIsHere");
    return new Promise((resolve, reject) => {
      multerSingle(request, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}
```

The according OpenAPI definition can be merge-overwritten inside `tsoa.json`. Here is a quick sample, what the previous request should look like.

```js
{
  "spec": {
    ...
    "specMerging": "recursive",
    "spec": {
      "paths": {
        "/files/uploadFile": {
          "post": {
            "consumes": [
              "multipart/form-data"
            ],
            "parameters": [
              {
                "in": "formData",
                "name": "randomFileIsHere",
                "required": true,
                "type": "file"
              }
            ]
          }
        }
      }
    }
  },
  "routes": {
     ...
  }
}
```
