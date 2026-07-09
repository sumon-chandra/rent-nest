import { User } from "../../../generated/prisma/client";

export type UserDto = Pick<User, "name" | "avatar" | "phone">;
