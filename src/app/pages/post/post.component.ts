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
    mediaFiles: File[];
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
            file: '',
        });

        this.postSubscription = this.postService.currentPostObservable.subscribe({
            next: async (post) => {
                this.post = post;
                this.editPostForm.controls['title'].setValue(post?.title);
                this.editPostForm.controls['content'].setValue(post?.content);
            }
        });

        this.mediaSubscription = this.postService.currentPostMediaUrlsObservable.subscribe({
            next: (files) => {
                this.mediaFiles = files;
                this.formFiles = files;
            }
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

        const originalFiles = this.mediaFiles;
        const newFiles = this.formFiles;
        const files = originalFiles.length === newFiles.length
            && originalFiles
                .map((originalFile, index) => originalFile.name === newFiles[index].name)
                .reduce((acc, cur) => acc && cur) ? undefined : newFiles;

        return { title, content, files };
    }

    get formFiles() {
        return this.editPostForm.controls['file'].value as File[];
    }

    set formFiles(files: File[]) {
        this.editPostForm.controls['file'].setValue([...files]);
    }

    onRemoveFile(event: Event, index: number) {
        event.preventDefault();
        event.stopPropagation();
        const files = this.formFiles;
        files.splice(index, 1);
        this.formFiles = files;
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
        const { title, content, files } = this.newPostData;
        if (!title && !content && !files) {
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
        this.editPostForm.controls['file'].setValue(this.mediaFiles);
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
