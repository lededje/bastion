import Knex from 'knex';
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

  onUpdateTrigger: (table: string) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
};
