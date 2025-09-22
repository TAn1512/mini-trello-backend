import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private db;

  constructor(
    @Inject('FIREBASE') private readonly firebase: any,
    private readonly gateway: NotificationsGateway,
  ) {
    this.db = this.firebase.firestore;
  }

  async create(userId: string, dto: Partial<Notification>) {
    const ref = this.db.collection('notifications').doc();
    const newNotification: Notification = {
      id: ref.id,
      userId,
      type: dto.type!,
      message: dto.message!,
      boardId: dto.boardId || null,
      fromUser: dto.fromUser || null,
      read: false,
      createdAt: new Date(),
      inviteId: dto.inviteId || null,
    };

    await ref.set(newNotification);

    this.gateway.sendToUser(userId, 'notification', newNotification);

    return newNotification;
  }

  async findAll(userId: string) {
    const snapshot = await this.db
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async markRead(notificationId: string, status?: 'pending' | 'accepted' | 'denied') {
    const ref = this.db.collection('notifications').doc(notificationId);
    const doc = await ref.get();
    if (!doc.exists) throw new NotFoundException('Notification not found');

    const updateData: any = { read: true };
    if (status) {
      updateData.status = status;
    }

    await ref.update(updateData);
    return { success: true };
  }

}
