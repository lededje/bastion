import type Knex from 'knex';
import knexfile from '../config/knexfile';

export const up = async (knex: Knex) => {
  await knex.schema.createTable('messages', (Messages) => {
    Messages.increments('id');
    Messages.string('sid')
    
    Messages.integer('to_phone_number_id');
    
    Messages.string('body')

    Messages.string('from_city')
    Messages.string('from_zip')
    Messages.string('from_country')
    Messages.string('from_phone_number')
    
    Messages.timestamps(true, true);

    Messages.foreign('to_phone_number_id').references('phone_numbers.id');
  });

  await knex.raw(knexfile.onUpdateTrigger('messages'))
}

export const down = async (knex: Knex) => {
  await knex.schema.dropTable('messages');
}