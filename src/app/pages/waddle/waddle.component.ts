import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { setFaviconWaddle } from '../../utility/page-icon.utility';

@Component({
  selector: 'waddle-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './waddle.component.html',
  styleUrls: ['./waddle.component.scss']
})
export class WaddleComponent implements OnInit, AfterViewInit {
  private windowTitle = 'Waddle | Sigamos adelante';
  
  @ViewChild('navbarNav', { static: true }) navbarNav!: ElementRef<HTMLElement>;
  @ViewChild('btnMenu', { static: true }) btnMenu!: ElementRef<HTMLElement>;
  @ViewChild('navbarCollapse', { static: true }) navbarCollapse!: ElementRef<HTMLElement>;

  carouselData = [
    {
      image: "../../../assets/img/Img-CG.png",
      title: "Luis Monge",
      description1: "Coordinador General",
      description2: "Desarrollo Web UI/UX"
    },
    {
      image: "../../../assets/img/Img-CC.png",
      title: "Pil Moon",
      description1: "Coordinador de Calidad",
      description2: "Desarrollo de Software"
    },
    {
      image: "../../../assets/img/Img-CD.png",
      title: "Anthony Padilla",
      description1: "Coordinador de Desarrollo",
      description2: "Desarrollo Full-Stack"
    },
    {
      image: "../../../assets/img/Img-CS1.png",
      title: "Emyel Vado",
      description1: "Coordinadores de Soporte",
      description2: "Analista QA"
    },
    {
      image: "../../../assets/img/Img-CS2.png",
      title: "Julian Cabrera",
      description1: "Coordinadores de Soporte",
      description2: "Desarrollo de Software"
    },
  ];

  carouselGroups: any[][] = [];

  constructor(private router: Router, private route: ActivatedRoute, private renderer: Renderer2, private navigationService: NavigationService) {}

  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconWaddle();
    this.createCarouselItems();
    window.addEventListener('resize', this.createCarouselItems.bind(this));
  }

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.onWindowScroll.bind(this));
    this.navigationService.addClickHandlers(this.renderer);
  }

  onWindowScroll(): void {
    if (window.scrollY > 106) {
      this.navbarNav.nativeElement.classList.add('scrolled');
    } else {
      this.navbarNav.nativeElement.classList.remove('scrolled');
    }
  }

  createCarouselItems() {
    const windowWidth = window.innerWidth;
    let itemsPerSlide;

    if (windowWidth < 768) {
      itemsPerSlide = 1;
    } else if (windowWidth < 992) {
      itemsPerSlide = 2;
    } else {
      itemsPerSlide = 3;
    }

    this.carouselGroups = [];
    for (let i = 0; i < this.carouselData.length; i += itemsPerSlide) {
      this.carouselGroups.push(this.carouselData.slice(i, i + itemsPerSlide));
    }
  }

  toggleMenu(): void {
    this.navigationService.toggleMenu(this.navbarNav, this.btnMenu);
  }

  scrollToFragment(fragment: string) {
    this.navigationService.scrollToFragment(fragment);
  }

  onNavItemClick(): void {
    this.navigationService.onNavItemClick(this.navbarNav, this.btnMenu, this.navbarCollapse);
  }

  goTo(): void {
    this.navigationService.goToTop();
  }
}