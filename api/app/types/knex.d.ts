import Knex from "knex";
import { AccessToken, User } from "./Tables";
declare module 'knex/types/tables' {  
  interface Tables {
    users: User;
    users_composite: Knex.CompositeTableType<
      User,
      Pick<User, 'name'> & Partial<Pick<User, 'created_at' | 'updated_at'>>,
      Partial<Omit<User, 'id'>>
    >

    access_tokens: AccessToken;
    access_tokens_composite: Knex.CompositeTableType<
      AccessToken,
      Pick<AccessToken, 'id'> & Partial<Pick<AccessToken, 'created_at' | 'updated_at'>>,
      Partial<Omit<AccessToken, 'id'>>
    >
  }
}