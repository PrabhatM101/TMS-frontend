import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskService } from '../../core/tasks/services/task-service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private taskSubject = new BehaviorSubject<any>(null);
  private taskService = inject(TaskService);

  taskUpdates$ = this.taskSubject.asObservable();

  connect(token: string,userId:string) {
    if (this.socket && this.socket.connected) return;

    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      auth: { token,userId },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('manageTask', (payload: any) => {
      this.taskService.manageTask(payload);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}
