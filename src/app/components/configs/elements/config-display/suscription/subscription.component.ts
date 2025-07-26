import { CommonModule, NgFor } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ICancelCallbackData, IClientAuthorizeCallbackData, ICreateOrderRequest, IOnApproveCallbackActions, IOnApproveCallbackData, IOnClickCallbackActions, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { SubscriptionPlanService } from '../../../../../services/subscriptionPlan.service';
import { ReportingService } from '../../../../../services/reporting.service';
import { ISubscriptionPlan, IUserSubscription, UserSubscriptionStateEnum } from '../../../../../interfaces';
import { setFaviconBeacon } from '../../../../../utility/page-icon.utility';

@Component({
	imports: [NgxPayPalModule, CommonModule],
	templateUrl: './subscription.component.html',
	styleUrl: './subscription.component.scss',
	selector: 'app-suscription',
	standalone: true,
})
export class SuscriptionComponent implements OnInit {
	private windowTitle = 'Gestión de pagos | Configuraciones | Beacon';

	private reporting = inject(ReportingService);
	private service = inject(SubscriptionPlanService);

	protected paypalUserSubscription: IUserSubscription | null = null;
	protected pastSuscriptions: Array<IUserSubscription> = [];
	protected selectedPlan: ISubscriptionPlan | null = null;
	protected configs: Array<ISubscriptionPlan> = [];
	protected selected: IPayPalConfig | null = null;

	public constructor() {
		this.service.getAllSignal();

		effect(() => {
			const list = this.service.subscriptionPlan$();
			this.configs = list;
		});
	}

	private async onApprove(data: IOnApproveCallbackData, actions: IOnApproveCallbackActions) {
		const details = await actions.order.get()
		console.log('Transaction completed by:');
		console.table(details.payer);
	}

	private async onClientAuthorization(authorization: IClientAuthorizeCallbackData) {
		this.service
			.approvePaypalSubscriptionSignal(this.paypalUserSubscription!)
			.subscribe({
				next: (response: IUserSubscription) => {
					this.reloadPastSubscriptions();
					this.paypalUserSubscription = response;
					this.reporting.info('Se ha autorizado la transacción mediante Paypal');
				},
				error: _ => this.reporting.error('Error al autorizar la suscripción mediante Paypal.'),
			});
	}

	private async onCancel(data: ICancelCallbackData, actions: any) {
		this.service
			.cancelPaypalSubscriptionSignal(this.paypalUserSubscription!)
			.subscribe({
				next: (response: IUserSubscription) => {
					this.reloadPastSubscriptions();
					this.paypalUserSubscription = response;
					this.reporting.info('Se ha cancelado la suscripción mediante Paypal');
				},
				error: _ => this.reporting.error('Error al cancelar la suscripción mediante Paypal.'),
			});
	}

	private async onError(error: any) {
		this.service
			.errorPaypalSubscriptionSignal(this.paypalUserSubscription!)
			.subscribe({
				next: (response: IUserSubscription) => {
					this.reloadPastSubscriptions();
					this.paypalUserSubscription = response;
					this.reporting.info('Se ha producido un error en la transacción mediante Paypal');
				},
				error: _ => this.reporting.error('Error al cancelar la suscripción mediante Paypal.'),
			});
	}

	private async onClick(data: any, actions: IOnClickCallbackActions) {
		this.service
			.subscribeToPlanSignal(this.selectedPlan!)
			.subscribe({
				next: (response: IUserSubscription) => {
					this.paypalUserSubscription = response;
					this.reporting.info('Se le redirigirá a la pasarela de pago de Paypal');
				},
				error: _ => {
					this.reporting.error('Error al suscribirse al plan mediante Paypal.');
					actions.reject();
				},
			});
	}

	private createOrderRequest(plan: ISubscriptionPlan): (data: IPayPalConfig) => ICreateOrderRequest {
		return (_: IPayPalConfig) => ({
			intent: 'CAPTURE',
			purchase_units: [{
				amount: {
					currency_code: 'USD',
					value: plan.precio.toString(),
					breakdown: {
						item_total: {
							currency_code: 'USD',
							value: plan.precio.toString(),
						}
					}
				},
				items: [{
					name: 'Waddle | Beacon Subscription | '.concat(plan.titulo),
					category: 'DIGITAL_GOODS',
					quantity: '1',
					unit_amount: {
						currency_code: 'USD',
						value: plan.precio.toString(),
					},
				}]
			}]
		});
	}

	private createConfiguration(plan: ISubscriptionPlan): IPayPalConfig {
		return ({
			clientId: 'ARr71gQdyunTurOLr8wQhdhZsEf60oQkxPQqhHS5_5UepvOYwdzR-80kRDHHznrpepfUWfJ8VPyHUasi',
			onClientAuthorization: this.onClientAuthorization.bind(this),
			createOrderOnClient: this.createOrderRequest(plan),
			onApprove: this.onApprove.bind(this),
			onCancel: this.onCancel.bind(this),
			onError: this.onError.bind(this),
			onClick: this.onClick.bind(this),
			advanced: { commit: 'true' },
			currency: 'USD',
			style: {
				layout: 'horizontal',
				label: 'checkout',
				color: 'white',
				tagline: false,
				shape: 'pill',
			},
		});
	}

	protected selectSubscription(subscription: ISubscriptionPlan): void {
		this.selected = this.createConfiguration(subscription);
		this.selectedPlan = subscription;
	}

	protected paypalUserSubscriptionDate(subscription: number): string {
		if (subscription) {
			const date = new Date(subscription);
			return date.toLocaleDateString();
		} else return '';
	}

	private reloadPastSubscriptions(): void {
		this.service.getUserSubscriptionSignal()
			.subscribe({
				next: (response: Array<IUserSubscription>) => {
					this.pastSuscriptions = response
						.sort((a, b) => a.createdAt - b.createdAt);

					for (const subscription of this.pastSuscriptions) {
						const now = Date.now();
						const expiration = new Date(subscription.endOfSuscriptionAt).getTime();
						if (now < expiration && UserSubscriptionStateEnum.APPROVED === subscription.estado) {
							this.paypalUserSubscription = subscription;
						}
					}
				},
				error: _ => this.reporting.error("Error al obtener la suscripción del usuario"),
			});
	}

	public ngOnInit(): void {
		window.document.title = this.windowTitle;
    	setFaviconBeacon();
		return this.reloadPastSubscriptions();
	}
}
