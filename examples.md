# Examples

Study after study shows that examples are a crucial part of learning new APIs ([1](https://www.cs.mcgill.ca/~martin/papers/software2009a.pdf), [2](https://sigdoc.acm.org/cdq/how-developers-use-api-documentation-an-observation-study/), [3](https://ase.cpsc.ucalgary.ca/wp-content/uploads/2018/05/A-Study-of-the-Effectiveness-of-Usage-Examples-in-REST-API-Documentation.pdf)).
While certain issues, like type mismatches can be avoided by inferring examples from the JSON Schema (like the examples SwaggerUI automatically generates\*), it's often a lot more intuitive if we provide certain examples ourselves.

\* Which is limited as well, i.e. patterns will be ignored, and just sending the string "string" every time is somewhat suboptimal if that string actually carries meaning.

::: tip
tsoa does not (yet) check your examples.
Incorrect examples will not break your compilation, because OpenAPI [explicitly allows anything](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#fixed-fields-20).
You may also just want to demonstrate tsoa's validation :smirk:

We recommend using a linter
(we love [Spectral](https://stoplight.io/p/docs/gh/stoplightio/spectral)) to ensure your specifications aren't just correct,
but also contain [descriptions](./descriptions) and correct examples.
:::

::: warning
OpenAPI 2 only allows one example per model/property/parameter. Although OpenAPI 3 supports multiple examples, tsoa does not support this behavior yet.
If this is something you want to see or need, we'd love to receive a PR for that.
:::

## Parameter examples

::: warning
You may expect to see an example for a type reference (to a type alias, interface or a class) if you set one.
However, since it'll be transformed to a reference (_\$ref_) to the schema, the example must be ignored,
since any properties that are placed next to _\$ref_ (OpenAPI's mechanism to link to the UserCreationParams schema) must be ignored.

For more info, check out the relevant parts of the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#schemaObject) and [JSON Schema Core](https://tools.ietf.org/html/draft-wright-json-schema-00#section-7)

:::

```ts {4}
@Route("users")
export class UsersController extends Controller {
  /**
   * @example userId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{userId}")
  public async getUser(
    @Path() userId: UUID,
    @Query() name: string
  ): Promise<User> {
    return new UserService().get(userId, name);
  }
}
```

## Model examples

```ts {5,14-18}
/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

/**
 * User objects allow you to associate actions performed in the system with the user that performed them.
 * The User object contains common information across every user in the system regardless of status and role.
 *
 *
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "name": "John Doe",
 *  "phoneNumbers": []
 * }
 */
export interface User {
  id: UUID;

  /**
   * The email the user used to register his account
   */
  email?: string;

  name: string;
  status?: "Happy" | "Sad";
  phoneNumbers: string[];
}
```

## Property examples

::: warning
You may expect to see an example for the `id` if you set one.
However, since it'll be transformed to a reference to the UUID schema, the example must be ignored,
since any properties that are placed next to _\$ref_ (OpenAPI's mechanism to link to the UUID schema) must be ignored.

For more info, check out the relevant parts of the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#schemaObject) and [JSON Schema Core](https://tools.ietf.org/html/draft-wright-json-schema-00#section-7)

:::

```ts {11-13}
export interface User {
  id: UUID;

  /**
   * The email the user used to register his account
   */
  email?: string;

  name: string;

  /**
   * @example "Happy"
   */
  status?: "Happy" | "Sad";

  phoneNumbers: string[];
}
```

## Response examples

Most likely, this will be a type reference to a type defined somewhere else.
You should set the example there, since the type reference will be be transformed to schema reference (using _\$ref_), and the example must be ignored,
since any properties that are placed next to _\$ref_ (OpenAPI's mechanism to link to the schema) must be ignored.

For more info, check out the relevant parts of the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#schemaObject) and [JSON Schema Core](https://tools.ietf.org/html/draft-wright-json-schema-00#section-7)
