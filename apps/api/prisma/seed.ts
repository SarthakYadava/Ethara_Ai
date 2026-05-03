import bcrypt from "bcryptjs";
import { PrismaClient, TaskPriority, TaskStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const memberPassword = await bcrypt.hash("Member@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Aarav Admin",
      email: "admin@demo.com",
      passwordHash: adminPassword,
      role: UserRole.ADMIN
    }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@demo.com" },
    update: {},
    create: {
      name: "Maya Member",
      email: "member@demo.com",
      passwordHash: memberPassword,
      role: UserRole.MEMBER
    }
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project-command-center" },
    update: {},
    create: {
      id: "demo-project-command-center",
      name: "Launch Command Center",
      description: "Demo workspace for project health, ownership, and delivery tracking.",
      members: {
        create: [{ userId: admin.id }, { userId: member.id }]
      }
    }
  });

  const existingTasks = await prisma.task.count({ where: { projectId: project.id } });

  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Finalize launch checklist",
          description: "Confirm owner, deadline, and acceptance notes before launch.",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          projectId: project.id,
          assigneeId: member.id,
          creatorId: admin.id
        },
        {
          title: "Review blocked onboarding flow",
          description: "Identify why signup confirmation is waiting on copy approval.",
          status: TaskStatus.BLOCKED,
          priority: TaskPriority.URGENT,
          dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
          projectId: project.id,
          assigneeId: admin.id,
          creatorId: admin.id
        },
        {
          title: "Publish handoff notes",
          description: "Summarize project context for the delivery team.",
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          projectId: project.id,
          assigneeId: member.id,
          creatorId: admin.id
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
