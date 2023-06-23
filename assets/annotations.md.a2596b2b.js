import{_ as e,c as s,o as a,V as t}from"./chunks/framework.7b697f60.js";const h=JSON.parse('{"title":"JSON Schema / tsoa keyword annotations","description":"","frontmatter":{},"headers":[],"relativePath":"annotations.md","filePath":"annotations.md"}'),l={name:"annotations.md"},o=t(`<h1 id="json-schema-tsoa-keyword-annotations" tabindex="-1">JSON Schema / tsoa keyword annotations <a class="header-anchor" href="#json-schema-tsoa-keyword-annotations" aria-label="Permalink to &quot;JSON Schema / tsoa keyword annotations&quot;">​</a></h1><p>Under the hood, OpenAPI heavily relies on JSON Schema Draft 00 for all the data model specifications. JSON Schema Draft 00 defines data types that are not implemented in TypeScript. A great example are integers. If we want to communicate that a number must be an integer, tsoa will specify this in the OAS and validate incoming requests against that.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>As always, <em>$ref</em> restrictions apply</p></div><p>In general, the JSDoc notation is very similar each time:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">@&lt;keyword&gt; &lt;argument&gt;* &lt;rejectionMessage&gt;?</span></span></code></pre></div><p>Examples:</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">CustomerDto</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">     * </span><span style="color:#89DDFF;font-style:italic;">@</span><span style="color:#C792EA;font-style:italic;">isInt</span><span style="color:#676E95;font-style:italic;"> we would kindly ask you to provide a number here</span></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">     * </span><span style="color:#89DDFF;font-style:italic;">@</span><span style="color:#C792EA;font-style:italic;">minimum</span><span style="color:#676E95;font-style:italic;"> minimum age is 18</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">     * </span><span style="color:#89DDFF;font-style:italic;">@</span><span style="color:#C792EA;font-style:italic;">minLength</span><span style="color:#676E95;font-style:italic;"> 1 at least 1 category is required</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">tags</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line highlighted"><span style="color:#676E95;font-style:italic;">     * </span><span style="color:#89DDFF;font-style:italic;">@</span><span style="color:#C792EA;font-style:italic;">pattern</span><span style="color:#676E95;font-style:italic;"> ^(.+)@(.+)$ please provide correct email</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">email</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>For parameters, use the <code>@&lt;keyword&gt; &lt;paramName&gt; &lt;argument&gt;* &lt;rejectionMessage&gt;?</code> syntax in your JSDoc (similar to <a href="#parameter-descriptions">descriptions</a> or <a href="#parameter-examples">examples</a>)</p></div><h2 id="list-of-supported-keywords-with-arguments" tabindex="-1">List of supported keywords (with arguments) <a class="header-anchor" href="#list-of-supported-keywords-with-arguments" aria-label="Permalink to &quot;List of supported keywords (with arguments)&quot;">​</a></h2><p><a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#properties" target="_blank" rel="noreferrer">Click here for the list of keywords supported by OpenAPI 3</a></p><h3 id="generic" tabindex="-1">Generic <a class="header-anchor" href="#generic" aria-label="Permalink to &quot;Generic&quot;">​</a></h3><ul><li><code>@default</code></li><li><code>@format</code></li></ul><div class="danger custom-block"><p class="custom-block-title">DANGER</p><p>Formats will generally not be validated, except for <code>format: date(time)</code>, which will automatically be generated for TS type <code>Date</code>.</p></div><h3 id="date" tabindex="-1">Date <a class="header-anchor" href="#date" aria-label="Permalink to &quot;Date&quot;">​</a></h3><ul><li><code>@isDateTime &lt;errMsg&gt;</code> for setting custom error messages</li><li><code>@isDate &lt;errMsg&gt;</code> for setting custom error messages</li><li><code>@minDate &lt;errMsg&gt;</code></li><li><code>@maxDate &lt;errMsg&gt;</code></li></ul><h3 id="numeric" tabindex="-1">Numeric <a class="header-anchor" href="#numeric" aria-label="Permalink to &quot;Numeric&quot;">​</a></h3><ul><li><code>@isInt &lt;errMsg&gt;</code> <strong>tsoa special</strong> since TS does not know integer as a type</li><li><code>@isFloat &lt;errMsg&gt;</code> <strong>tsoa special</strong> since TS does not know integer as a type</li><li><code>@isLong &lt;errMsg&gt;</code></li><li><code>@isDouble &lt;errMsg&gt;</code></li><li><code>@minimum &lt;number&gt; &lt;errMsg&gt;</code></li><li><code>@maximum &lt;number&gt; &lt;errMsg&gt;</code></li></ul><h3 id="string" tabindex="-1">String <a class="header-anchor" href="#string" aria-label="Permalink to &quot;String&quot;">​</a></h3><ul><li><code>@isString &lt;errMsg&gt;</code> for setting custom error messages</li><li><code>@minLength &lt;number&gt; &lt;errMsg&gt;</code></li><li><code>@maxLength &lt;number&gt; &lt;errMsg&gt;</code></li><li><code>@pattern &lt;regex&gt; &lt;errMsg&gt;</code></li></ul><h3 id="array" tabindex="-1">Array <a class="header-anchor" href="#array" aria-label="Permalink to &quot;Array&quot;">​</a></h3><ul><li><code>isArray &lt;errMsg&gt;</code> for setting custom error messages</li><li><code>minItems &lt;number&gt; &lt;errMsg&gt;</code></li><li><code>maxItems &lt;number&gt; &lt;errMsg&gt;</code></li><li><code>uniqueItems &lt;errMsg&gt;</code></li></ul><h3 id="boolean" tabindex="-1">Boolean <a class="header-anchor" href="#boolean" aria-label="Permalink to &quot;Boolean&quot;">​</a></h3><ul><li><code>isBool &lt;errMsg&gt;</code> for setting custom error messages</li></ul>`,23),n=[o];function i(r,c,p,d,g,m){return a(),s("div",null,n)}const u=e(l,[["render",i]]);export{h as __pageData,u as default};
