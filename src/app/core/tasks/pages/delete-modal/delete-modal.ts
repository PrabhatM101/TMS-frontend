import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css'
})
export class DeleteModal{
  @Input() taskId!: string;
  @Input() modal: any;
  @Input() isDeleting: any;
  @Output('deleteItem') deleteItem:EventEmitter<any> = new EventEmitter();

}
