import { TestBed } from '@angular/core/testing';

import { ServiceModuleService } from './service-module.service';

describe('ServiceModuleService', () => {
  let service: ServiceModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
