const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.resolver.blockList = [
    /node_modules\/.*\/node_modules/,
    /\/\.git\//,
    /\/dist\//,
    /\/build\//,
    /\.expo\//,
  ];
  return config;
})();