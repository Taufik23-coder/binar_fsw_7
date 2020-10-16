require('dotenv').config()

module.exports = {
  development: {
    username: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB_DEV,
    host: process.env.HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB_TEST,
    host: process.env.HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.USER_PROD,
    password: process.env.PASS_PROD,
    database: process.env.DB_PROD,
    host: process.env.HOST_PROD,
    dialect: 'postgres',
    protocol: 'postgres',
    port: '5432',
    production: {
      use_env_variable: 'DATABASE_URL',
    },
  },
}
