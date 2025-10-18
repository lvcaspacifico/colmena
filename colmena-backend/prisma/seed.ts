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

  const doneLabel = labels[2];

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
        name: 'Marketing Campaign Q2 2025',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-30'),
      },
    }),
    prisma.project.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Marketing Campaign Q3 2025',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-09-30'),
      },
    }),
    prisma.project.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Marketing Campaign Q4 2025',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.project.upsert({
      where: { id: 6 },
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

  await Promise.all([
    prisma.projectLabel.upsert({
      where: {
        projectId_labelId: {
          projectId: projects[1].id,
          labelId: doneLabel.id,
        },
      },
      update: {},
      create: {
        projectId: projects[1].id,
        labelId: doneLabel.id,
      },
    }),
    prisma.projectLabel.upsert({
      where: {
        projectId_labelId: {
          projectId: projects[2].id,
          labelId: doneLabel.id,
        },
      },
      update: {},
      create: {
        projectId: projects[2].id,
        labelId: doneLabel.id,
      },
    }),
  ]);

  console.log('✅ Project-Label relationships created (DONE for Q1 and Q2)');

  const tasksData = [
    { projectId: projects[0].id, title: 'Setup Development Environment', content: '# Development Setup\n\nInstall all necessary tools and configure the development environment.\n\n- Node.js\n- Docker\n- VSCode extensions', startDate: new Date('2025-01-16'), endDate: new Date('2025-01-20') },
    { projectId: projects[0].id, title: 'Implement User Authentication', content: '# User Authentication\n\nImplement JWT-based authentication system with the following features:\n\n- Login\n- Logout\n- Token refresh\n- Password reset', startDate: new Date('2025-01-21'), endDate: new Date('2025-02-10') },
    { projectId: projects[1].id, title: 'Create Social Media Content Calendar', content: '# Q1 Social Media Calendar\n\nPlan and schedule all social media posts for Q1 2025.\n\n**Platforms:**\n- Instagram\n- Twitter\n- LinkedIn', startDate: new Date('2025-01-05'), endDate: new Date('2025-01-15') },
    { projectId: projects[1].id, title: 'Launch Email Marketing Campaign', content: '# Email Campaign Q1\n\nDesign and launch the quarterly email marketing campaign.\n\n**Goals:**\n- 10K subscribers\n- 25% open rate\n- 5% conversion rate', startDate: new Date('2025-01-20'), endDate: new Date('2025-02-28') },
    { projectId: projects[2].id, title: 'Design Q2 Marketing Materials', content: '# Q2 Marketing Design\n\nCreate all visual assets for Q2 campaigns:\n\n- Banner ads\n- Social media graphics\n- Email templates', startDate: new Date('2025-04-05'), endDate: new Date('2025-04-20') },
    { projectId: projects[2].id, title: 'Plan Influencer Partnerships', content: '# Influencer Marketing Q2\n\nIdentify and reach out to potential influencer partners.\n\n**Target:** 5-10 micro-influencers in tech space', startDate: new Date('2025-04-10'), endDate: new Date('2025-05-15') },
    { projectId: projects[3].id, title: 'Summer Campaign Strategy', content: '# Summer Campaign\n\nDevelop comprehensive strategy for summer marketing push.\n\n**Focus:** Product launches and seasonal promotions', startDate: new Date('2025-07-05'), endDate: new Date('2025-07-20') },
    { projectId: projects[3].id, title: 'Video Content Production', content: '# Q3 Video Content\n\nProduce video content for Q3:\n\n- 3 product demos\n- 5 customer testimonials\n- 2 behind-the-scenes videos', startDate: new Date('2025-07-15'), endDate: new Date('2025-08-30') },
    { projectId: projects[4].id, title: 'Holiday Campaign Planning', content: '# Holiday Marketing Q4\n\nPlan comprehensive holiday season campaigns.\n\n**Events:**\n- Black Friday\n- Cyber Monday\n- End of year sales', startDate: new Date('2025-10-05'), endDate: new Date('2025-10-25') },
    { projectId: projects[4].id, title: 'Year-End Performance Review', content: '# 2025 Marketing Review\n\nAnalyze all marketing efforts throughout 2025.\n\n**Metrics to review:**\n- ROI\n- Engagement rates\n- Conversion rates\n- Customer acquisition cost', startDate: new Date('2025-12-01'), endDate: new Date('2025-12-20') },
    { projectId: projects[5].id, title: 'Database Optimization', content: '# Database Performance\n\nOptimize database queries and improve indexing.\n\n**Expected improvements:**\n- 50% faster queries\n- Reduced server load', startDate: new Date('2025-02-05'), endDate: new Date('2025-03-01') },
    { projectId: projects[5].id, title: 'Implement Caching Layer', content: '# Redis Caching\n\nImplement Redis caching for frequently accessed data.\n\n**Benefits:**\n- Faster response times\n- Reduced database load\n- Better scalability', startDate: new Date('2025-02-15'), endDate: new Date('2025-03-15') },
  ];

  const tasks = await Promise.all(
    tasksData.map((taskData, index) =>
      prisma.task.upsert({
        where: { id: index + 1 },
        update: {},
        create: taskData,
      })
    )
  );

  console.log('✅ Tasks created:', tasks.length);

  function getRandomUsers(count: number) {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  await Promise.all(
    tasks.flatMap((task) => {
      const assignedUsers = getRandomUsers(Math.floor(Math.random() * 2) + 1);
      return assignedUsers.map((user) =>
        prisma.userTask.upsert({
          where: {
            userId_taskId: {
              userId: user.id,
              taskId: task.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            taskId: task.id,
          },
        })
      );
    })
  );

  console.log('✅ User-Task relationships created (random assignments)');

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