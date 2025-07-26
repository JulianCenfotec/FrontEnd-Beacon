import { Observable, catchError, tap, throwError } from 'rxjs';
import { Injectable, signal, inject } from "@angular/core";

import { BaseService } from "./base-service";
import { AuthService } from "./auth.service";
import { IPlan } from "../interfaces";

export { IPlan };

@Injectable({
	providedIn: 'root'
})
export class PlanService extends BaseService<IPlan> {
	private planListSignal = signal<IPlan[]>([]);
	protected authService = inject(AuthService);
	protected override source: string = 'plan';

	get planss$() {
		return this.planListSignal;
	}

	savePlanSignal(plan: IPlan): Observable<any> {
		const user = this.authService.getUser();
		if (!user) {
			throw new Error('El usuario no está autenticado');
		}
		plan.usuario = { id: user.id! };
		return this.add(plan).pipe(
			tap((response: any) => {
				this.planListSignal.update(plans => [response, ...plans]);
			}),
			catchError(error => {
				console.error('Error saving user', error);
				return throwError(error);
			})
		);
	}

	getPlanByUserSignal(): Observable<Array<IPlan>> {
		const user = this.authService.getUser();
		if (!user) {
			throw new Error('El usuario no está autenticado');
		}

		const route = this.source
			.concat('/user/', user.id?.toString() || '0');

		return this.http
			.get<Array<IPlan>>(route);
	}

	getPlanIfSystemSignal(): Observable<Array<IPlan>> {
		const route = this.source
			.concat('/system');

		return this.http
			.get<Array<IPlan>>(route);
	}

	getPlanIfSharedSignal(): Observable<Array<IPlan>> {
		const route = this.source
			.concat('/shared');

		return this.http
			.get<Array<IPlan>>(route);
	}

	postPlanSignal(plan: IPlan): Observable<IPlan> {
		const user = this.authService.getUser();
		if (!user) {
			throw new Error('El usuario no está autenticado');
		}

		plan.usuario = { id: user.id! };
		const route = this.source;

		return this.http
			.post<IPlan>(route, plan);
	}

	patchPlanSharedSignal(plan: IPlan): Observable<IPlan> {
		const route = this.source
			.concat('/shared/', plan.id!.toString());

		return this.http
			.patch<IPlan>(route, plan);
	}
}
