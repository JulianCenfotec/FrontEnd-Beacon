import { Injectable } from '@angular/core';
import { ILoginResponse, IResponse, IUser } from '../interfaces';
import { Observable, firstValueFrom, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private expiresIn! : number;
  private accessToken!: string;
  private user: IUser = {email: '', authorities: []};

  constructor(private http: HttpClient) {
    this.load();
  }

  public save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));

    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));

    if (this.expiresIn)
      localStorage.setItem('expiresIn', this.expiresIn.toString());
  }

  private load(): void {
    let token = localStorage.getItem('access_token');
    if (token) this.accessToken = token;
    let exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    if (!this.accessToken){
      return false;
    } else {
      return true;
    }
  }

  public isExpiredSession() {
    this.load();
    return new Date(this.expiresIn).getTime() - Date.now() > 0 ? false : true;
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: any) => {
        this.expiresIn = (Date.now() + response.expiresIn);
        this.user.email = credentials.email;
        this.accessToken = response.token;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  public hasRole(role: string): boolean {
    return this.user.authorities ?  this.user?.authorities.some(authority => authority.authority == role) : false;
  }

  public hasAnyRole(roles: any[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if(route.data && route.data.authorities) {
        if (this.hasAnyRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        } 
      }
    }
    return permittedRoutes;
  }

  public register(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/register', user);
  }

  public logout() {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  
  public requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`password/request-reset`, { email }).pipe(
      tap((response: any) => {
        console.log('Password reset email sent');
      })
    );
  }

  public resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`password/reset`, { token, newPassword }).pipe(
      tap((response: any) => {
        console.log('Password has been reset');
      })
    );
  }

  public changePassword(request: { email: string, currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.post('auth/change-password', request);
  }
}
