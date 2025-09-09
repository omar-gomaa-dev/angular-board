import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { Card } from '../../models/board.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  template: `
    <div
      class="bg-white rounded-lg px-3 py-2 text-sm text-gray-800 relative shadow cursor-pointer
         hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
    >
      <!-- Regular display -->
      <ng-container *ngIf="!isEditing(); else editMode">
        <div class="flex justify-between items-start">
          <span class="font-medium">{{ card().title }}</span>

          <!-- Menu button -->
          <div class="relative">
            <button
              (click)="toggleMenu($event)"
              class="p-1 border-4 border-gray-300 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M4 21h4.586a1 1 0 0 0 .707-.293l11-11a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0l-11 11A1 1 0 0 0 4 17.414V21zm2-2v-1.586L14.586 9 16 10.414 7.414 19H6z"
                />
              </svg>
            </button>

            <!-- Menu -->
            <div
              *ngIf="menuOpen()"
              class="absolute right-[-5px] mt-1 bg-white border rounded-md shadow-lg z-10 w-auto min-w-max"
            >
              <button
                (click)="startEdit(); closeMenu()"
                class="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                (click)="
                  deleteCard.emit({ listId: listId(), cardId: card().id });
                  closeMenu()
                "
                class="block w-full text-left px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- due date -->
        <span
          class="px-2 py-1 rounded-md text-xs font-medium mt-2 inline-block"
          [class]="dueDateClass()"
        >
          {{
            card().dueDate
              ? (card().dueDate | date : 'MMM d, y')
              : 'No Due Date'
          }}
        </span>
      </ng-container>

      <!-- وضع Edit -->
      <ng-template #editMode>
        <div class="flex flex-col gap-2">
          <input
            class="border rounded px-2 py-1 text-sm"
            [(ngModel)]="tempTitle"
            placeholder="Card title"
          />
          <input
            type="date"
            class="border rounded px-2 py-1 text-sm"
            [(ngModel)]="tempDueDate"
          />

          <div class="flex gap-2">
            <button
              class="text-sm bg-green-600 text-white  px-4 py-2 rounded hover:bg-green-700 ml-auto"
              (click)="save()"
            >
              Save
            </button>
            <button
              class="bg-gray-400 text-sm  text-white px-4 py-2 rounded hover:bg-gray-700 ml-auto"
              (click)="cancel()"
            >
              Cancel
            </button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class CardComponent {
  private _card = signal<Card>({ id: '', title: '', dueDate: '' });
  private _listId = signal<string>('');

  @Input({ required: true }) set cardInput(value: Card) {
    this._card.set(value);
  }
  card = this._card.asReadonly();

  @Input({ required: true }) set listIdInput(value: string) {
    this._listId.set(value);
  }
  listId = this._listId.asReadonly();

  @Output() deleteCard = new EventEmitter<{ listId: string; cardId: string }>();

  isEditing = signal(false);
  menuOpen = signal(false);
  tempTitle = '';
  tempDueDate: string | undefined;

  constructor(private boardService: BoardService, private elRef: ElementRef) {}

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen.set(!this.menuOpen());
  }
  closeMenu() {
    this.menuOpen.set(false);
  }

  startEdit() {
    this.isEditing.set(true);
    this.tempTitle = this.card().title;
    this.tempDueDate = this.card().dueDate;
  }

  save() {
    this.boardService.editCard(this.listId(), this.card().id, {
      title: this.tempTitle,
      dueDate: this.tempDueDate,
    });
    this.isEditing.set(false);
  }

  cancel() {
    this.isEditing.set(false);
  }

  dueDateClass = computed(() => {
    const dueDate = this._card()?.dueDate;
    if (!dueDate) return 'bg-gray-100 text-gray-500';

    const due = new Date(dueDate);
    const today = new Date();

    // Reset the time to compare only the date
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (due < today) {
      // Late (yesterday or earlier)
      return 'bg-red-100 text-red-700';
    } else {
      // Today or later
      return 'bg-green-100 text-green-700';
    }
  });

  // 🟢 Close the menu if clicked outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.menuOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}
