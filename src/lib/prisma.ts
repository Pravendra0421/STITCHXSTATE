// This file is responsible for creating a Prisma Client instance
// that can be used throughout the application.
// It ensures that the Prisma Client is only instantiated once in development mode 
// In Production: we create one efficient, long-lived database connection.
// to avoid exhausting database connections.
// It also exports the Prisma Client instance for use in other parts of the application.
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

