import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/_models/post';
import { LoggerService } from 'src/app/_services/logger.service';
import { PostService } from 'src/app/_services/post.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

    private postSubscription: Subscription;
    private mediaSubscription: Subscription;
    private id: string;
    post?: Post;
    mediaUrls: string[];
    isEditMode = false;
    editPostForm: FormGroup;
    isSaving = false;
    isShowConfirmCancel = false;

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private logger: LoggerService,
        private formBuilder: FormBuilder,
    ) { }

    async ngOnInit(): Promise<void> {
        this.editPostForm = this.formBuilder.group({
            title: '',
            content: '',
        });

        this.postSubscription = this.postService.currentPostObservable.subscribe({
            next: async (post) => {
                this.post = post;
                this.editPostForm.controls['title'].setValue(post?.title);
                this.editPostForm.controls['content'].setValue(post?.content);
            }
        });

        this.mediaSubscription = this.postService.currentPostMediaUrlsObservable.subscribe({
            next: (urls) => { this.mediaUrls = urls; }
        });

        this.id = this.route.snapshot.queryParams['id'];
        this.postService.currentPostId = this.id;
    }

    ngOnDestroy(): void {
        this.postSubscription.unsubscribe();
        this.mediaSubscription.unsubscribe();
    }

    get editMode() {
        return this.isEditMode;
    }

    set editMode(bool: boolean) {
        if (bool) this.isEditMode = true;
        else {
            this.isEditMode = false;
            this.isShowConfirmCancel = false;
        }
    }

    get newPostData() {
        const originalTitle = this.post?.title;
        const newTitle = this.editPostForm.controls['title'].value.toString() as string;
        const title = originalTitle !== newTitle ? newTitle : undefined;
        const originalContent = this.post?.content;
        const newContent = this.editPostForm.controls['content'].value.toString() as string;
        const content = originalContent !== newContent ? newContent : undefined;
        return { title, content };
    }

    onToggleEditMode(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        //Set edit mode to true
        if (!this.editMode) {
            this.editMode = true;
            return;
        }

        //If nothing is updated, end edit mode
        const { title, content } = this.newPostData;
        if (!title && !content) {
            this.editMode = false;
            return;
        }

        //Something is edited, ask for confirmation
        this.isShowConfirmCancel = true;
    }

    onConfirmCancel(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.editPostForm.controls['title'].setValue(this.post?.title);
        this.editPostForm.controls['content'].setValue(this.post?.content);
        this.editMode = false;
    }

    async onSavePost(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        //Calculate changed items
        const { title, content } = this.newPostData;

        //Update if things have changed
        if (title || content) {
            this.isSaving = true;
            await this.postService.updatePost(this.id, title, content);
            this.isSaving = false;
        }

        this.editMode = false;
    }
}
