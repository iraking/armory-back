module.exports = {
  api: {
    port: '80',
  },

  db: {
    database: 'armory',
    username: 'admin',
    password: 'password',
    dialect: 'mysql',
  },

  gw2: {
    endpoint: 'https://api.guildwars2.com/',
  },

  jwtTokens: {
    secret: 'im-secret',
    expiresIn: 60,
  },

  allowedCors: [
    'https://gw2armory.com',
    'https://preview.gw2armory.com',
    'http://localhost:3000',
  ],

  gitter: {
    apiKey: process.env.GITTER_API_KEY,
  },

  email: {
    noreply: 'noreply@gw2armory.com',
    smtp: {
      user: process.env.SES_ACCESS_KEY_ID,
      password: process.env.SES_SECRET_ACCESS_KEY,
    },
  },

  PASSWORD_RESET_TIME_LIMIT: 5,

  web: {
    publicUrl: 'http://localhost:3000',
  },

  fetch: {
    concurrentCalls: 20,
    port: 8081,
    interval: 60000 * 60 * 8,
    retries: 5,
    verbose: true,
    host: process.env.FETCH_PORT_8081_TCP_ADDR,
  },

  leaderboards: {
    refreshInterval: 60000 * 60 * 24,
    latestSeasonCacheTtl: 60000 * 60 * 1,
    getCacheTtl: 60000 * 60 * 0.5,
  },

  cache: {
    findAllCharacters: 1,
    statistics: 1,
  },
};
