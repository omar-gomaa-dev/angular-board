// 📂 src/app/layout/header.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header
      class="h-14 bg-gray-950 text-white flex items-center justify-center shadow-md relative"
    >
      <h1 class="text-lg font-bold">Kanban Board</h1>
    </header>
  `,
})
export class HeaderComponent {
  @Output() menuClicked = new EventEmitter<Event>();
}
