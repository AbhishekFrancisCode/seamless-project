import { TestBed } from '@angular/core/testing';

import { PaymentModuleService } from './payment-module.service';

describe('PaymentModuleService', () => {
  let service: PaymentModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
