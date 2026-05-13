import { usersRepository } from "../users/users.dependencies";
import { CompatibilityService } from "./compatibility.service";

const compatibilityService = new CompatibilityService(usersRepository);

export { compatibilityService };
