import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

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
    if (!this.authenticaionService.accessToken) {
      this.router.navigate(['login'], { queryParams: { returnUrl: '/' } });
    }
  }

}
