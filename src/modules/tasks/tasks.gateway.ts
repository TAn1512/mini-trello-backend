import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Task } from './entities/task.entity';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    emitTaskUpdated(task: Task) {
        this.server.emit('taskUpdated', task);
    }
}
