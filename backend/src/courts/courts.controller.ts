import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Delete, Put } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) { }

    @Get()
    findAll() {
        return this.courtsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.courtsService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() createCourtDto: any) {
        const { venueId, ...rest } = createCourtDto;
        return this.courtsService.create({
            ...rest,
            venue: { connect: { id: venueId } }
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCourtDto: any, @Request() req: any) {
        return this.courtsService.update(id, updateCourtDto, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.courtsService.remove(id, req.user.userId);
    }

    @Get('venue/:venueId')
    findByVenue(@Param('venueId') venueId: string) {
        return this.courtsService.findByVenue(venueId);
    }

    // Kiểm tra availability của court trong khoảng thời gian
    @Get(':id/availability')
    async checkAvailability(
        @Param('id') id: string,
        @Body() timeSlot: { startTime: string; endTime: string }
    ) {
        return this.courtsService.checkAvailability(id, new Date(timeSlot.startTime), new Date(timeSlot.endTime));
    }
}

