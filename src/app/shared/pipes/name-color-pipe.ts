import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameColor',
  standalone: true,
})
export class NameColorPipe implements PipeTransform {
  transform(name: string | null | undefined, opacity: number = 1): string {
    if (!name) return `rgba(128,128,128,${opacity})`;

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
