import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServices } from './all-services';

describe('AllServices', () => {
  let component: AllServices;
  let fixture: ComponentFixture<AllServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
