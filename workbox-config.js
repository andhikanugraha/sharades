module.exports = {
  globDirectory: 'docs/',
  globPatterns: [
    'assets/**',
    'fonts/**',
    'img/**',
    '*.{ico,html,json}',
  ],
  swDest: 'docs/assets/sw.js',
  sourcemap: false,
  offlineGoogleAnalytics: false,
  mode: 'production',
};
