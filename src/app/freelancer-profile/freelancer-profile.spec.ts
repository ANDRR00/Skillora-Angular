import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerProfile } from './freelancer-profile';

describe('FreelancerProfile', () => {
  let component: FreelancerProfile;
  let fixture: ComponentFixture<FreelancerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
