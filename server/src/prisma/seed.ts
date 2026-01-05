// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.org.upsert({
    where: { name: "DefaultOrg" },
    update: {},
    create: { name: "DefaultOrg" },
  });

  const adminEmail = "admin@example.com";
  const adminPassword = "Admin123!";
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      orgId: org.id,
    },
  });

  console.log(`Seeded org ${org.name} with admin ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
