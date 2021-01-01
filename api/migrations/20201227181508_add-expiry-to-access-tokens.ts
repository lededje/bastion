import * as Knex from "knex";


export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table('access_tokens', (AccessTokens) => {
    AccessTokens.timestamp('expires_at');
    AccessTokens.timestamp('revoked_at');
  });
}


export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table('access_tokens', (AccessTokens) => {
    AccessTokens.dropColumns('expires_at', 'revoked_at');
  });
}

