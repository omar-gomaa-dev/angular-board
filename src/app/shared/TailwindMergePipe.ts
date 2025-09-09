import { Pipe, PipeTransform } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Pipe({
  name: 'tailwindMerge',
  standalone: true, // Important for usage in Standalone Components
})
export class TailwindMergePipe implements PipeTransform {
  transform(value: string, additional?: string): string {
    return twMerge(value, additional);
  }
}
