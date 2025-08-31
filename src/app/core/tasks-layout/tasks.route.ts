import { Routes } from '@angular/router';
import { TasksLayout } from './tasks-layout';
import { TaskList } from '../tasks/pages/task-list/task-list';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TasksLayout,
    children: [
      { path: 'list', component: TaskList },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];
