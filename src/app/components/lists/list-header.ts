import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-center p-3 border-b border-gray-200">
      @if (editingListId === listId) {
      <div class="flex items-center gap-2 w-full">
        <input
          #newTitleInput
          type="text"
          class="border rounded px-2 py-1 text-sm flex-1"
          [value]="tempListTitle"
          (input)="onInput($event)"
          #titleInput
          (keydown.enter)="
            saveTitleInput.emit(titleInput.value); cancelEdit.emit()
          "
        />
        <button
          class="bg-green-500 text-white px-2 py-1 rounded"
          (click)="saveTitle.emit({ id: listId, title: newTitleInput.value })"
        >
          Save
        </button>
        <button
          class="bg-gray-300 px-2 py-1 rounded"
          (click)="cancelEdit.emit()"
        >
          Cancel
        </button>
      </div>
      } @else {
      <h3 class="font-semibold text-gray-800 text-sm">{{ title }}</h3>
      <div class="relative menu-container">
        <button
          class="text-gray-500 hover:text-gray-700 px-2"
          (click)="toggleMenu.emit(listId)"
        >
          ...
        </button>
        @if (openListMenuId === listId) {
        <div
          class="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10"
        >
          <button
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            (click)="startEdit.emit({ id: listId, title })"
          >
            ✏ Edit Title
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            (click)="deleteList.emit(listId)"
          >
            🗑 Delete List
          </button>
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class ListHeaderComponent {
  @ViewChild('menuContainer') menuContainer!: { nativeElement: HTMLDivElement };

  @Input({ required: true }) listId!: string;
  @Input({ required: true }) title!: string;
  @Input() editingListId: string | null = null;
  @Input() openListMenuId: string | null = null;
  @Input() tempListTitle = '';

  @Output() saveTitle = new EventEmitter<{ id: string; title: string }>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() deleteList = new EventEmitter<string>();
  @Output() startEdit = new EventEmitter<{ id: string; title: string }>();
  @Output() toggleMenu = new EventEmitter<string>();
  saveTitleInput: any;

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.tempListTitle = input.value;
  }
}
