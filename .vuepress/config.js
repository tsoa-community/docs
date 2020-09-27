module.exports = {
  title: "tsoa",
  base: process.env.BASE_URL || "/",
  markdown: {},
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
        link: "https://tsoa-community.github.io/reference/index.html",
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
        title: "Advanced Guides",
        collapsable: false,
        children: ["file-upload", "path-mapping", "templates", "routes"],
      },
      "upgrading",
    ],
  },
};
