import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
    type: NotificationType;
    message: string;
    boardId?: string;
    fromUser?: string;
}
