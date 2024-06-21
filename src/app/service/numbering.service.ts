import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberingService {

  private currentNumber = 0;

  constructor() { }

  getNextNumber(): number {
    return ++this.currentNumber;
  }
}
