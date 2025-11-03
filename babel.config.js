// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Este é o plugin do Tamagui que estava faltando
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],

      // Este plugin é para as animações (Gesture Handler, etc.)
      'react-native-reanimated/plugin',
    ],
  };
};