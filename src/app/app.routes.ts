import { Routes } from "@angular/router";
import * as AllGuards from "../app/guards/all-guards";
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { UsersComponent } from "./components/configs/elements/config-display/users/users.component";
import { IRoleType } from "./interfaces";
import { ForgotPasswordComponent } from "./pages/auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./pages/auth/reset-password/reset-password.component";
import { ConfigComponent } from "./pages/config/config.component";
import { ConfigDisplayNotifyComponent } from "./components/configs/elements/config-display/notify/notify.component";
import { ConfigDisplayAccountComponent } from "./components/configs/elements/config-display/account/account.component";
import { ChangePasswordComponent } from "./components/configs/elements/config-display/change-password/change-password.component";
import { WaddleComponent } from "./pages/waddle/waddle.component";
import { HomepageComponent } from "./pages/home/home.component";
import { ErrorPageComponent } from "./pages/error/error.component";
import { ConfigSubscriptionPlanComponent } from "./components/configs/elements/config-display/subscriptionPlan/subscriptionPlan.component";
import { ConfigBanksComponent } from "./components/configs/elements/config-display/banks/banks.component";
import { SuscriptionComponent } from "./components/configs/elements/config-display/suscription/subscription.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SavingsCalculatorComponent } from "./components/calculator/elements/type/savings/savings-calculator.component";
import { UnifierCalculatorComponent } from "./components/calculator/elements/type/unifier/unifier-calculator.component";
import { CreditCalculatorComponent } from "./components/calculator/elements/type/credit/credit-calculator.component";
import { CalculatorDisplayComponent } from "./components/calculator/calculator-display/calculator-display.component";
import {VideoCreditCardComponent} from "./components/videos/CreditCard/videoCreditCard.component";
import { PlanViewerComponent } from "./components/plan-viewer/plan-viewer.component";
import { SharedPlansComponent } from "./components/plan-viewer/shared-plans/shared-plans.component";
import { SystemPlansComponent } from "./components/plan-viewer/system-plans/system-plans.component";
import { UserPlansComponent } from "./components/plan-viewer/user-plans/user-plans.component";
import { GeneralPlanHomeComponent } from "./components/generalPlan/generalPlanHome/generalPlanelHome.component";
import { PlanCreationComponent } from "./components/generalPlan/planGestor/planCreation/planCreation.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { HelpCenterComponent } from "./pages/help-center/help-center.component";
import {VideosComponent} from "./components/videos/videos.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "waddle",
    pathMatch: "full",
  },
  {
    path: "waddle",
    component: WaddleComponent,

    children: [
      {
        path: "**",
        redirectTo: "",
      },
    ],
  },
  {
    path: "beacon",
    children: [
      {
        path: "home",
        component: HomepageComponent,
        canActivate: [AllGuards.anyGuard],
      },
      {
        path: "login",
        component: LoginComponent,
        canActivate: [AllGuards.noneGuard],
      },
      {
        path: "register",
        component: RegisterComponent,
        canActivate: [AllGuards.noneGuard],
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        canActivate: [AllGuards.noneGuard],
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent,
        canActivate: [AllGuards.noneGuard],
      },
      {
        path: "help-center",
        component: HelpCenterComponent,
        canActivate: [AllGuards.anyGuard],
      },
      {
        path: "error-page",
        component: ErrorPageComponent,
        canActivate: [AllGuards.anyGuard],
      },
      {
        path: "app",
        component: DashboardComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
        },
        children: [
          {
            path: "plan-viewer",
            component: PlanViewerComponent,
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
              name: "Explorador de Plantillas",
              showInHeading: true,
            },
            children: [
              {
                path: "shared",
                component: SharedPlansComponent,
                canActivate: [AllGuards.userGuard],
                data: {
                  authorities: [
                    IRoleType.admin,
                    IRoleType.superAdmin,
                    IRoleType.user,
                  ],
                  name: "Plantillas de Comunidad",
                  showInHeading: true,
                }
              },
              {
                path: "system",
                component: SystemPlansComponent,
                canActivate: [AllGuards.userGuard],
                data: {
                  authorities: [
                    IRoleType.admin,
                    IRoleType.superAdmin,
                    IRoleType.user,
                  ],
                  name: "Plantillas del Sistema",
                  showInHeading: true,
                }
              },
              {
                path: "user",
                component: UserPlansComponent,
                canActivate: [AllGuards.userGuard],
                data: {
                  authorities: [
                    IRoleType.admin,
                    IRoleType.superAdmin,
                    IRoleType.user,
                  ],
                  name: "Mis Plantillas",
                  showInHeading: true,
                }
              },
              {
                path: "",
                redirectTo: "user",
                pathMatch: "full",
              },
              {
                path: "**",
                redirectTo: "user",
              }
            ],
          },
          {
            path: "panel",
            component: GeneralPlanHomeComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
            }
          },
          {
            
            path: "calendar",
            component: CalendarComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
            }
          },
          {
            path: "template-builder",
            component: PlanCreationComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
            }
          },
          {
            path: "calculator",
            component: CalculatorDisplayComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
            },
            children: [
              {
                path: "credit",
                component: CreditCalculatorComponent,
                data: {
                  authorities: [
                    IRoleType.admin,
                    IRoleType.superAdmin,
                    IRoleType.user,
                  ],
                  name: "Créditos",
                  showInHeading: true,
                }
              },
              {
                
                path: "unifier",
                component: UnifierCalculatorComponent,
                data: {
                  authorities: [
                    IRoleType.admin,
                    IRoleType.superAdmin,
                    IRoleType.user,
                  ],
                  name: "Unificación de Deudas",
                  showInHeading: true,
                }
              },
              {
                path: "savings",
                component: SavingsCalculatorComponent,
                data: {
                  authorities: [
                    IRoleType.admin,
                    IRoleType.superAdmin,
                    IRoleType.user,
                  ],
                  name: "Ahorro",
                  showInHeading: true,
                }
              },
              {
                path: "",
                redirectTo: "savings",
                pathMatch: "full",
              },
            ]
          },
          {
            path: "video",
            component:VideosComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
            },
            children: []
          },
          {
            path: "videoCreditCard",
            component:VideoCreditCardComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
            },
            children: []
          },
          {
            path: "",
            redirectTo: "panel",
            pathMatch: "full",
          },
        ]    
      },
      {
        path: "configuration",
        component: ConfigComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
        },
        children: [
          {
            path: "change-password",
            component: ChangePasswordComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
              name: "Cambio de Contraseña",
              showInSidebar: true,
              icon: "fa-solid fa-lock",
            },
          },
          {
            path: "account",
            component: ConfigDisplayAccountComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
              name: "Ajustes de la cuenta",
              showInSidebar: true,
              icon: "fa-solid fa-user",
            },
          },
          {
            path: "my-subscriptions",
            component: SuscriptionComponent,
            canActivate: [AllGuards.userOnlyGuard],
            data: {
              authorities: [
                IRoleType.user,
              ],
              name: "Mis Suscripciones",
              showInSidebar: true,
              icon: "fa-solid fa-credit-card",
            },
          },
          {
            path: "notifications",
            component: ConfigDisplayNotifyComponent,
            canActivate: [AllGuards.userGuard],
            data: {
              authorities: [
                IRoleType.admin,
                IRoleType.superAdmin,
                IRoleType.user,
              ],
              name: "Preferencias de Correo Electrónico",
              showInSidebar: true,
              icon: "fa-solid fa-bell",
            },
          },
          {
            path: "users",
            component: UsersComponent,
            canActivate: [AllGuards.adminGuard],
            data: {
              authorities: [IRoleType.admin, IRoleType.superAdmin],
              name: "Listado de usuarios",
              showInSidebar: true,
              icon: "fa-solid fa-users",
              adminOption: true,
            },
          },
          {
            path: "subscriptionPlan",
            component: ConfigSubscriptionPlanComponent,
            canActivate: [AllGuards.adminGuard],
            data: {
              authorities: [IRoleType.admin, IRoleType.superAdmin],
              name: "Ajustes de suscripciones",
              showInSidebar: true,
              icon: "fa-solid fa-cogs",
              adminOption: true,
            },
          },
          {
            path: "banks",
            component: ConfigBanksComponent,
            canActivate: [AllGuards.adminGuard],
            data: {
              authorities: [IRoleType.admin, IRoleType.superAdmin],
              name: "Ajuste de Intereses",
              showInSidebar: true,
              icon: "fa-solid fa-chart-line",
              adminOption: true,
            },
          },
          {
            path: "",
            redirectTo: "account",
            pathMatch: "full",
          },
        ],
      },
      {
        path: "index",
        redirectTo: "home",
      },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "**",
        redirectTo: "error-page",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "waddle",
    pathMatch: "full",
  },
];
