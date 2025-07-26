import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MyAccountComponent } from '../../../my-account/my-account.component';
import { ConfigDisplayNotifyComponent } from './notify/notify.component';
import { ConfigSubscriptionPlanComponent } from './subscriptionPlan/subscriptionPlan.component';
import { ConfigBanksComponent } from './banks/banks.component';

@Component({
  selector: 'app-config-display',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterOutlet,
    MyAccountComponent, 
    ConfigDisplayNotifyComponent,
    ConfigSubscriptionPlanComponent,
    ConfigBanksComponent],
  templateUrl: './config-display.component.html',
})
export class ConfigDisplayComponent {}
