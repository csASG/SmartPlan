import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    const anyUser = await prisma.user.findFirst();
    console.log('✅ Connected', anyUser ? 'Found user' : 'No user found');
  } catch (err) {
    console.error('Prisma verification failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
