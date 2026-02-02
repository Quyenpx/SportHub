import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;

        try {
            const user = await this.authService.validateOAuthUser({
                email,
                fullName: displayName,
                provider: 'GOOGLE',
                providerId: id,
                avatarUrl: photos?.[0]?.value,
            });

            done(null, user);
        } catch (error) {
            done(error as Error, undefined);
        }
    }
}

