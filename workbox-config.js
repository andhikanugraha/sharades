module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    'assets/**',
    'fonts/**',
    'img/**',
    '*.{ico,html,json}',
  ],
  swDest: 'dist/assets/sw.js',
  sourcemap: false,
  offlineGoogleAnalytics: false,
  mode: 'production',
};
