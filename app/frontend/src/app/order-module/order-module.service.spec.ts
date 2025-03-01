import { TestBed } from '@angular/core/testing';

import { OrderModuleService } from './order-module.service';

describe('OrderModuleService', () => {
  let service: OrderModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
