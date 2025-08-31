import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    tasks$ = new BehaviorSubject<any[]>([]);


    manageTask(payload: any) {
      let tasks = this.tasks$.getValue();
      let index = tasks?.findIndex((t: any) => t?._id === payload?.data?._id);

      let isDelete = payload?.isDelete;
      if (isDelete && index === -1) return;
      if(isDelete){
        tasks?.splice(index, 1);
      }else{
        if (index === -1) tasks?.push(payload?.data);
        else tasks?.splice(index, 1,payload?.data);
      }

      this.tasks$.next(tasks);
    }
}
