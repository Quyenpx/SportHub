import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@sporthub.com' },
        update: {},
        create: {
            email: 'admin@sporthub.com',
            password: adminPassword,
            fullName: 'System Administrator',
            phoneNumber: '0900000000',
            role: 'ADMIN',
            status: 'ACTIVE',
            provider: 'LOCAL',
        },
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('📧 Email: admin@sporthub.com');
    console.log('🔑 Password: Admin@123');
    console.log('');

    // Create sample player
    const playerPassword = await bcrypt.hash('Player@123', 10);

    const player = await prisma.user.upsert({
        where: { email: 'player@sporthub.com' },
        update: {},
        create: {
            email: 'player@sporthub.com',
            password: playerPassword,
            fullName: 'Test Player',
            phoneNumber: '0911111111',
            role: 'PLAYER',
            status: 'ACTIVE',
            provider: 'LOCAL',
        },
    });

    console.log('✅ Player user created:', player.email);
    console.log('📧 Email: player@sporthub.com');
    console.log('🔑 Password: Player@123');
    console.log('');

    // Create sample venue manager (pending)
    const managerPassword = await bcrypt.hash('Manager@123', 10);

    const manager = await prisma.user.upsert({
        where: { email: 'manager@sporthub.com' },
        update: {},
        create: {
            email: 'manager@sporthub.com',
            password: managerPassword,
            fullName: 'Test Venue Manager',
            phoneNumber: '0922222222',
            role: 'VENUE_MANAGER',
            status: 'PENDING',
            provider: 'LOCAL',
        },
    });


    // Create venue manager request
    const existingRequest = await prisma.venueManagerRequest.findFirst({
        where: { userId: manager.id },
    });

    if (!existingRequest) {
        await prisma.venueManagerRequest.create({
            data: {
                userId: manager.id,
                status: 'PENDING',
                businessName: 'Test Sports Complex',
                businessPhone: '0922222222',
                note: 'Sample venue manager for testing',
            },
        });
    }

    console.log('✅ Venue Manager user created (PENDING):', manager.email);
    console.log('📧 Email: manager@sporthub.com');
    console.log('🔑 Password: Manager@123');
    console.log('⏳ Status: PENDING (needs admin approval)');
    console.log('');

    console.log('🎉 Seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
