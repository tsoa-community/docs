# JSON Schema / tsoa keyword annotations

Under the hood, OpenAPI heavily relies on JSON Schema Draft 00 for all the data model specifications.
JSON Schema Draft 00 defines data types that are not implemented in TypeScript.
A great example are integers.
If we want to communicate that a number must be an integer,
tsoa will specify this in the OAS and validate incoming requests against that.

::: warning
As always, _\$ref_ restrictions apply
:::

In general, the JSDoc notation is very similar each time:

```
@<keyword> <argument>* <rejectionMessage>?
```

::: tip
For parameters, use the `@<keyword> <paramName> <argument>* <rejectionMessage>?` syntax in your JSDoc (similar to [descriptions](#parameter-descriptions) or [examples](#parameter-examples))
:::

Examples:

`@isInt we would kindly ask you to provide a number here`

`@minLength 1 array must not be empty`

`@maximum headerParameter 4 number must be <4`

### List of supported keywords (with arguments)

[Click here for the list of keywords supported by OpenAPI 3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#properties)

#### Generic

- default
- format

::: danger
Formats will generally not be validated, except for `format: date(time)`, which will automatically be generated for TS type `Date`.
:::

#### Date

- isDateTime for setting custom error messages
- isDate for setting custom error messages
- minDate
- maxDate

#### Numeric

- **isInt (tsoa special since TS does not know integer as a type)**
- **isFloat (tsoa special since TS does not know integer as a type)**
- minimum
- maximum

#### String

- isString for setting custom error messages
- minLength
- maxLength
- pattern

#### Array

- isArray for setting custom error messages
- minItems
- maxItems
- unique

#### Boolean

- isBool for setting custom error messages
