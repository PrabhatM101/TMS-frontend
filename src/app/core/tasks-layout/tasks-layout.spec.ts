import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksLayout } from './tasks-layout';

describe('TasksLayout', () => {
  let component: TasksLayout;
  let fixture: ComponentFixture<TasksLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
