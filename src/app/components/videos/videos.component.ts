import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {setFaviconBeacon} from "../../utility/page-icon.utility";

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit{
  private windowTitle = "Videos Interactivos | Aplicación | Beacon";
  private router = inject(Router);
  continue(){
    this.router.navigateByUrl("/beacon/app/videoCreditCard");
  }
  ngOnInit() {
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

}
