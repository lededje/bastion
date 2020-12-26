import type Knex from 'knex';
import knexfile from '../config/knexfile';

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`

export const up = async (knex: Knex) => {
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.schema.createTable('users', (Users) => {
    Users.increments('id');
    Users.string('email');
    Users.string('name');
    Users.timestamps(true, true);
    
    Users.unique(['email'], 'users_email_unique');
  });

  await knex.raw(knexfile.onUpdateTrigger('users'))
}

export const down = async (knex: Knex) => {
  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.schema.dropTable('users');
}