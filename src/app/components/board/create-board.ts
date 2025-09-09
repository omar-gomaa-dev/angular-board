import { Component, signal } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-board',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full p-6">
      @if (!creatingBoard()) {
      <button
        (click)="creatingBoard.set(true)"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
      >
        + Create Board
      </button>
      } @else {
      <div class="flex flex-col gap-3 w-full max-w-sm">
        <input
          [(ngModel)]="newBoardTitle"
          placeholder="Enter board name"
          class="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
          (keyup.enter)="saveBoard()"
        />
        @if (errorMessage) {
        <span class="text-red-500 text-m mt-1 block">
          {{ errorMessage }}
        </span>
        }
        <label
          for="file-upload"
          class="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <span class="text-gray-600">Click to upload </span>
          <span class="text-sm text-gray-400">PNG, JPG (max 5MB)</span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          class="hidden"
        />

        <div class="flex gap-2">
          <button
            (click)="saveBoard()"
            class="text-sm bg-green-600 text-white  px-8 py-2 rounded hover:bg-green-700 ml-auto"
          >
            Save
          </button>
          <button
            (click)="cancelCreate()"
            class="bg-red-600 text-sm  text-white px-8 py-2 rounded hover:bg-red-700 ml-auto"
          >
            Cancel
          </button>
        </div>
      </div>
      }
    </div>
  `,
})
export class CreateBoardComponent {
  creatingBoard = signal(false);
  newBoardTitle = '';
  selectedImage: string | null = null;
  errorMessage = '';
  constructor(private boardService: BoardService) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.selectedImage = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveBoard() {
    if (this.newBoardTitle.trim()) {
      this.boardService.addBoard(
        this.newBoardTitle.trim(),
        this.selectedImage ?? undefined
      );
      this.newBoardTitle = '';
      this.selectedImage = null;
      this.creatingBoard.set(false);
      this.errorMessage = ''; // ✅ فضي الرسالة بعد الحفظ الناجح
    } else {
      this.errorMessage = '⚠️ Please enter a board name!'; // ✅ خزن الرسالة هنا
    }
  }

  cancelCreate() {
    this.creatingBoard.set(false);
    this.newBoardTitle = '';
    this.selectedImage = null;
  }
}
