module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // jsxImportSource 让 JSX 支持 className 属性
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
