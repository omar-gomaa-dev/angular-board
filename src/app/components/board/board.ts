import {
  Component,
  HostListener,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { ListComponent } from '../lists/list';
import { AddListFormComponent } from '../lists/add-list-form';
import { DragDropModule, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    ListComponent,
    AddListFormComponent,
    DragDropModule,
    CdkDropListGroup,
    FormsModule,
  ],
  template: `
    <div class="absolute inset-0 flex flex-col">
      <ng-container *ngIf="board(); else notFound">
        <!-- Background -->
        <img
          src="/bg.jpg"
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover -z-10"
        />

        <!-- 🟢 Header (as is) -->
        <div
          class="h-14 bg-gray-950 text-white flex items-center justify-between shadow-md px-6 relative"
        >
          <!-- Exit button on the right -->
          <button
            class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-auto"
            (click)="exitBoard()"
          >
            Exit Board
          </button>

          <!-- Board name in the center -->
          <h2
            class="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white flex items-center gap-2"
          >
            <ng-container *ngIf="board()?.image">
              <img
                [src]="board()?.image"
                alt="Board Image"
                class="w-8 h-8 rounded-full object-cover"
              />
            </ng-container>
            {{ board()?.title }}
          </h2>
        </div>

        <!-- 🟢 Board name on the left -->

        <!-- 🟢 Lists -->
        <div
          cdkDropListGroup
          class="flex flex-row gap-6 p-6 flex-1 overflow-x-auto overflow-y-hidden"
        >
          @for (list of board()?.lists; track list.id) {
          <app-list
            [list]="list"
            [addingCardId]="addingCardId()"
            [editingListId]="editingListId()"
            [openListMenuId]="openListMenuId"
            [tempListTitle]="tempListTitle()"
            (deleteList)="deleteList($event)"
            (startEdit)="startEditingList($event.id, $event.title)"
            (saveTitle)="saveListTitle($event.id, $event.title)"
            (cancelEdit)="cancelEditing()"
            (toggleMenu)="toggleListMenu($event)"
            (addCard)="addCard($event.listId, $event.title, $event.dueDate)"
            (deleteCard)="deleteCard($event.listId, $event.cardId)"
            (startAddCard)="startAddCard($event)"
            (cancelAddCard)="cancelAddCard()"
          ></app-list>
          }

          <app-add-list-form
            [addingList]="addingList()"
            (addList)="addList($event)"
            (cancelAddList)="cancelAddList()"
            (startAddList)="startAddList()"
          ></app-add-list-form>
        </div>
      </ng-container>

      <!-- Not found -->
      <ng-template #notFound>
        <div class="p-6 text-center text-gray-600">⚠️ Board not found</div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  board: typeof this.boardService.activeBoard;

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.board = this.boardService.activeBoard;
  }

  openListMenuId: string | null = null;
  addingList = signal(false);
  addingCardId = signal<string | null>(null);
  editingListId = signal<string | null>(null);
  tempListTitle = signal('');

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.boardService.setActiveBoard(id);

        if (!this.board()) {
          this.router.navigate(['/boards']);
        }
      }
    });
  }

  exitBoard() {
    this.boardService.setActiveBoard(null);
    this.router.navigate(['/boards']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.openListMenuId && !target.closest('.menu-container')) {
      this.openListMenuId = null;
    }
  }

  // Lists
  addList(title: string): void {
    if (title.trim()) this.boardService.addList(title);
  }
  deleteList(listId: string): void {
    this.boardService.deleteList(listId);
  }
  startAddList(): void {
    this.addingList.set(true);
  }
  cancelAddList(): void {
    this.addingList.set(false);
  }
  startEditingList(listId: string, currentTitle: string): void {
    this.editingListId.set(listId);
    this.tempListTitle.set(currentTitle);
  }
  saveListTitle(listId: string, newTitle: string): void {
    if (newTitle.trim()) this.boardService.renameList(listId, newTitle);
    this.editingListId.set(null);
    this.tempListTitle.set('');
  }
  cancelEditing(): void {
    this.editingListId.set(null);
    this.tempListTitle.set('');
  }
  toggleListMenu(listId: string): void {
    this.openListMenuId = this.openListMenuId === listId ? null : listId;
  }

  // Cards
  addCard(listId: string, title: string, dueDate?: string): void {
    if (title.trim()) this.boardService.addCard(listId, title, dueDate ?? '');
  }
  deleteCard(listId: string, cardId: string): void {
    this.boardService.deleteCard(listId, cardId);
  }
  startAddCard(listId: string): void {
    this.addingCardId.set(listId);
  }
  cancelAddCard(): void {
    this.addingCardId.set(null);
  }
}
