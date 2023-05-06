import { User as UserPrisma } from '@prisma/client';
import { Exclude } from 'class-transformer';

class User implements UserPrisma {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;
}

export { User };
