import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class VenueManagerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Vui lòng đăng nhập');
        }

        if (user.role !== 'VENUE_MANAGER' && user.role !== 'ADMIN') {
            throw new ForbiddenException('Chỉ quản lý sân mới có quyền truy cập');
        }

        if (user.status !== 'ACTIVE') {
            throw new ForbiddenException('Tài khoản chưa được kích hoạt');
        }

        return true;
    }
}
