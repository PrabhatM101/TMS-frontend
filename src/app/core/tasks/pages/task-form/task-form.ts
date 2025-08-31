import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../../shared/services/http-service';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task-service';


interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'to-do' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StatusOption {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css'],
})
export class TaskForm implements OnInit {
  @Input() task?: Task;
  @Input() isLoading = false;

  private fb = inject(FormBuilder);
  private http = inject(HttpService);
  private toastr = inject(ToastrService);
  private taskService = inject(TaskService);
  public modal = inject(NgbActiveModal);

  taskForm: FormGroup;
  statusOptions: Record<string, StatusOption> = {
    'to-do': { label: 'To Do', icon: 'fa-regular fa-clock text-primary' },
    'in-progress': { label: 'In Progress', icon: 'fa-solid fa-spinner text-warning' },
    'completed': { label: 'Done', icon: 'fa-solid fa-check-circle text-success' },
  };
  errorMessage: string | null = null;
  submitted = false;

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['to-do', [Validators.required, this.statusValidator()]],
      dueDate: [null, [this.dateValidator()]],
    });

  }

  ngOnInit(): void {
    if (this.task?._id) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : null,
      });
    }
  }

  statusValidator() {
    return (control: any) => {
      const validStatuses = ['to-do', 'in-progress', 'completed'];
      return validStatuses.includes(control.value) ? null : { invalidStatus: true };
    };
  }

  dateValidator() {
    return (control: any) => {
      if (!control.value) return null;
      const date = new Date(control.value);
      return !isNaN(date.getTime()) ? null : { invalidDate: true };
    };
  }

  onDropdownOpen(isOpen: boolean): void {
    if (isOpen) {
      this.taskForm.get('status')?.markAsTouched();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.errorMessage = 'Please correct the errors in the form.';
      return;
    }

    this.isLoading = true;
    const formValue:any = {
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value || '',
      status: this.taskForm.get('status')?.value,
    };
    let dueDate =  this.taskForm.get('dueDate')?.value;
    if(dueDate) formValue.dueDate = new Date(dueDate).toISOString();

    const request = this.task
      ? this.http.patchData(`/tasks/${this.task._id}`, formValue)
      : this.http.postData('/tasks', formValue);

    request.subscribe({
      next: (response: Task) => {
        this.taskService.manageTask({data:response});
        this.isLoading = false;
        this.toastr.success(
          this.task ? 'Task updated successfully!' : 'Task created successfully!',
          'Success'
        );
        this.modal.close(response);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'An error occurred while saving the task.';
        this.http.handleErrorToaster(err);
      },
    });
  }
}
