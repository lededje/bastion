const config = {
  client: 'pg',
  connection: process.env.DB_PATH,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../migrations',
  },
  seeds: {
    directory: '../seeds',
  }
};

export default {
  development: {
    ...config,
    debug: true,
  },
  staging: config,
  production: config,
};
