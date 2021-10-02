import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import type { SidebarConfigArray } from "@vuepress/theme-default";

const sidebar: SidebarConfigArray = [
  {
    text: "Introduction",
    link: "introduction",
  },
  {
    text: "Getting started",
    link: "getting-started",
  },
  {
    text: "Guides",
    children: [
      "generating",
      "live-reloading",
      "error-handling",
      "descriptions",
      "examples",
      "annotations",
      "di",
      "authentication",
      "decorators",
    ],
  },
  "faq",
  {
    text: "Advanced Guides",
    children: ["file-upload", "path-mapping", "templates", "routes"],
  },
  "upgrading",
];

export default defineUserConfig<DefaultThemeOptions>({
  title: "tsoa",
  base: process.env.BASE_URL || "/",
  markdown: {},
  plugins: [
    "@vuepress/plugin-medium-zoom",
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-pwa",
  ],
  themeConfig: {
    smoothScroll: true,
    navbar: [
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
