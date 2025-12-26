const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('prisma.course:', !!prisma.course);
console.log('prisma.Course:', !!prisma.Course);
console.log('Keys:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
