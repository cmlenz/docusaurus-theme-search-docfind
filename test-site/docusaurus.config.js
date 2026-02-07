// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DocFind Test Site',
  tagline: 'Testing docusaurus-theme-search-docfind',
  url: 'http://localhost',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {},
      }),
    ],
  ],

  themes: ['docusaurus-theme-search-docfind'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'DocFind Test',
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
        ],
      },
    }),
};

module.exports = config;
