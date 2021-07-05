# Uploading files

This requires to have multer installed:

```bash
yarn add multer
yarn add -D @types/multer
```

Adding `@UploadedFiles` or `@UploadedFile` as a parameter decorator loads multer allowing multipart/form-data submissions to work. `@FormField` can be used to access other multipart form fields.

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
