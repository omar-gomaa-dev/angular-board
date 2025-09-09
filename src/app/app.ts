import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { BoardComponent } from './components/board/board';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  template: ` <app-layout /><router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('kanban-board');
}
