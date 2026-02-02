import { Controller, Get, Post, Body, Param, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('venues')
export class VenuesController {
    constructor(private readonly venuesService: VenuesService) { }

    @Get()
    findAll() {
        return this.venuesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my-venues')
    findMyVenues(@Request() req: any) {
        return this.venuesService.findByOwner(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.venuesService.findById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() createVenueDto: any) {
        return this.venuesService.create({
            ...createVenueDto,
            owner: { connect: { id: req.user.userId } }
        }, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() updateVenueDto: any, @Request() req: any) {
        return this.venuesService.update(id, updateVenueDto, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.venuesService.remove(id, req.user.userId);
    }
}
