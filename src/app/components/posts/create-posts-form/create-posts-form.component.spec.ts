import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostsFormComponent } from './create-posts-form.component';

describe('CreatePostsFormComponent', () => {
  let component: CreatePostsFormComponent;
  let fixture: ComponentFixture<CreatePostsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePostsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
