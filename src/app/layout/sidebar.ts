import { Component, Input, HostListener } from '@angular/core';
import { BoardService } from '../services/board.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div
      class="fixed top-13 left-0 w-64 bg-white overflow-y-auto dark:bg-gray-900 shadow-lg z-50 h-screen border-r p-2 rounded-lg transition"
      [class.-translate-x-full]="!isOpen"
      (click)="$event.stopPropagation()"
    >
      <!-- Tabs Header -->
      <div class="relative">
        <ul
          class="flex px-1.5 py-1.5 list-none rounded-md bg-slate-100 dark:bg-gray-800"
          role="tablist"
        >
          <!-- Boards Tab -->
          <li class="flex-1 text-center">
            <button
              class="flex items-center justify-center w-full px-2 py-2 text-sm rounded-md cursor-pointer transition-all"
              [class.bg-white]="activeTab === 'boards'"
              (click)="activeTab = 'boards'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-4 h-4 mr-1.5 text-slate-500"
              >
                <path
                  d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z"
                ></path>
                <path
                  d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z"
                ></path>
                <path
                  d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z"
                ></path>
              </svg>
              Boards
            </button>
          </li>

          <!-- Settings Tab -->
          <li class="flex-1 text-center">
            <button
              class="flex items-center justify-center w-full px-2 py-2 text-sm rounded-md cursor-pointer transition-all"
              [class.bg-white]="activeTab === 'settings'"
              (click)="activeTab = 'settings'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-4 h-4 ml-1.5 text-slate-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Settings
            </button>
          </li>
        </ul>
      </div>

      <!-- Tabs Content -->
      <div class="mt-4">
        <!-- Boards Content -->
        @if (activeTab === 'boards') {
        <div class="space-y-2">
          <ul class="flex flex-col gap-1">
            @for (board of boards(); track board.id) {
            <li
              [routerLink]="['/boards', board.id]"
              class="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
              [class.bg-blue-100]="board.id === activeBoard()?.id"
            >
              @if (board.image) {
              <img
                [src]="board.image"
                alt="board-img"
                class="w-6 h-6 rounded-full object-cover"
              />
              }

              <span class="cursor-pointer">{{ board.title }}</span>
            </li>
            }
          </ul>

          <!-- Add Board -->
          @if (addingBoard) {
          <div class="flex flex-col gap-2">
            <input
              type="text"
              [(ngModel)]="newBoardTitle"
              placeholder="Board name"
              class="w-full bg-transparent border border-slate-200 rounded-md px-3 py-2"
              (keyup.enter)="saveBoard()"
            />

            <label
              for="file-upload"
              class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
              <span class="text-gray-600">Click to upload or drag & drop</span>
              <span class="text-sm text-gray-400">PNG, JPG (max 5MB)</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              (change)="onFileSelected($event)"
              class="hidden"
            />

            <div class="flex justify-between items-center px-8 py-2 ">
              <button (click)="saveBoard()">Save</button>
              <button
                (click)="cancelCreate()"
                class="bg-gray-400 text-sm  text-white px-4 py-2 rounded hover:bg-gray-700 ml-auto"
              >
                Cancel
              </button>
            </div>

            @if (errorMessage) {
            <span class="text-red-500 text-sm">{{ errorMessage }}</span>
            }
          </div>
          } @else {
          <button
            class="w-full text-sm text-left px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded mt-2"
            (click)="toggleAddBoard()"
          >
            + Add Board
          </button>
          }
        </div>
        }

        <!-- Settings Content -->
        @if (activeTab === 'settings') {
        <div class="space-y-4">
          <!-- Manage Boards -->
          <div>
            <h4 class="font-medium mb-2">Manage Boards</h4>
            <ul class="space-y-2">
              @for (board of boards(); track board.id) {
              <li class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <div class=" flex justify-between items-center">
                  @if (board.image) {
                  <img
                    [src]="board.image"
                    alt="board-img"
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  }
                  <span>{{ board.title }}</span>
                  <button
                    (click)="toggleBoardMenu(board.id)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      class="w-4 h-4 ml-1.5 text-slate-500"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                @if (openBoardMenuId === board.id) {
                <div class="mt-1 pl-4 space-y-2 text-sm text-center">
                  <!-- Rename -->
                  @if (editingBoardId !== board.id) {
                  <button
                    (click)="startRename(board.id, board.title)"
                    class="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto"
                  >
                    Rename
                  </button>
                  } @else {
                  <div class="flex flex-col gap-2">
                    <input
                      [(ngModel)]="tempBoardTitle"
                      class="border rounded px-1 py-0.5 flex-1 dark:bg-gray-800 dark:text-white"
                    />
                    <div class="flex justify-end gap-2">
                      <button
                        class="text-sm bg-green-600 text-white  px-4 py-2 rounded hover:bg-green-700 ml-auto"
                        (click)="saveRename(board.id)"
                      >
                        Save
                      </button>
                      <button
                        class="bg-gray-400 text-sm  text-white px-4 py-2 rounded hover:bg-gray-700 ml-auto"
                        (click)="cancelRename()"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  }

                  <!-- Edit Image Button -->

                  <div class="flex justify-between items-center mt-2 gap-11">
                    <button
                      type="button"
                      class="px-4 py-2 text-sm bg-blue-600 text-white  rounded hover:bg-blue-700 ml-auto"
                      (click)="fileInput.click()"
                    >
                      Edit Image
                    </button>

                    <!-- Hidden Input -->
                    <input
                      #fileInput
                      type="file"
                      accept="image/*"
                      (change)="onImageSelected($event, board.id)"
                      class="hidden"
                    />

                    <!-- Delete -->

                    <button
                      (click)="confirmDelete(board.id)"
                      class="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 ml-auto"
                      type="button"
                    >
                      Delete
                    </button>

                    <!-- Modal -->
                    <div
                      *ngIf="showConfirmModal"
                      class="fixed inset-0 flex items-center justify-center z-50"
                    >
                      <div
                        class=" bg-gray-200 rounded-lg shadow-lg p-6 w-80 text-center border"
                      >
                        <p class="text-lg mb-4 text-gray- dark:text-gray-200">
                          Are you sure you want to delete this board?
                        </p>
                        <div class="flex justify-center gap-4">
                          <button
                            (click)="deleteConfirmed()"
                            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Yes
                          </button>
                          <button
                            (click)="cancelDelete()"
                            class="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                }
              </li>
              }
            </ul>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class SidebarComponent {
  @Input() isOpen = false;

  showBoards = true;
  settingsOpen = false;

  editingBoardId: string | null = null;
  tempBoardTitle = '';
  openBoardMenuId: string | null = null;
  errorMessage = '';

  addingBoard = false;
  newBoardTitle = '';
  selectedImage: string | null = null;
  activeTab: 'boards' | 'settings' = 'boards';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private boardService: BoardService) {
    this.boards = this.boardService.boards;
    this.activeBoard = this.boardService.activeBoard;
  }

  boards = () => this.boardService.boards();
  activeBoard = () => this.boardService.activeBoard();

  // 🟢 Boards
  selectBoard(id: string) {
    this.boardService.setActiveBoard(id);
  }
  // 🟢 Add Board
  toggleAddBoard() {
    this.addingBoard = true;
    this.newBoardTitle = '';
    this.selectedImage = null;
    this.errorMessage = '';
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.selectedImage = reader.result as string; // ✅ Save the image
      };
      reader.readAsDataURL(file);
    }
  }

  saveBoard() {
    if (!this.newBoardTitle.trim()) {
      this.errorMessage = '⚠️ Please enter a board name!';
      return;
    }
    this.boardService.addBoard(
      this.newBoardTitle.trim(),
      this.selectedImage ?? undefined
    );
    this.cancelCreate();
  }

  cancelCreate() {
    this.addingBoard = false;
    this.newBoardTitle = '';
    this.selectedImage = null;
    this.errorMessage = '';
  }

  // 🟢 Rename
  startRename(boardId: string, currentTitle: string) {
    this.editingBoardId = boardId;
    this.tempBoardTitle = currentTitle;
  }

  saveRename(boardId: string) {
    if (this.tempBoardTitle.trim()) {
      this.boardService.renameBoard(boardId, this.tempBoardTitle.trim());
    }
    this.cancelRename();
  }

  cancelRename() {
    this.editingBoardId = null;
    this.tempBoardTitle = '';
  }

  // 🟢 Update Image
  onImageSelected(event: Event, boardId: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.boardService.updateBoard(boardId, { image: base64Image }); // ✅ Update the image
      };
      reader.readAsDataURL(file);
    }
  }

  // 🟢 Delete
  deleteBoard(boardId: string) {
    this.boardService.deleteBoard(boardId);
  }
  showConfirmModal = false;
  boardIdToDelete: string | null = null;

  confirmDelete(id: string) {
    this.boardIdToDelete = id;
    this.showConfirmModal = true;
  }

  deleteConfirmed() {
    if (this.boardIdToDelete) {
      // Call the original delete function
      this.deleteBoard(this.boardIdToDelete);
    }
    this.showConfirmModal = false;
    this.boardIdToDelete = null;
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.boardIdToDelete = null;
  }

  // 🟢 Toggle Menu
  toggleBoardMenu(boardId: string) {
    this.openBoardMenuId = this.openBoardMenuId === boardId ? null : boardId;
  }

  // 🟢 Settings
  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  // 🟢 Close sidebar when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-sidebar')) {
      this.isOpen = false;
    }
    if (!target.closest('.menu-container')) {
      this.openBoardMenuId = null; // Close board settings menu
    }
  }
}
