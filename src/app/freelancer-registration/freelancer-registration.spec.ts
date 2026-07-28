import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerRegistration } from './freelancer-registration';

describe('FreelancerRegistration', () => {
  let component: FreelancerRegistration;
  let fixture: ComponentFixture<FreelancerRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
