import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggerService } from 'src/app/_services/logger.service';
import { PostService } from 'src/app/_services/post.service';
import { PostFormData } from '../../../_models/post';

@Component({
    selector: 'app-create-posts-form',
    templateUrl: './create-posts-form.component.html',
    styleUrls: ['./create-posts-form.component.scss']
})
export class CreatePostsFormComponent implements OnInit {

    createPostForm: FormGroup;
    submitted = false;
    submitting = false;

    @Input() cbCancel?: () => void;
    @Input() cbSubmit?: () => void;

    constructor(
        private formBuilder: FormBuilder,
        private postService: PostService,
        private logger: LoggerService,
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

    public get files() {
        return this.formValue['file'].value as File[];
    }

    public set files(files: File[]) {
        this.formValue['file'].setValue(files);
    }

    @HostListener('window:keyup', ['$event'])
    escapeKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.logger.log('Escape key pressed, exiting');
            this.onCancel();
        }
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

        const post: PostFormData = {
            title: this.formValue['title'].value,
            content: this.formValue['content'].value,
            multimedia: this.formValue['file'].value,
        };
        this.postService.createPost(post);

        this.submitting = false;

        if (this.cbSubmit) this.cbSubmit();
    }

    onRemoveFile(event: Event, index: number) {
        event.preventDefault();
        event.stopPropagation();

        const files = this.files;
        files.splice(index, 1);
        this.files = files;
    }
}
