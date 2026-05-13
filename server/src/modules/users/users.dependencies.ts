import { InMemoryUsersRepository } from "./in-memory-users.repository";
import { UsersService } from "./users.service";

const usersRepository = new InMemoryUsersRepository();
const usersService = new UsersService(usersRepository);

export { usersRepository, usersService };
