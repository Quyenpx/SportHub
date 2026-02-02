
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function main() {
    console.log('Attempting to connect to DB at:', process.env.DATABASE_URL);
    try {
        await prisma.$connect();
        console.log('✅ Connected successfully to the database!');
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
