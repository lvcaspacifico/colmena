import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await hash('Colmenaplayers2025@!', 8);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'lucas@colmena.com' },
      update: {},
      create: {
        nickname: 'Lucas [ADMIN]',
        email: 'lucas@colmena.com',
        password: hashedPassword,
        roleCode: 1,
        birthdate: new Date('1995-06-15'),
      },
    }),
    prisma.user.upsert({
      where: { email: 'john@colmena.com' },
      update: {},
      create: {
        nickname: 'John [ADMIN]',
        email: 'john@colmena.com',
        password: hashedPassword,
        roleCode: 1,
        birthdate: new Date('1992-03-22'),
      },
    }),
    prisma.user.upsert({
      where: { email: 'nampe@colmena.com' },
      update: {},
      create: {
        nickname: 'Nampe [ADMIN]',
        email: 'nampe@colmena.com',
        password: hashedPassword,
        roleCode: 1,
        birthdate: new Date('1998-11-08'),
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  const labels = await Promise.all([
    prisma.label.upsert({
      where: { id: 1 },
      update: {},
      create: {
        type: 1,
        name: 'TO DO',
        color: '#3B82F6',
      },
    }),
    prisma.label.upsert({
      where: { id: 2 },
      update: {},
      create: {
        type: 1,
        name: 'DOING',
        color: '#F59E0B',
      },
    }),
    prisma.label.upsert({
      where: { id: 3 },
      update: {},
      create: {
        type: 1,
        name: 'DONE',
        color: '#10B981',
      },
    }),
    prisma.label.upsert({
      where: { id: 4 },
      update: {},
      create: {
        type: 1,
        name: 'BACKLOG',
        color: '#6B7280',
      },
    }),
  ]);

  console.log('✅ Labels created:', labels.length);

  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Colmena Platform Development',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.project.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Marketing Campaign Q1 2025',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
      },
    }),
    prisma.project.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Infrastructure Optimization',
        startDate: new Date('2025-02-01'),
        endDate: null,
      },
    }),
  ]);

  console.log('✅ Projects created:', projects.length);

  await Promise.all(
    users.flatMap((user) =>
      projects.map((project) =>
        prisma.userProject.upsert({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: project.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            projectId: project.id,
          },
        })
      )
    )
  );

  console.log('✅ User-Project relationships created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });