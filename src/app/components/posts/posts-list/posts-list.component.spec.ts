import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsPageComponent } from './posts-list.component';

describe('PostsPageComponent', () => {
    let component: PostsPageComponent;
    let fixture: ComponentFixture<PostsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PostsPageComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PostsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});