module.exports = {
  title: "tsoa",
  base: process.env.BASE_URL || "/",
  markdown: {
    anchor: {
      permalink: false,
    },
  },
  plugins: [
    "@vuepress/medium-zoom",
    ["@vuepress/back-to-top", true],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
  ],
  themeConfig: {
    smoothScroll: true,
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
        link: "https://tsoa-community.github.io/reference/modules/_index_.html",
        position: "left",
      },
      {
        text: "GitHub",
        link: "https://github.com/lukeautry/tsoa",
        position: "left",
      },
    ],
    sidebar: [
      {
        title: "Introduction",
        path: "introduction",
      },
      {
        title: "Getting started",
        path: "getting-started",
      },
      {
        title: "Guides",
        collapsable: false,
        children: [
          "generating",
          "live-reloading",
          "error-handling",
          "di",
          "authentication",
          "decorators",
        ],
      },
      "faq",
      {
        title: "Advanced Guides",
        collapsable: false,
        children: ["file-upload", "path-mapping", "templates", "routes"],
      },
      "upgrading",
    ],
  },
};
