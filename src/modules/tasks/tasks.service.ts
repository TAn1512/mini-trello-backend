import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksGateway } from './tasks.gateway';
import * as admin from 'firebase-admin';


@Injectable()
export class TasksService {
  private db;
  private fieldValue;



  constructor(@Inject('FIREBASE') private readonly firebase: any,
    private readonly tasksGateway: TasksGateway,) {
    this.db = this.firebase.firestore;
    this.fieldValue = admin.firestore.FieldValue;

  }

  async create(boardId: string, cardId: string, dto: CreateTaskDto) {
    const ref = this.db.collection('tasks').doc();

    const cardDoc = await this.db.collection('cards').doc(cardId).get();
    const status = cardDoc.exists ? cardDoc.data().title : 'Unknown';

    const newTask = {
      id: ref.id,
      boardId,
      cardId,
      title: dto.title,
      description: dto.description || '',
      status: status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ref.set(newTask);
    return newTask;
  }

  async findAll(boardId: string, cardId: string) {
    const snapshot = await this.db
      .collection('tasks')
      .where('boardId', '==', boardId)
      .where('cardId', '==', cardId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findOne(boardId: string, cardId: string, id: string) {
    const ref = this.db.collection('tasks').doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data().boardId !== boardId || doc.data().cardId !== cardId) {
      throw new NotFoundException('Task not found');
    }
    return doc.data();
  }

  async update(boardId: string, cardId: string, id: string, dto: UpdateTaskDto) {
    const taskRef = this.db.collection('tasks').doc(id);
    const taskSnap = await taskRef.get();

    if (!taskSnap.exists || taskSnap.data()?.boardId !== boardId || taskSnap.data()?.cardId !== cardId) {
      throw new NotFoundException('Task not found');
    }

    const taskData = taskSnap.data();

    let newCardId = cardId;

    if (dto.status && dto.status !== cardId) {
      const cardQuery = await this.db
        .collection('cards')
        .where('boardId', '==', boardId)
        .where('title', '==', dto.status)
        .limit(1)
        .get();

      if (cardQuery.empty) {
        const newCardRef = this.db.collection('cards').doc();
        await newCardRef.set({
          id: newCardRef.id,
          boardId,
          title: dto.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        newCardId = newCardRef.id;
      } else {
        newCardId = cardQuery.docs[0].id;
      }
    }

    const updateData = {
      title: dto.title ?? taskData.title,
      description: dto.description ?? taskData.description,
      cardId: newCardId,
      updatedAt: new Date(),
    };

    await taskRef.update(updateData);

    const updated = { id, ...taskData, ...updateData };
    this.tasksGateway.emitTaskUpdated(updated);


    return { id, ...taskData, ...updateData };
  }


  async remove(boardId: string, cardId: string, id: string) {
    const ref = this.db.collection('tasks').doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data().boardId !== boardId || doc.data().cardId !== cardId) {
      throw new NotFoundException('Task not found');
    }
    await ref.delete();
    return { success: true };
  }

  async assignMember(boardId: string, cardId: string, taskId: string, memberId: string) {
    const taskRef = this.db.collection("tasks").doc(taskId);
    const taskSnap = await taskRef.get();

    if (!taskSnap.exists || taskSnap.data().boardId !== boardId || taskSnap.data().cardId !== cardId) {
      throw new NotFoundException("Task not found");
    }

    await taskRef.update({
      assignees: this.fieldValue.arrayUnion(memberId),
      updatedAt: new Date(),
    });

    return { taskId, memberId };
  }

  async getAssignees(boardId: string, cardId: string, taskId: string) {
    const taskRef = this.db.collection("tasks").doc(taskId);
    const taskSnap = await taskRef.get();

    if (!taskSnap.exists || taskSnap.data().boardId !== boardId || taskSnap.data().cardId !== cardId) {
      throw new NotFoundException("Task not found");
    }

    const data = taskSnap.data();
    return (data.assignees || []).map((m: string) => ({ taskId, memberId: m }));
  }

  async removeAssignee(boardId: string, cardId: string, taskId: string, memberId: string) {
    const taskRef = this.db.collection("tasks").doc(taskId);
    const taskSnap = await taskRef.get();

    if (!taskSnap.exists || taskSnap.data().boardId !== boardId || taskSnap.data().cardId !== cardId) {
      throw new NotFoundException("Task not found");
    }

    await taskRef.update({
      assignees: this.fieldValue.arrayRemove(memberId),
      updatedAt: new Date(),
    });

    return { success: true };
  }
}
