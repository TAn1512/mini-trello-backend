export enum NotificationType {
    Invite = 'invite',
    TaskUpdate = 'task_update',
    Comment = 'comment',
}

export class Notification {
    id: string;
    userId: string;
    type: NotificationType;
    message: string;
    boardId?: string | null;
    fromUser?: string | null;
    read: boolean;
    createdAt: Date;
    inviteId?: string | null;
    status?: "pending" | "accepted" | "denied";
}
