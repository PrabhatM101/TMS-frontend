import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskForm } from '../task-form/task-form';
import { HttpService } from '../../../../shared/services/http-service';
import { TaskService } from '../../services/task-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeleteModal } from '../delete-modal/delete-modal';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'to-do' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface StatusOption {
  label: string;
  icon: string;
  badgeClass?: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList implements OnInit {
  private http = inject(HttpService);
  private taskService = inject(TaskService);
  private modalService = inject(NgbModal);
  private destroyRef = inject(DestroyRef);

  tasks$ =this.taskService.tasks$;
  filteredTasks$ = new BehaviorSubject<Task[]>([]);
  searchTerm = '';
  selectedStatus: keyof typeof this.statusOptions = 'all';
  statusOptions: Record<string, StatusOption> = {
    all: { label: 'All Status', icon: 'fa fa-filter text-muted' },
    'to-do': { label: 'To Do', icon: 'fa-regular fa-clock text-primary', badgeClass: 'bg-primary' },
    'in-progress': { label: 'In Progress', icon: 'fa-solid fa-spinner text-warning', badgeClass: 'bg-warning' },
    completed: { label: 'Done', icon: 'fa-solid fa-check-circle text-success', badgeClass: 'bg-success' },
  };
  isLoading = false;
  isCreating = false;
  isDeleting = false;
  isUpdating = false;

  ngOnInit(): void {
    this.loadTasks();
    this.tasks$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.applyFilters();
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.http.getData('/tasks').subscribe({
      next: (tasks: Task[]) => {
        this.taskService.tasks$.next(tasks);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.http.handleErrorToaster(err);
      },
    });
  }

  applyFilters(): void {
    let filteredTasks  = this.tasks$.getValue();

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm?.trim().toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    if (this.selectedStatus !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.status === this.selectedStatus);
    }

    this.filteredTasks$.next(filteredTasks);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(status: keyof typeof this.statusOptions): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  get selectedStatusLabel(): string {
    return this.statusOptions[this.selectedStatus].label;
  }

  get selectedStatusIcon(): string {
    return this.statusOptions[this.selectedStatus].icon;
  }

  openAddTask(): void {
    this.modalService.open(TaskForm, {
      size: 'lg',
      windowClass: 'modal-custom',
    });

  }

  openTaskDetails(task: Task): void {
    const modalRef = this.modalService.open(TaskForm, {
      size: 'lg',
      windowClass: 'modal-custom',
    });
    modalRef.componentInstance.task = task;
  }

  openDeleteConfirmModal(taskId: string): void {
    const modalRef = this.modalService.open(DeleteModal, {
      windowClass: 'modal-custom',
    });
    modalRef.componentInstance.taskId = taskId;
    modalRef.componentInstance.isDeleting = this.isDeleting;
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.deleteItem.subscribe(
      () => {
        if (taskId) {
          if(this.isDeleting) return;
          this.isDeleting = true;
          modalRef.componentInstance.isDeleting = true;
          this.http.deleteData(`/tasks/${taskId}`).subscribe({
            next: () => {
              this.taskService.manageTask({ data: { _id: taskId }, isDelete: true });
              this.isDeleting = false;
              modalRef?.dismiss();
            },
            error: (err) => {
              this.isDeleting = false;
              modalRef?.dismiss();
              this.http.handleErrorToaster(err);
            },
          });
        }
      },
      () => {}
    );
  }

  getStatusBadgeClass(status: string): string {
    return this.statusOptions[status]?.badgeClass || 'bg-secondary';
  }
}
