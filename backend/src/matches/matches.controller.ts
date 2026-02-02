import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) { }

    @Get()
    findAll() {
        return this.matchesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.matchesService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() createMatchDto: any) {
        return this.matchesService.create({
            ...createMatchDto,
            host: { connect: { id: req.user.userId } },
            status: 'OPEN' // Default explicit
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/join')
    join(@Param('id') id: string, @Request() req: any) {
        return this.matchesService.joinMatch(id, req.user.userId);
    }
}
