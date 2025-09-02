module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // "nativewind/babel", // Você pode descomentar isso se estiver usando nativewind
    ],
  };
};