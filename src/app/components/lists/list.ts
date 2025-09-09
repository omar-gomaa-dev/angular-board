import {
  Component,
  Input,
  Output,
  EventEmitter,
  TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListHeaderComponent } from './list-header';
import { AddCardFormComponent } from '../card/add-card';
// If CardComponent is not standalone, import its module instead:
// import { CardModule } from '../card/card.module';
import { Card, List } from '../../models/board.model';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board.service';
import { CardComponent } from '../card/card';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent, // If CardComponent is not standalone, replace with CardModule
    AddCardFormComponent,
    DragDropModule,
    ListHeaderComponent,
  ],
  template: `
    <div
      class="w-64 bg-gray-100 rounded-lg p-3 flex flex-col gap-3 min-h-[50px]"
      cdkDropList
      [id]="list.id"
      [cdkDropListConnectedTo]="connectedLists"
      [cdkDropListData]="list.cards"
      (cdkDropListDropped)="onCardDrop($event)"
    >
      <!-- 🟢 Header -->
      <app-list-header
        [listId]="list.id"
        [title]="list.title"
        [editingListId]="editingListId"
        [openListMenuId]="openListMenuId"
        [tempListTitle]="tempListTitle"
        (saveTitle)="saveTitle.emit($event)"
        (cancelEdit)="cancelEdit.emit()"
        (deleteList)="deleteList.emit($event)"
        (startEdit)="startEdit.emit($event)"
        (toggleMenu)="toggleMenu.emit($event)"
      ></app-list-header>

      <!-- 🟢 Cards -->
      <div class="flex flex-col gap-2 p-3 overflow-y-auto">
        <app-card
          *ngFor="let card of list.cards; trackBy: trackByCardId"
          [cardInput]="card"
          [listIdInput]="list.id"
          (deleteCard)="deleteCard.emit($event)"
          cdkDrag
        ></app-card>
      </div>

      <!-- 🟢 Add Card -->
      <app-add-card-form
        [listId]="list.id"
        [addingCardId]="addingCardId"
        (addCard)="addCard.emit($event)"
        (cancelAddCard)="cancelAddCard.emit()"
        (startAddCard)="startAddCard.emit($event)"
      ></app-add-card-form>
    </div>
  `,
})
export class ListComponent {
  @Input({ required: true }) list!: List;
  @Input() addingCardId: string | null = null;
  @Input() editingListId: string | null = null;
  @Input() openListMenuId: string | null = null;
  @Input() tempListTitle = '';

  @Output() deleteList = new EventEmitter<string>();
  @Output() startEdit = new EventEmitter<{ id: string; title: string }>();
  @Output() saveTitle = new EventEmitter<{ id: string; title: string }>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<string>();

  @Output() addCard = new EventEmitter<{
    listId: string;
    title: string;
    dueDate?: string;
  }>();
  @Output() deleteCard = new EventEmitter<{ listId: string; cardId: string }>();
  @Output() startAddCard = new EventEmitter<string>();
  @Output() cancelAddCard = new EventEmitter<void>();

  trackByCardId: TrackByFunction<Card> = (index: number, card: Card) => card.id;

  constructor(private boardService: BoardService) {}

  // 🟢 Drag and Drop Event
  connectedLists: string[] = [];

  ngOnInit() {
    // Connect all lists to each other
    this.boardService.activeBoard()?.lists.map((l: List) => l.id) ?? [];
  }

  onCardDrop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      // Same list
      this.boardService.moveCardWithinList(
        this.list.id,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Different list
      this.boardService.moveCard(
        event.previousContainer.id, // From list
        event.container.id, // To list
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onListDrop(event: CdkDragDrop<List[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.boardService.moveList(event.previousIndex, event.currentIndex);
    }
  }
}
