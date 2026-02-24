const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'mjs' to the supported extensions to resolve the @iabtcf/core dependency error
config.resolver.sourceExts.push('mjs');

module.exports = config;
