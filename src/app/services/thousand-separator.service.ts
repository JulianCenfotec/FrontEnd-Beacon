import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThousandSeparatorService {

  constructor() { }

  formatNumber(value: string): string {

    const cleanValue = value.replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  }

}
