# Uploading files

This requires to have multer installed:

```bash
yarn add multer
yarn add -D @types/multer
```

## Using the UploadedFile / UploadedFiles decorator

The simplest way to add support for file upload is by adding `@UploadedFiles` or `@UploadedFile` as a parameter decorator. This loads multer allowing multipart/form-data submissions to work. `@FormField` can be used to access other multipart form fields.

Express example:

```ts
import { Post, Route, FormField, UploadedFiles, UploadedFile } from "tsoa";

@Route("files")
export class FilesController {
  @Post("uploadFile")
  public async uploadFile(
      @FormField() title: string,
      @FormField() description: string,
      @UploadedFiles() files: Express.Multer.File[],
      @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    console.log(files);
  }
}
```

Koa example:


```ts
import { Post, Route, FormField, UploadedFiles, UploadedFile } from "tsoa";

@Route("files")
export class FilesController {
  @Post("uploadFile")
  public async uploadFile(
      @FormField() title: string,
      @FormField() description: string,
      @UploadedFiles() files: File[],
      @UploadedFile() file: File,
  ): Promise<void> {
    console.log(files);
  }
}
```

Note, that using the decorator defaults to saving on the disk with a default file location set to the OS's temp folder.

## Custom multer upload

To customize the multer upload, you have to use multer inside a controller resource.

To use it with Express, call handleFile and pass the express Request to resolve 'file'. This also handles multipart/form-data. A quick sample:

```ts
import { Post, Request, Route } from "tsoa";
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
    const multerSingle = multer().single("file");
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

To use it with Koa, pass Koa's Request context object to resolve 'file'. This also handles multipart/form-data. A quick sample:

```ts
import { Post, Request, Route } from "tsoa";
import { Request as KoaRequest } from "koa";
import multer from "multer";

@Route("files")
export class FilesController {
  @Post("uploadFile")
  public async uploadFile(@Request() request: KoaRequest): Promise<any> {
    const multer = multer().single("file");
    await multer(request.ctx, async () => null);
    const multerSingle = multer().single("randomFileIsHere");
    // file will be in request.randomFileIsHere, it is a buffer
    return {};
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
