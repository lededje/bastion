import * as Knex from "knex";


export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table('users', (Users) => {
    Users.boolean('verified').defaultTo(false);
  });
}


export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table('users', (Users) => {
    Users.dropColumn('verified');
  });
}

