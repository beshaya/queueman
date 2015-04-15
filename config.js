/**
 * Configuration Loader
 * =============================================================================
 */

var env = process.env.NODE_ENV || 'development';

var config = {
  NODE_ENV: env,
  APP_NAME: process.env.APP_NAME || 'Mimo',
};


/**
 * ## Servers
 */

config.EVE = {
  PORT: process.env.EVE_PORT || 4000
};

config.FLIK = {
  PORT: process.env.FLIK_PORT || 6000
};

config.ANNOUNCER = {
  PORT: process.env.ANNOUNCER_PORT || 5000
};

config.BIGBIRD = {
  APN: {
    CERT: process.env.BIGBIRD_APN_CERT || null,
    KEY: process.env.BIGBIRD_APN_KEY || null
  },
  GCM: {
    API_KEY: process.env.BIGBIRD_GCM_API_KEY || '',
    RETRIES: process.env.BIGBIRD_GCM_RETRIES || 4
  }
};

config.MOE = {
  TIMEOUT: process.env.MOE_TIMEOUT || 5000
};

config.ACCOUNTS = {
  PORT: process.env.ACCOUNTS_PORT || 7000
};

/**
 * ## URLs
 */

config.URL = {
  API: process.env.URL_API || 'http://api.monitor.mimobaby.com',
  DATA: process.env.URL_DATA || 'http://data.monitor.mimobaby.com',
  ACCOUNTS: process.env.URL_ACCOUNTS || 'http://accounts.mimobaby.com',
  APP: process.env.URL_APP || 'http://app.monitor.mimobaby.com'
};


/**
 * ## Database
 */

config.REDIS = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: process.env.REDIS_PORT || 6379,
  AUTH: process.env.REDIS_AUTH || ''
};

config.MONGO = {
  URI: process.env.MONGO_URI || 'mongodb://localhost/mimo'
};

config.SEGMENT = {
  WRITE_KEY: process.env.SEGMENT_WRITE_KEY || ''
};


/**
 * Mailgun
 */

config.MAILGUN = {
  USER: process.env.MAILGUN_USER || 'no-reply@mimobaby.com',
  PASS: process.env.MAILGUN_PASS || ''
};

/**
 * ## Turtle Data Types
 */
config.TURTLE = {
  PACKETTYPE: {
    DATA: 0,
    CHARGE: 1
  },

  MODE: {
    OFF: 0,
    CHARGING: 1,
    DATA: 2
  },

  POSITION: {
    UPRIGHT: 0,
    BACK: 1,
    STOMACH: 2,
    SIDE: 3
  },

  ACTIVITY: {
    SLEEP: 0,
    AWAKE: 1,
    ACTIVE: 2
  }
};

module.exports = config;