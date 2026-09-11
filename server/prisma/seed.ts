import prisma from "../src/lib/db.js";

async function main() {
  await prisma.plan.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "FREE",
        price: 0,
        maxWorkspaces: 3,
        maxSourcesPerWorkspace: 10,
        maxAiQueries: 50,
        webSearchEnabled: false,
      },
      {
        name: "PRO",
        price: 299,
        maxWorkspaces: 20,
        maxSourcesPerWorkspace: 50,
        maxAiQueries: 500,
        webSearchEnabled: true,
      },
      {
        name: "PREMIUM",
        price: 499,
        maxWorkspaces: 50,
        maxSourcesPerWorkspace: 100,
        maxAiQueries: 1000,
        webSearchEnabled: true,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
