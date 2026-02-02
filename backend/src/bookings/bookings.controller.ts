import { Controller, Get, Post, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Request() req: any, @Body() createBookingDto: any) {
        // Expect body: { courtId, startTime, endTime }
        return this.bookingsService.create({
            court: { connect: { id: createBookingDto.courtId } },
            user: { connect: { id: req.user.userId } },
            startTime: createBookingDto.startTime,
            endTime: createBookingDto.endTime,
            totalPrice: createBookingDto.totalPrice || 0, // Should calc on backend really
            status: 'PENDING'
        });
    }

    @Get('me')
    findMyBookings(@Request() req: any) {
        return this.bookingsService.findByUser(req.user.userId);
    }

    @Get('venue/:venueId')
    findByVenue(@Param('venueId') venueId: string) {
        return this.bookingsService.findByVenue(venueId);
    }

    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: { status: 'CONFIRMED' | 'CANCELLED' }
    ) {
        return this.bookingsService.updateStatus(id, updateStatusDto.status as any);
    }
}
