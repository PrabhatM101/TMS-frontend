import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getInitials',
  standalone: true,
})
export class GetInitialsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const parts = value.trim().split(/\s+/);
    let initials = parts.map(p => p[0].toUpperCase()).join('');
    return initials.slice(0, 2);
  }
}
