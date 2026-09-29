const { PrismaClient } = require('@prisma/client');

// Initialize a single PrismaClient instance across the app
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

module.exports = prisma;
