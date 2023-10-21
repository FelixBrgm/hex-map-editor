import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClickService {
	clickEE: EventEmitter<{event: any, x: number, y: number}> = new EventEmitter();

	constructor() { }
}
