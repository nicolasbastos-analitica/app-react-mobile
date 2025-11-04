// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Mantém apenas o plugin do Reanimated, necessário para animações
      'react-native-reanimated/plugin',
    ],
  };
};
