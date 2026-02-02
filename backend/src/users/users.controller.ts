import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Request() req: any) {
        return this.usersService.findById(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('profile')
    updateProfile(@Request() req: any, @Body() updateData: any) {
        return this.usersService.updateProfile(req.user.userId, updateData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('me')
    updateMe(@Request() req: any, @Body() updateData: { fullName?: string; phoneNumber?: string }) {
        return this.usersService.updateProfile(req.user.userId, updateData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('me/password')
    updatePassword(@Request() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
        return this.usersService.updatePassword(req.user.userId, body.currentPassword, body.newPassword);
    }

    // Public profile phải đứng sau các endpoints cụ thể
    @Get(':id')
    getPublicProfile(@Param('id') id: string) {
        return this.usersService.getPublicProfile(id);
    }
}
