import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { TopUtilityBarComponent } from './components/top-utility-bar/top-utility-bar.component';
import { RegistrationComponent } from './pages/register/register.component';
import { PostsListComponent } from './components/posts/posts-list/posts-list.component';
import { CreatePostsFormComponent } from './components/posts/create-posts-form/create-posts-form.component';
import { FileUploadComponent } from './components/utils/file-upload/file-upload.component';
import { PostPreviewComponent } from './components/posts/post-preview/post-preview.component';
import { PostComponent } from './pages/post/post.component';
import { MediaViewerComponent } from './components/utils/media-viewer/media-viewer.component';
import { DayNightToggleComponent } from './components/utils/day-night-toggle/day-night-toggle.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        TopUtilityBarComponent,
        RegistrationComponent,
        PostsListComponent,
        CreatePostsFormComponent,
        FileUploadComponent,
        PostPreviewComponent,
        PostComponent,
        MediaViewerComponent,
        DayNightToggleComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegistrationComponent },
            { path: 'post', component: PostComponent },
        ]),
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
