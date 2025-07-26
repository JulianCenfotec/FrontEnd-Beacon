import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Route, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-general-plan-homepage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './generalPlanHome.component.html',
})
export class GeneralPlanHomeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }
}
