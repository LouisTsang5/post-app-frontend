import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LilyComponent } from './lily.component';

describe('LilyComponent', () => {
  let component: LilyComponent;
  let fixture: ComponentFixture<LilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LilyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
