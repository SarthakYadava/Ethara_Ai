import { AppError } from "../middleware/error-handler.js";

export function routeParam(value: string | string[] | undefined, name: string) {
  if (typeof value !== "string") {
    throw new AppError(400, `Missing route parameter: ${name}`);
  }

  return value;
}
