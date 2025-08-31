import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { AuthService } from '../../shared/services/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocketService } from '../../shared/services/socket-service';

@Component({
  selector: 'app-tasks-layout',
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './tasks-layout.html',
  styleUrl: './tasks-layout.css'
})
export class TasksLayout implements OnInit,OnDestroy {
 private auth = inject(AuthService);
 private destroyRef = inject(DestroyRef);
 private socketService = inject(SocketService);

  ngOnInit() {
    this.socketService.connect(this.auth.token || '',this.auth.userId || '');
    this.auth.loadCurrentUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnDestroy(){
    this.socketService?.disconnect();
  }
}
