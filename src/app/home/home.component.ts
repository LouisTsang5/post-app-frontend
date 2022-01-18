import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../_models/post';
import { AuthenticationService } from '../_services/authentication.service';
import { PostService } from '../_services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  accessTokenSubscription: Subscription;

  constructor(
    private authenticaionService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.accessTokenSubscription = this.authenticaionService.accessTokenObservable.subscribe({
      next: (token) => {
        if (!token) {
          this.router.navigate(['login'], { queryParams: { returnUrl: '/' } });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.accessTokenSubscription.unsubscribe();
  }

}
