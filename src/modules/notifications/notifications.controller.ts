import { Controller, Post, Param, Body, UseGuards, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationType } from './entities/notification.entity';

@Controller('users/:userId/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    create(
        @Param('userId') userId: string,
        @Body()
        body: { type: NotificationType; message: string; boardId?: string; fromUser?: string },
    ) {
        return this.notificationsService.create(userId, body);
    }

    @Get()
    findAll(@Param('userId') userId: string) {
        return this.notificationsService.findAll(userId);
    }
}
