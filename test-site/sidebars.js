/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Guides',
      items: ['guides/getting-started', 'guides/configuration', 'guides/deployment'],
    },
    {
      type: 'category',
      label: 'API',
      items: ['api/overview', 'api/search-api'],
    },
  ],
};

module.exports = sidebars;
