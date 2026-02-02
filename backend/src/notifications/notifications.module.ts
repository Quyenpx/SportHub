import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService], // Export để các module khác có thể dùng
})
export class NotificationsModule { }
