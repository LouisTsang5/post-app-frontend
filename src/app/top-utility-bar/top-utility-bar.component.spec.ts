import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUtilityBarComponent } from './top-utility-bar.component';

describe('TopUtilityBarComponent', () => {
  let component: TopUtilityBarComponent;
  let fixture: ComponentFixture<TopUtilityBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopUtilityBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUtilityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
