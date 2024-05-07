import { User } from '@/users/entities/user.entity';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
    }
  }
}
declare namespace Express {
  export interface Request {
    userId?: string;
    email?: string;
    user?: User;
  }
}
