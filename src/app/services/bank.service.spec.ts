import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BankService } from './bank.service';
import { IBanks } from '../interfaces';

describe('BankService', () => {
  let service: BankService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankService]
    });

    service = TestBed.inject(BankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deberia guardar banco nuevo y actualizar el signal', () => {
    const initialBanks: IBanks[] = [
      { id: 1, nombre: 'Bank 1', tasaAhorro: 1.0, tasaUnificacion: 2.0, tasaCredito: 3.0 },
      { id: 2, nombre: 'Bank 2', tasaAhorro: 1.5, tasaUnificacion: 2.5, tasaCredito: 3.5 }
    ];

    const newBank: IBanks = { id: 3, nombre: 'Bank 3', tasaAhorro: 1.8, tasaUnificacion: 2.8, tasaCredito: 4.8 };
    const mockResponse: IBanks = { id: 3, nombre: 'Bank 3', tasaAhorro: 1.8, tasaUnificacion: 2.8, tasaCredito: 4.8 };


    service.banks$.set(initialBanks);

    service.saveBankSignal(newBank).subscribe();

    const req = httpMock.expectOne('bank');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.banks$()).toEqual([mockResponse, ...initialBanks]);
  });
});
