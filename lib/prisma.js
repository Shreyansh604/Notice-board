// import "dotenv/config";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "../generated/prisma";

// const adapter = new PrismaMariaDb({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: process.env.DATABASE_PORT,
//   connectionLimit: 5,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient({ adapter });
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient({ adapter });
//   }
//   prisma = global.prisma;
// }

// export default prisma;


import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const globalForPrisma = global;
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;