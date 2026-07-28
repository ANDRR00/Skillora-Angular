import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerRegistration } from './employer-registration';

describe('EmployerRegistration', () => {
  let component: EmployerRegistration;
  let fixture: ComponentFixture<EmployerRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
