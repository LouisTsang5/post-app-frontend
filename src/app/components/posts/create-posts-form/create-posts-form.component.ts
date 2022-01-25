import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @Input() onCancelCreatePost: () => void;
  @Input() onSubmitCreatePostForm: (post: Post) => void;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createPostForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  public get formValue() {
    return this.createPostForm.controls;
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
      content: this.formValue['content'].value
    };
    this.onSubmitCreatePostForm(post);

    this.submitting = false;
  }
}
