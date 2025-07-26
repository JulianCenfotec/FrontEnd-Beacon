import { Injectable, ElementRef, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  toggleMenu(navbarNav: ElementRef<HTMLElement>, btnMenu: ElementRef<HTMLElement>): void {
    const navbarNavElement = navbarNav.nativeElement;
    const btnMenuElement = btnMenu.nativeElement;
    const isExpanded = btnMenuElement.getAttribute('aria-expanded') === 'true';

    if (!isExpanded) {
      document.body.classList.remove('no-scroll');
      btnMenuElement.classList.remove('active');
      navbarNavElement.classList.remove('show');
      btnMenuElement.setAttribute('aria-expanded', 'false');
    } else {
      document.body.classList.add('no-scroll');
      btnMenuElement.classList.add('active');
      navbarNavElement.classList.add('show');
      btnMenuElement.setAttribute('aria-expanded', 'true');
    }
  }

  onNavItemClick(navbarNav: ElementRef<HTMLElement>, btnMenu: ElementRef<HTMLElement>, navbarCollapse: ElementRef<HTMLElement>): void {
    if (window.innerWidth <= 992) {
      const navbarNavElement = navbarNav.nativeElement;
      const btnMenuElement = btnMenu.nativeElement;
      const navbarCollapseElement = navbarCollapse.nativeElement;

      document.body.classList.remove('no-scroll');
      btnMenuElement.classList.remove('active');
      navbarNavElement.classList.remove('show');
      navbarCollapseElement.classList.remove('show');
      navbarCollapseElement.classList.remove('collapse');
      btnMenuElement.setAttribute('aria-expanded', 'false');
      navbarCollapseElement.classList.add('collapsing');

      setTimeout(() => {
        navbarCollapseElement.classList.remove('collapsing');
        navbarCollapseElement.classList.add('collapse');
      }, 200);
    }
  }

  goToTop(): void {
    window.scrollTo({
      behavior: 'instant',
      top: 0,
    });
  }

  scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      const yOffset = window.innerWidth >= 992 ? -70 : -50;
      const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: 'smooth'
      });
    }
  }

  addClickHandlers(renderer: Renderer2): void {
    const links = document.querySelectorAll('a[data-fragment]');
    links.forEach(link => {
      renderer.listen(link, 'click', (event) => {
        const fragment = link.getAttribute('data-fragment');
        if (fragment) {
          event.preventDefault();
          this.scrollToFragment(fragment);
        }
      });
    });
  }
}
