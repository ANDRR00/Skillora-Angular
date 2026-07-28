import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleService } from './single-service';

describe('SingleService', () => {
  let component: SingleService;
  let fixture: ComponentFixture<SingleService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
