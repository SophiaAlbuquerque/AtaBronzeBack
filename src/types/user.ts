import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  user: Omit<User, 'passwordHash'>;
}
