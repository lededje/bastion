import Knex from "knex";
import { AccessToken, User, PhoneNumber } from "./Tables";
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

    phone_numbers: PhoneNumber;
    phone_numbers_composite: Knex.CompositeTableType<
      PhoneNumber,
      Pick<PhoneNumber, 'id'> & Partial<Pick<PhoneNumber, 'created_at' | 'updated_at'>>,
      Partial<Omit<PhoneNumber, 'id'>>
    >
  }
}