import { Controller, Get, Put, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Dashboard Stats
    @Get('dashboard/stats')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    // User Management
    @Get('users')
    async getAllUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('role') role?: string,
        @Query('status') status?: string,
    ) {
        return this.adminService.getAllUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            role,
            status,
        );
    }

    @Put('users/:id/status')
    async updateUserStatus(
        @Param('id') id: string,
        @Body() body: { status: string },
    ) {
        return this.adminService.updateUserStatus(id, body.status);
    }

    // Venue Manager Requests
    @Get('venue-requests')
    async getVenueManagerRequests(@Query('status') status?: string) {
        return this.adminService.getVenueManagerRequests(status);
    }

    @Put('venue-requests/:id/approve')
    async approveVenueManager(
        @Param('id') id: string,
        @Request() req: any,
    ) {
        return this.adminService.approveVenueManager(id, req.user.id);
    }

    @Put('venue-requests/:id/reject')
    async rejectVenueManager(
        @Param('id') id: string,
        @Request() req: any,
        @Body() body: { reason?: string },
    ) {
        return this.adminService.rejectVenueManager(id, req.user.id, body.reason);
    }

    // Venue Management
    @Get('venues')
    async getAllVenues(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAllVenues(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Delete('venues/:id')
    async deleteVenue(@Param('id') id: string) {
        return this.adminService.deleteVenue(id);
    }

    // Match Management
    @Get('matches')
    async getAllMatches(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAllMatches(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Delete('matches/:id')
    async deleteMatch(@Param('id') id: string) {
        return this.adminService.deleteMatch(id);
    }
}
