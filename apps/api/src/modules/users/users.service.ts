import { devStore } from "../../lib/dev-store.js";
import { prisma } from "../../lib/prisma.js";

export async function listUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    return devStore.listUsers();
  }
}
