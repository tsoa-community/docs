import{_ as o,c as p,b as n,d as s,t as e,a,o as t}from"./app.3cf33814.js";const v=JSON.parse(`{"title":"Getting started","description":"","frontmatter":{"title":"Getting started","lang":"en-US"},"headers":[{"level":2,"title":"Initializing our project","slug":"initializing-our-project","link":"#initializing-our-project","children":[]},{"level":2,"title":"Configuring tsoa and typescript","slug":"configuring-tsoa-and-typescript","link":"#configuring-tsoa-and-typescript","children":[]},{"level":2,"title":"Defining our first model","slug":"defining-our-first-model","link":"#defining-our-first-model","children":[]},{"level":2,"title":"Defining a simple controller","slug":"defining-a-simple-controller","link":"#defining-a-simple-controller","children":[]},{"level":2,"title":"Creating our express server","slug":"creating-our-express-server","link":"#creating-our-express-server","children":[]},{"level":2,"title":"Building the routes file","slug":"building-the-routes-file","link":"#building-the-routes-file","children":[]},{"level":2,"title":"What's next?","slug":"what-s-next","link":"#what-s-next","children":[]}],"relativePath":"getting-started.md"}`),r={name:"getting-started.md"},c=a("",22),F=n("code",null,"getUser",-1),y=n("code",null,"createUser",-1),D=n("code",null,"@Get()",-1),i=n("code",null,"/users/",-1),C=n("em",null,"GET",-1),u=n("em",null,"{userId}",-1),A=a("",20);function d(l,h,g,m,f,q){return t(),p("div",null,[c,n("p",null,[s("Additionally, we define 2 methods: "),F,s(" and "),y,s(". The "),D,s(" decorator in combination with our base route "),i,s(" will tell tsoa to invoke this method for every "),C,s(" request to "),n("code",null,"/users/"+e(l.userId),1),s(", where "),u,s(" is a template.")]),A])}const E=o(r,[["render",d]]);export{v as __pageData,E as default};