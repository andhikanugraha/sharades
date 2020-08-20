module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: false,
        exclude: ['@babel/plugin-transform-regenerator'],
      },
    ],
  ],
};
