import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-top-utility-bar',
  templateUrl: './top-utility-bar.component.html',
  styleUrls: ['./top-utility-bar.component.css']
})
export class TopUtilityBarComponent implements OnInit {

  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.currentUserObservable.subscribe({
      next: (user?) => {
        if (user)
          this.currentUser = user;
      }
    });
  }

  public onLogout() {
    this.authenticationService.logout();
  }
}