import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  private db;

  constructor(@Inject('FIREBASE') private readonly firebase: any) {
    this.db = this.firebase.firestore;
  }

  async create(boardId: string, dto: CreateCardDto) {
    const ref = this.db.collection('cards').doc();
    const newCard = {
      id: ref.id,
      boardId,
      title: dto.title,
      createdAt: new Date(),
    };
    await ref.set(newCard);
    return newCard;
  }

  async findAll(boardId: string) {
    const snapshot = await this.db
      .collection('cards')
      .where('boardId', '==', boardId)
      // .orderBy('createdAt', 'asc')
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findOne(boardId: string, id: string) {
    const ref = this.db.collection('cards').doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data().boardId !== boardId) {
      throw new NotFoundException('Card not found');
    }
    return doc.data();
  }

  async findByUser(boardId: string, userId: string) {
    const snapshot = await this.db
      .collection('cards')
      .where('boardId', '==', boardId)
      .where('members', 'array-contains', userId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async update(boardId: string, id: string, dto: UpdateCardDto) {
    const ref = this.db.collection('cards').doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data().boardId !== boardId) {
      throw new NotFoundException('Card not found');
    }

    await ref.update({ ...dto });
    return { id, ...doc.data(), ...dto };
  }

  async remove(boardId: string, id: string) {
    const ref = this.db.collection('cards').doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data().boardId !== boardId) {
      throw new NotFoundException('Card not found');
    }
    await ref.delete();
    return { success: true };
  }
}
