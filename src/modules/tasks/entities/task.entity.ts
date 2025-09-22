export class Task {
    id: string;
    boardId: string;
    cardId: string;
    title: string;
    description: string;
    status: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;

    assignees?: string[];
}
