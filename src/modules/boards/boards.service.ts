import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import * as admin from 'firebase-admin';


@Injectable()
export class BoardsService {
  private db;
  private fieldValue;


  constructor(
    @Inject('FIREBASE') private readonly firebase: any,
    private readonly notificationsService: NotificationsService,
  ) {
    this.db = this.firebase.firestore;
    this.fieldValue = admin.firestore.FieldValue;
  }

  async create(userEmail: string, dto: CreateBoardDto): Promise<Board> {
    const ref = this.db.collection('boards').doc();
    const newBoard: Board = {
      id: ref.id,
      name: dto.name,
      description: dto.description,
      ownerId: userEmail,
      members: [userEmail],
      createdAt: new Date(),
    };

    await ref.set(newBoard);
    return newBoard;
  }

  async findAll(userEmail: string): Promise<Board[]> {
    const snapshot = await this.db
      .collection('boards')
      .where('members', 'array-contains', userEmail)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => doc.data() as Board);
  }

  async findOne(id: string): Promise<Board> {
    const doc = await this.db.collection('boards').doc(id).get();
    if (!doc.exists) throw new NotFoundException('Board not found');
    return doc.data() as Board;
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    const ref = this.db.collection('boards').doc(id);
    await ref.update({ ...dto });
    const updated = await ref.get();
    return updated.data() as Board;
  }

  async remove(id: string): Promise<void> {
    await this.db.collection('boards').doc(id).delete();
  }

  async inviteMember(boardId: string, ownerEmail: string, dto: any) {
    const boardRef = this.db.collection('boards').doc(boardId);
    const boardDoc = await boardRef.get();
    if (!boardDoc.exists) throw new NotFoundException('Board not found');

    const board = boardDoc.data() as Board;

    if (board.ownerId !== ownerEmail) {
      throw new ForbiddenException('Only the board owner can invite members');
    }

    const userRef = this.db.collection('users').doc(dto.member_id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new BadRequestException('User not found');
    }

    if (board.members.includes(dto.member_id)) {
      throw new BadRequestException('User is already a member of this board');
    }

    const existingInvite = await boardRef
      .collection('invitations')
      .where('member_id', '==', dto.member_id)
      .where('status', '==', 'pending')
      .get();

    if (!existingInvite.empty) {
      throw new BadRequestException(
        'An invitation is already pending for this user',
      );
    }

    const inviteId = dto.invite_id || uuidv4();
    const inviteRef = boardRef.collection('invitations').doc(inviteId);

    await inviteRef.set({
      id: inviteId,
      boardId,
      board_owner_id: board.ownerId,
      member_id: dto.member_id,
      email_member: dto.email_member || null,
      status: 'pending',
      createdAt: new Date(),
    });

    await this.notificationsService.create(dto.member_id, {
      type: NotificationType.Invite,
      message: `You have received an invitation to "${board.name}"`,
      boardId: boardId,
      fromUser: ownerEmail,
      inviteId: inviteId,
    });

    return { success: true };
  }




  async respondToInvite(boardId: string, userEmail: string, dto: any) {
    const inviteRef = this.db
      .collection('boards')
      .doc(boardId)
      .collection('invitations')
      .doc(dto.invite_id);

    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) throw new NotFoundException('Invitation not found');

    const invite = inviteDoc.data();
    if (invite.member_id !== userEmail) {
      throw new ForbiddenException('This invitation is not for you');
    }

    await inviteRef.update({
      status: dto.status,
      updatedAt: new Date(),
    });

    if (dto.status === 'accepted') {
      await this.db
        .collection('boards')
        .doc(boardId)
        .update({
          members: this.fieldValue.arrayUnion(userEmail),
        });
    }
    if (dto.notificationId) {
      await this.notificationsService.markRead(dto.notificationId, dto.status);
    }

    return { success: true };
  }


}
