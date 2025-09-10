const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  config.resolve.alias['../Utilities/Platform'] =
    'react-native-web/dist/exports/Platform'
  
  // Add fallback for Node.js modules in browser environment
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
  }
  
  return config
}
