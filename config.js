/**
 * Configuration Loader
 * =============================================================================
 */


var env = process.env.NODE_ENV || 'development';

var config ={};
/**
 * ## Database
 */

config.REDIS = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: process.env.REDIS_PORT || 6379,
  AUTH: process.env.REDIS_AUTH || ''
};

module.exports = config;
