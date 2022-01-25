import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { HomeComponent } from './components/home/home.component';
import { TopUtilityBarComponent } from './components/top-utility-bar/top-utility-bar.component';
import { RegistrationFormComponent } from './components/login/registration-form/registration-form.component';
import { PostsPageComponent } from './components/posts/posts-page/posts-page.component';
import { CreatePostsFormComponent } from './components/posts/create-posts-form/create-posts-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomeComponent,
    TopUtilityBarComponent,
    RegistrationFormComponent,
    PostsPageComponent,
    CreatePostsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'login', component: LoginFormComponent},
      {path: 'register', component: RegistrationFormComponent},
    ]),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
