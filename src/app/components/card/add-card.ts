import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-4 p-2">
      @if (addingCardId === listId) {
      <div>
        <input
          type="text"
          placeholder="New card title..."
          class="w-full  border bg-gray-200 border-slate-200 rounded-md px-3 py-2"
          #cardTitle
          (keydown.enter)="onAdd(cardTitle.value, dueDate.value)"
        />
        @if (errorMessage) {
        <span class="text-red-500 text-m mt-1 block">
          {{ errorMessage }}
        </span>
        }
        <input
          type="date"
          class="w-full bg-gray-200 border border-slate-200 rounded-md px-3 py-2"
          #dueDate
        />
        <div class="flex gap-2 mt-2">
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl w-full"
            (click)="onAdd(cardTitle.value, dueDate.value)"
          >
            Add
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-xl w-full"
            (click)="cancelAddCard.emit()"
          >
            Cancel
          </button>
        </div>
      </div>
      } @else {
      <button
        class="text-gray-500 hover:text-gray-700 text-sm w-full py-2 border rounded-xl"
        (click)="startAddCard.emit(listId)"
      >
        ➕ Add Card
      </button>
      }
    </div>
  `,
})
export class AddCardFormComponent {
  @Input({ required: true }) listId!: string;
  @Input() addingCardId: string | null = null;

  @Output() addCard = new EventEmitter<{
    listId: string;
    title: string;
    dueDate?: string;
  }>();
  @Output() cancelAddCard = new EventEmitter<void>();
  @Output() startAddCard = new EventEmitter<string>();
  errorMessage = '';
  // 🟢 دالة موحدة للإضافة
  onAdd(title: string, dueDate?: string) {
    if (!title.trim()) {
      this.errorMessage = '⚠️ Please enter a board name!'; // ✅ عرض الرسالة
      return; // ❌ وقف الإضافة
    }

    // ✅ مسح الرسالة في حالة النجاح
    this.errorMessage = '';

    this.addCard.emit({
      listId: this.listId,
      title: title.trim(),
      dueDate: dueDate || undefined,
    });

    this.cancelAddCard.emit(); // يقفل الفورم بعد الإضافة
  }
}
