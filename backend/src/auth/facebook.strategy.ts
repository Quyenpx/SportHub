import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.FACEBOOK_APP_ID || 'dummy',
            clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy',
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
            scope: 'email',
            profileFields: ['id', 'emails', 'name', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void,
    ): Promise<any> {
        const { id, emails, displayName, photos } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
            return done(new Error('No email found from Facebook'), undefined);
        }

        try {
            const user = await this.authService.validateOAuthUser({
                email,
                fullName: displayName,
                provider: 'FACEBOOK',
                providerId: id,
                avatarUrl: photos?.[0]?.value,
            });

            done(null, user);
        } catch (error) {
            done(error, undefined);
        }
    }
}

