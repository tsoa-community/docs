import { defineConfig, DefaultTheme } from "vitepress";

const sidebar: DefaultTheme.Sidebar = [
  { items: [{ text: "Introduction", link: "/introduction" }] },
  {
    text: "Guides",
    items: [
      { text: "Getting Started", link: "/getting-started" },
      { text: "Generating", link: "/generating" },
      { text: "Live reloading", link: "/live-reloading" },
      { text: "Error handling", link: "/error-handling" },
      { text: "Descriptions", link: "/descriptions" },
      { text: "Examples", link: "/examples" },
      { text: "Annotations", link: "/annotations" },
      { text: "Custom Middlewares", link: "/custom-middlewares" },
      { text: "Dependency Injection", link: "/di" },
      { text: "Authentication", link: "/authentication" },
      { text: "Decorators", link: "/decorators" },
    ],
  },
  {
    items: [{ text: "FAQ", link: "/faq" }],
  },
  {
    text: "Advanced Guides",
    items: [
      { text: "File upload", link: "/file-upload" },
      { text: "Path mapping", link: "/path-mapping" },
      { text: "Templates", link: "/templates" },
      { text: "Routes", link: "/routes" },
    ],
  },
];

export default defineConfig({
  title: "tsoa",
  base: process.env.BASE_URL || "/",
  markdown: {},
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      {
        text: "Home",
        link: "/",
      },
      {
        text: "Guides",
        link: "/introduction",
      },
      {
        text: "API Reference",
        link: "https://tsoa-community.github.io/reference/index.html",
      },
      {
        text: "GitHub",
        link: "https://github.com/lukeautry/tsoa",
      },
    ],
    sidebar,
  },
});
