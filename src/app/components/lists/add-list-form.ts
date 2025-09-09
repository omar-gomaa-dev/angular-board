import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-list-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl p-4 w-80 flex flex-col justify-center items-center">
      @if (!addingList) {
      <button
        class="text-gray-500 bg-gray-300 hover:text-gray-700 text-2xl w-full py-2 border rounded-2xl"
        (click)="startAddList.emit()"
      >
        ➕ Add List
      </button>
      } @else {
      <div class="w-full">
        <input
          type="text"
          placeholder="New list title..."
          class="   text-2x1       w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mb-3"
          #listTitle
          (keydown.enter)="handleAddList(listTitle.value)"
        />
        @if (errorMessage) {
        <span class="text-red-500 text-m mt-1 block">
          {{ errorMessage }}
        </span>
        }
        <div class="flex gap-2">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl w-full"
            (click)="handleAddList(listTitle.value)"
          >
            Add
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-xl w-full"
            (click)="cancelAddList.emit()"
          >
            Cancel
          </button>
        </div>
      </div>
      }
    </div>
  `,
})
export class AddListFormComponent {
  @Input() addingList = false;
  @Input() errorMessage: string | null = null;
  @Output() addList = new EventEmitter<string>();
  @Output() cancelAddList = new EventEmitter<void>();
  @Output() startAddList = new EventEmitter<void>();

  handleAddList(listTitle: string) {
    if (!listTitle.trim()) {
      this.errorMessage = 'List name cannot be empty';
      return;
    }
    this.errorMessage = null;
    this.addList.emit(listTitle);
    this.cancelAddList.emit();
  }
}
