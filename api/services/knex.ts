import knex from 'knex';

import config from '../config/knexfile';

const connection = knex(config.production);

export default connection;