import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentIndipaiseGatewayComponent } from './payment-indipaise-gateway.component';

describe('PaymentIndipaiseGatewayComponent', () => {
  let component: PaymentIndipaiseGatewayComponent;
  let fixture: ComponentFixture<PaymentIndipaiseGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentIndipaiseGatewayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentIndipaiseGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
