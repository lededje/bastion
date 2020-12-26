declare module 'knex/types/tables' {
  interface User {
    id: number;
    name: string;
    email: string;
    verified: boolean;
    created_at: string;
    updated_at: string;
  }
  
  interface Tables {
    users: User;
  }
}