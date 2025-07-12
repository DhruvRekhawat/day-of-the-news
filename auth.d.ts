import 'better-auth';
import 'better-auth/jwt';
import { Role } from '@prisma/client';

declare module 'better-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module 'better-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}
