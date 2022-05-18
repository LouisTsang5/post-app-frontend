import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayNightToggleComponent } from './day-night-toggle.component';

describe('DayNightToggleComponent', () => {
  let component: DayNightToggleComponent;
  let fixture: ComponentFixture<DayNightToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayNightToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayNightToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
