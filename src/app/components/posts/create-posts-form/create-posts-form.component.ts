import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/_services/post.service';
import { Post } from '../../../_models/post';

@Component({
    selector: 'app-create-posts-form',
    templateUrl: './create-posts-form.component.html',
    styleUrls: ['./create-posts-form.component.css']
})
export class CreatePostsFormComponent implements OnInit {

    createPostForm: FormGroup;
    submitted = false;
    submitting = false;

    @Input() cbCancel?: () => void;
    @Input() cbSubmit?: () => void;

    constructor(
        private formBuilder: FormBuilder,
        private postService: PostService
    ) { }

    ngOnInit(): void {
        this.createPostForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            file: ['']
        });
    }

    public get formValue() {
        return this.createPostForm.controls;
    }

    onCancel() {
        if (this.cbCancel) this.cbCancel();
    }

    onSubmit() {
        this.submitted = true;
        this.submitting = true;

        if (this.createPostForm.invalid) {
            this.submitting = false;
            return;
        }

        const post: Post = {
            title: this.formValue['title'].value,
            content: this.formValue['content'].value,
            multimedia: this.formValue['file'].value,
        };
        this.postService.createPost(post);

        this.submitting = false;

        if (this.cbSubmit) this.cbSubmit();
    }
}
