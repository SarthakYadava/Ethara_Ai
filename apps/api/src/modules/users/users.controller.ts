import { asyncHandler } from "../../utils/async-handler.js";
import * as usersService from "./users.service.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await usersService.listUsers();
  res.json({ users });
});
