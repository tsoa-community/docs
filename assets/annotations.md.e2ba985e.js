import{_ as e,c as a,o as t,a as s}from"./app.3cf33814.js";const g=JSON.parse('{"title":"JSON Schema / tsoa keyword annotations","description":"","frontmatter":{},"headers":[{"level":3,"title":"List of supported keywords (with arguments)","slug":"list-of-supported-keywords-with-arguments","link":"#list-of-supported-keywords-with-arguments","children":[]}],"relativePath":"annotations.md"}'),i={name:"annotations.md"},r=s(`<h1 id="json-schema-tsoa-keyword-annotations" tabindex="-1">JSON Schema / tsoa keyword annotations <a class="header-anchor" href="#json-schema-tsoa-keyword-annotations" aria-hidden="true">#</a></h1><p>Under the hood, OpenAPI heavily relies on JSON Schema Draft 00 for all the data model specifications. JSON Schema Draft 00 defines data types that are not implemented in TypeScript. A great example are integers. If we want to communicate that a number must be an integer, tsoa will specify this in the OAS and validate incoming requests against that.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>As always, <em>$ref</em> restrictions apply</p></div><p>In general, the JSDoc notation is very similar each time:</p><div class="language-"><button class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">@&lt;keyword&gt; &lt;argument&gt;* &lt;rejectionMessage&gt;?</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>For parameters, use the <code>@&lt;keyword&gt; &lt;paramName&gt; &lt;argument&gt;* &lt;rejectionMessage&gt;?</code> syntax in your JSDoc (similar to <a href="#parameter-descriptions">descriptions</a> or <a href="#parameter-examples">examples</a>)</p></div><p>Examples:</p><p><code>@isInt we would kindly ask you to provide a number here</code></p><p><code>@minLength 1 array must not be empty</code></p><p><code>@maximum headerParameter 4 number must be &lt;4</code></p><h3 id="list-of-supported-keywords-with-arguments" tabindex="-1">List of supported keywords (with arguments) <a class="header-anchor" href="#list-of-supported-keywords-with-arguments" aria-hidden="true">#</a></h3><p><a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#properties" target="_blank" rel="noreferrer">Click here for the list of keywords supported by OpenAPI 3</a></p><h4 id="generic" tabindex="-1">Generic <a class="header-anchor" href="#generic" aria-hidden="true">#</a></h4><ul><li>default</li><li>format</li></ul><div class="danger custom-block"><p class="custom-block-title">DANGER</p><p>Formats will generally not be validated, except for <code>format: date(time)</code>, which will automatically be generated for TS type <code>Date</code>.</p></div><h4 id="date" tabindex="-1">Date <a class="header-anchor" href="#date" aria-hidden="true">#</a></h4><ul><li>isDateTime for setting custom error messages</li><li>isDate for setting custom error messages</li><li>minDate</li><li>maxDate</li></ul><h4 id="numeric" tabindex="-1">Numeric <a class="header-anchor" href="#numeric" aria-hidden="true">#</a></h4><ul><li><strong>isInt (tsoa special since TS does not know integer as a type)</strong></li><li><strong>isFloat (tsoa special since TS does not know integer as a type)</strong></li><li>minimum</li><li>maximum</li></ul><h4 id="string" tabindex="-1">String <a class="header-anchor" href="#string" aria-hidden="true">#</a></h4><ul><li>isString for setting custom error messages</li><li>minLength</li><li>maxLength</li><li>pattern</li></ul><h4 id="array" tabindex="-1">Array <a class="header-anchor" href="#array" aria-hidden="true">#</a></h4><ul><li>isArray for setting custom error messages</li><li>minItems</li><li>maxItems</li><li>uniqueItems</li></ul><h4 id="boolean" tabindex="-1">Boolean <a class="header-anchor" href="#boolean" aria-hidden="true">#</a></h4><ul><li>isBool for setting custom error messages</li></ul>`,25),o=[r];function n(l,d,c,p,m,h){return t(),a("div",null,o)}const f=e(i,[["render",n]]);export{g as __pageData,f as default};