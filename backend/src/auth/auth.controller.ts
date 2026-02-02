import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() req: { email: string; password: string }) {
        // In a real app, use LocalAuthGuard to validate user/pass first
        // For simplicity now, we assume body has { email, password } 
        // and we validate manually or via guard. 
        // Ideally: @UseGuards(LocalAuthGuard) @Post('login') async login(@Request() req)

        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    // Google OAuth
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Guard redirects to Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Request() req: any, @Res() res: Response) {
        const token = await this.authService.login(req.user);
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/callback?token=${token.access_token}`);
    }

    // Facebook OAuth
    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth() {
        // Guard redirects to Facebook
    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthCallback(@Request() req: any, @Res() res: Response) {
        const token = await this.authService.login(req.user);
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/callback?token=${token.access_token}`);
    }
}

