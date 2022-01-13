import { Token } from '@angular/compiler/src/ml_parser/tokens';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authenticaionService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('home page');
    if (!(this.authenticaionService.currentUser && this.authenticaionService.accessToken)) {
      console.log('not logged');
      this.router.navigate(['login'], { queryParams: { returnUrl: '/' } });
    }
    console.log('already logged in');
  }

}
