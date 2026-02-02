import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testLogin() {
    const email = 'admin@sporthub.com';
    const password = 'Admin@123';

    console.log('🔍 Testing login for:', email);

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User not found!');
        return;
    }

    console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        provider: user.provider,
        hasPassword: !!user.password,
    });

    // Test password
    if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔑 Password match:', isMatch);

        if (!isMatch) {
            console.log('❌ Password does not match!');
            console.log('Trying to hash the password to see what it should be:');
            const correctHash = await bcrypt.hash(password, 10);
            console.log('Expected hash format:', correctHash.substring(0, 20) + '...');
            console.log('Actual hash format:', user.password.substring(0, 20) + '...');
        } else {
            console.log('✅ Password is correct!');
        }
    } else {
        console.log('❌ User has no password set!');
    }

    await prisma.$disconnect();
}

testLogin().catch(console.error);
