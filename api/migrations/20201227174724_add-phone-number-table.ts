import type Knex from 'knex';
import knexfile from '../config/knexfile';

export const up = async (knex: Knex) => {

  await knex.schema.createTable('phone_numbers', (PhoneNumbers) => {
    PhoneNumbers.increments('id');
    PhoneNumbers.integer('user_id');
    PhoneNumbers.string('phone_number');
    
    PhoneNumbers.timestamps(true, true);
    
    PhoneNumbers.foreign('user_id').references('users.id');
  });

  await knex.raw(knexfile.onUpdateTrigger('phone_numbers'))
}

export const down = async (knex: Knex) => {
  await knex.schema.dropTable('phone_numbers');
}