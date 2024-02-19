module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.fallback = { path:false, fs:false, crypto:false }

  return config;
}