import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { CreateBoardComponent } from '../board/create-board';

@Component({
  selector: 'app-boards-home',
  standalone: true,
  imports: [CommonModule, CreateBoardComponent],
  template: `
    <div class="p-6">
      <img
        src="/bg.jpg"
        alt="Background"
        class="absolute inset-0 w-full h-full object-cover -z-4"
      />
      <h2 class="text-4xl p-3 font-bold text-gray-200 drop-shadow-md mb-4">
        Your Boards
      </h2>
      <!-- عرض البوردات -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (board of boardService.boards(); track board.id) {
        <div
          class="flex items-center gap-3 p-4 bg-gray-300 rounded-xl shadow cursor-pointer
         hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
          (click)="openBoard(board.id)"
        >
          @if (board.image) {
          <img
            [src]="board.image"
            [srcset]="
              board.image + ' 1x, ' + (board.imageHd || board.image) + ' 2x'
            "
            alt="Board"
            class="w-15 h-15 rounded-full object-cover"
          />
          }
          <div class="text-lg font-semibold">{{ board.title }}</div>
        </div>
        }
      </div>

      <!-- كومبوننت إنشاء البورد -->
      <div class="mt-6">
        <app-create-board></app-create-board>
      </div>
    </div>
  `,
})
export class BoardsHomeComponent {
  constructor(public boardService: BoardService, private router: Router) {}

  openBoard(id: string) {
    this.router.navigate(['/boards', id]);
  }
}
