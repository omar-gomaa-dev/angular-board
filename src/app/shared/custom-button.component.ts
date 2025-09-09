import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core'; // Adjust the path as needed
import {
  LucideAngularModule,
  LoaderCircle,
  LucideIconData,
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TailwindMergePipe } from './TailwindMergePipe';

@Component({
  selector: 'app-custom-button',
  imports: [
    CommonModule,
    TailwindMergePipe, // If standalone pipe
    LucideAngularModule,
    TranslateModule, // Instead of TranslatePipe
  ],
  template: `
    <button
      [class]="
        ' cursor-pointer bg-primary text-background rounded transition duration-200'
          | tailwindMerge : customClasses
      "
      [ngClass]="{
        'opacity-50 cursor-not-allowed': disabled || loading,
        'hover:invert-[.08]': !disabled && !loading
      }"
      [disabled]="loading || disabled"
      (click)="onClick.emit($event)"
      [type]="type || 'button'"
      [title]="tooltip || ''"
    >
      <div
        [class]="
          'flex justify-between w-full text-center'
            | tailwindMerge : customParentClasses
        "
      >
        <div class="flex justify-center items-center">
          <i-lucide
            [img]="loading || !icon ? LoaderCircle : icon"
            [size]="iconSize"
            class="transition-all flex mx-2 w-fit"
            [ngClass]="{
              block: loading || icon,
              hidden: !loading && !icon,
              'animate-spin': loading
            }"
          />
        </div>
        @if(label){
        <p [class]="'w-full' | tailwindMerge : customLabelClasses">
          {{ label | translate }}
        </p>
        }@else if(!label){
        <div class="w-full">
          <ng-content />
        </div>
        }
      </div>
    </button>
  `,
})
export class CustomButtonComponent {
  @Input() label: string = '';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customClasses: string = '';
  @Input() customLabelClasses: string = '';
  @Input() customParentClasses: string = '';
  @Input() type: string = '';
  @Input() iconSize?: number = undefined;
  @Input() icon?: LucideIconData;
  @Input() tooltip?: string;

  onClick = output<any>();

  LoaderCircle = LoaderCircle;
}
