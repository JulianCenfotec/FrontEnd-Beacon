import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ILoginResponse, IUser } from '../interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('se deberia login exitosamente', () => {
    const mockUser: IUser = {
      email: 'test@example.com',
      authorities: [{ authority: 'USER' }]
    };
  
    const mockResponse: ILoginResponse = {
      accessToken: 'fake-jwt-token',
      expiresIn: 3600000
    };
  
    service.login({ email: 'test@example.com', password: 'password' }).subscribe(response => {
      expect(response.accessToken).toEqual(mockResponse.accessToken);
      expect(response.expiresIn).toEqual(mockResponse.expiresIn);
    });
  
    const req = httpMock.expectOne('auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('se deberia registrarse exitosamente', () => {
    const mockUser: IUser = {
      email: 'test@example.com',
      password: 'password',
      authorities: [{ authority: 'USER' }]
    };

    const mockResponse: ILoginResponse = {
      accessToken: 'fake-jwt-token',
      expiresIn: 3600000
    };

    service.register(mockUser).subscribe(response => {
      expect(response.accessToken).toEqual(mockResponse.accessToken);
      expect(response.expiresIn).toEqual(mockResponse.expiresIn);
    });

    const req = httpMock.expectOne('auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });



  it('se deberia enviar reseteo de contraseña al correo exitosamente', () => {
    const email = 'test@example.com';

    const mockResponse = {
      message: 'Password reset email sent'
    };

    service.requestPasswordReset(email).subscribe(response => {
      expect(response.message).toEqual(mockResponse.message);
    });

    const req = httpMock.expectOne('password/request-reset');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('se deberia establecer nueva contraseña luego de resetear la contraseña', () => {
    const token = 'valid-token';
    const newPassword = 'newpassword123';

    const mockResponse = {
      message: 'Password has been reset'
    };

    service.resetPassword(token, newPassword).subscribe(response => {
      expect(response.message).toEqual(mockResponse.message);
    });

    const req = httpMock.expectOne('password/reset');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });


  it('se deberia cambiar el password exitosamente', () => {
    const changePasswordRequest = {
      email: 'user@example.com',
      currentPassword: 'currentpassword123',
      newPassword: 'newpassword123'
    };

    const mockResponse = {
      message: 'Password changed successfully'
    };

    service.changePassword(changePasswordRequest).subscribe(response => {
      expect(response.message).toEqual(mockResponse.message);
    });

    const req = httpMock.expectOne('auth/change-password');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

});
