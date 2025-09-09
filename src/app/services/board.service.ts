// board.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Board, List, Card } from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private storageKey = 'boards';
  private activeKey = 'activeBoardId';

  private _boards = signal<Board[]>(this.loadBoards());
  private _activeBoardId = signal<string | null>(
    localStorage.getItem(this.activeKey) ?? null
  );

  boards = this._boards.asReadonly();
  activeBoard = computed(() =>
    this._boards().find((b) => b.id === this._activeBoardId())
  );

  constructor(private router: Router) {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this._boards()));
    });

    effect(() => {
      const activeId = this._activeBoardId();
      if (activeId) {
        localStorage.setItem(this.activeKey, activeId);
      } else {
        localStorage.removeItem(this.activeKey);
      }
    });
  }

  // 🟢 Load boards
  private loadBoards(): Board[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return JSON.parse(saved);
    return [];
  }

  // =============================
  // Board operations
  // =============================
  addBoard(title: string, image?: string): void {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title,
      lists: [],
      image,
      imageHd: image, // 🆕 Temporarily set the same image as high resolution
    };
    this._boards.update((boards) => [...boards, newBoard]);
    this.setActiveBoard(newBoard.id);
  }
  updateBoardImage(boardId: string, image: string): void {
    this._boards.update((boards) =>
      boards.map((board) =>
        board.id === boardId ? { ...board, image } : board
      )
    );
  }
  updateBoard(
    boardId: string,
    updates: Partial<Pick<Board, 'title' | 'image'>>
  ): void {
    this._boards.update((boards) =>
      boards.map((board) =>
        board.id === boardId ? { ...board, ...updates } : board
      )
    );
  }

  setActiveBoard(id: string | null): void {
    this._activeBoardId.set(id);
  }

  renameBoard(boardId: string, newTitle: string): void {
    this._boards.update((boards) =>
      boards.map((board) =>
        board.id === boardId ? { ...board, title: newTitle } : board
      )
    );
  }

  deleteBoard(boardId: string): void {
    this._boards.update((boards) =>
      boards.filter((board) => board.id !== boardId)
    );

    if (this._activeBoardId() === boardId) {
      this.setActiveBoard(null);
      this.router.navigate(['/']); // Use Angular Router for instant navigation
    }
  }

  // =============================
  // List operations (inside active board)
  // =============================
  addList(title: string): void {
    this.updateActiveBoard((board) => ({
      ...board,
      lists: [...board.lists, { id: crypto.randomUUID(), title, cards: [] }],
    }));
  }

  deleteList(listId: string): void {
    this.updateActiveBoard((board) => ({
      ...board,
      lists: board.lists.filter((l) => l.id !== listId),
    }));
  }

  renameList(listId: string, title: string): void {
    this.updateActiveBoard((board) => ({
      ...board,
      lists: board.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
    }));
  }

  // =============================
  // Card operations (inside active board)
  // =============================
  addCard(listId: string, title: string, dueDate?: string): void {
    const newCard: Card = { id: crypto.randomUUID(), title, dueDate };
    this.updateActiveBoard((board) => ({
      ...board,
      lists: board.lists.map((l) =>
        l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
      ),
    }));
  }

  deleteCard(listId: string, cardId: string): void {
    this.updateActiveBoard((board) => ({
      ...board,
      lists: board.lists.map((l) =>
        l.id === listId
          ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
          : l
      ),
    }));
  }

  editCard(
    listId: string,
    cardId: string,
    updates: Partial<Omit<Card, 'id'>>
  ): void {
    this.updateActiveBoard((board) => ({
      ...board,
      lists: board.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              cards: l.cards.map((c) =>
                c.id === cardId ? { ...c, ...updates } : c
              ),
            }
          : l
      ),
    }));
  }

  // =============================
  // Utility
  // =============================
  private updateActiveBoard(updater: (board: Board) => Board): void {
    this._boards.update((boards) =>
      boards.map((b) => (b.id === this._activeBoardId() ? updater(b) : b))
    );
  }

  // =============================
  // Drag & Drop operations
  // =============================
  moveCardWithinList(
    listId: string,
    prevIndex: number,
    currIndex: number
  ): void {
    this._boards.update((boards) => {
      const activeId = this._activeBoardId();
      return boards.map((board) => {
        if (board.id !== activeId) return board;
        const lists = board.lists.map((l) => {
          if (l.id !== listId) return l;
          const cards = [...l.cards];
          const [moved] = cards.splice(prevIndex, 1);
          if (moved) {
            cards.splice(currIndex, 0, moved);
          }
          return { ...l, cards };
        });
        return { ...board, lists };
      });
    });
  }

  moveCard(
    fromListId: string,
    toListId: string,
    prevIndex: number,
    currIndex: number
  ): void {
    this._boards.update((boards) => {
      const activeId = this._activeBoardId();
      return boards.map((board) => {
        if (board.id !== activeId) return board;

        let movedCard: Card | undefined;
        const listsAfterRemove = board.lists.map((l) => {
          if (l.id === fromListId) {
            const cards = [...l.cards];
            [movedCard] = cards.splice(prevIndex, 1);
            return { ...l, cards };
          }
          return l;
        });

        const lists = listsAfterRemove.map((l) => {
          if (l.id === toListId && movedCard) {
            const cards = [...l.cards];
            cards.splice(currIndex, 0, movedCard);
            return { ...l, cards };
          }
          return l;
        });

        return { ...board, lists };
      });
    });
  }

  moveList(previousIndex: number, currentIndex: number): void {
    this.updateActiveBoard((board) => {
      const updatedLists = [...board.lists];
      const [movedList] = updatedLists.splice(previousIndex, 1);
      updatedLists.splice(currentIndex, 0, movedList);
      return { ...board, lists: updatedLists };
    });
  }
}
