import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MatchesService {
    constructor(private prisma: DatabaseService) { }

    async create(data: Prisma.MatchCreateInput) {
        return this.prisma.match.create({ data });
    }

    async findAll() {
        return this.prisma.match.findMany({
            include: {
                host: true,
                players: { include: { user: true } }
            },
            orderBy: { startTime: 'asc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.match.findUnique({
            where: { id },
            include: {
                host: true,
                players: { include: { user: true } }
            },
        });
    }

    async joinMatch(matchId: string, userId: string) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { players: true }
        });

        if (!match) throw new NotFoundException('Kèo đấu không tồn tại');
        if (match.status !== 'OPEN') throw new BadRequestException('Kèo đấu đã đóng hoặc đầy');
        if (match.players.length >= match.maxPlayers) throw new BadRequestException('Kèo đấu đã đủ người');

        const existingPlayer = await this.prisma.matchPlayer.findFirst({
            where: { matchId, userId }
        });

        if (existingPlayer) throw new BadRequestException('Bạn đã tham gia kèo này rồi');

        return this.prisma.matchPlayer.create({
            data: {
                match: { connect: { id: matchId } },
                user: { connect: { id: userId } },
            }
        });
    }
}
