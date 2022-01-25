import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-posts-form',
  templateUrl: './create-posts-form.component.html',
  styleUrls: ['./create-posts-form.component.css']
})
export class CreatePostsFormComponent implements OnInit {

  createPostForm: FormGroup;

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
    
  }
}
