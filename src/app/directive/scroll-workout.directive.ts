import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appScrollWorkout]'
})
export class ScrollWorkoutDirective {
  constructor() {}
  @Output() public appScrollWorkout = new EventEmitter<Number>();
  @HostListener('scroll', ['$event', '$event.target'])
  public onClick(positionChange: Number, targetElement: HTMLElement): void {
    const position = Math.round(event.srcElement.scrollLeft / event.srcElement.clientWidth);
    this.appScrollWorkout.emit(position);
  }
}
