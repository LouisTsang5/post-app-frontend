import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { TopUtilityBarComponent } from './components/top-utility-bar/top-utility-bar.component';
import { RegistrationFormComponent } from './pages/registration-form/register.component';
import { PostsPageComponent } from './components/posts/posts-page/posts-page.component';
import { CreatePostsFormComponent } from './components/posts/create-posts-form/create-posts-form.component';
import { FileUploadComponent } from './components/utils/file-upload/file-upload.component';
import { PostPreviewComponent } from './components/posts/post-preview/post-preview.component';
import { PostComponent } from './pages/post/post.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginFormComponent,
        HomeComponent,
        TopUtilityBarComponent,
        RegistrationFormComponent,
        PostsPageComponent,
        CreatePostsFormComponent,
        FileUploadComponent,
        PostPreviewComponent,
        PostComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginFormComponent },
            { path: 'register', component: RegistrationFormComponent },
            { path: 'post', component: PostComponent },
        ]),
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
