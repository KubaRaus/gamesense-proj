import { InMemoryUsersRepository } from "./in-memory-users.repository";
import { PrismaUsersRepository } from "./prisma-users.repository";
import { UsersService } from "./users.service";
import { getDataProvider } from "../../shared/config/runtime-env";
import { prisma } from "../../shared/db/prisma-client";

const usersRepository =
  getDataProvider() === "prisma"
    ? new PrismaUsersRepository(prisma)
    : new InMemoryUsersRepository();
const usersService = new UsersService(usersRepository);

export { usersRepository, usersService };
