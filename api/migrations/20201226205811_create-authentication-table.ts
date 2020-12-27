import type Knex from 'knex';
import knexfile from '../config/knexfile';

export const up = async (knex: Knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable('access_tokens', (AccessTokens) => {
    AccessTokens.increments('id');
    AccessTokens.integer('user_id');
    AccessTokens.uuid('request_token')
      .defaultTo(knex.raw('uuid_generate_v4()'));
    AccessTokens.uuid('access_token');
    AccessTokens.timestamps(true, true);
    
    AccessTokens.foreign('user_id').references('users.id');
  });

  await knex.raw(knexfile.onUpdateTrigger('access_tokens'))
}

export const down = async (knex: Knex) => {
  await knex.schema.dropTable('access_tokens');
  await knex.raw('DROP EXTENSION "uuid-ossp";')
}