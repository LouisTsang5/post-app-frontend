import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-top-utility-bar',
  templateUrl: './top-utility-bar.component.html',
  styleUrls: ['./top-utility-bar.component.css']
})
export class TopUtilityBarComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  public onLogout() {
    this.authenticationService.logout();
  }
}