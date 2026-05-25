import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'label[appRequiredAsterisk]',
  standalone: true,
})
export class RequiredAsteriskDirective implements OnInit {
  constructor(
    private readonly elementRef: ElementRef<HTMLLabelElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const label = this.elementRef.nativeElement;

    const spacer = this.renderer.createText(' ');
    const asterisk = this.renderer.createElement('span');
    this.renderer.addClass(asterisk, 'required-asterisk');
    this.renderer.setAttribute(asterisk, 'aria-hidden', 'true');
    this.renderer.appendChild(asterisk, this.renderer.createText('*'));

    const srOnly = this.renderer.createElement('span');
    this.renderer.addClass(srOnly, 'sr-only');
    this.renderer.appendChild(srOnly, this.renderer.createText(' (required)'));

    this.renderer.appendChild(label, spacer);
    this.renderer.appendChild(label, asterisk);
    this.renderer.appendChild(label, srOnly);
  }
}
