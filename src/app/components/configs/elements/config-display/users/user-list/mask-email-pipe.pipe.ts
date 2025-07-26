import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskEmail',
  standalone: true
})
export class MaskEmailPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) {
      return '';
    }

    const parts = value.split('@');
    const maskedPart = parts[0].replace(/.(?=.{3})/g, '*');
    return `${maskedPart}@${parts[1]}`;
  }


}
