import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterService } from '../register.service';
import { UserRegister } from '../../UserRegister';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
full_name: string = '';

  constructor(private registerService: RegisterService) {}

  ngOnInit(): void {
    const user: UserRegister | null = this.registerService.getUser();
    if (user && user.fullName) {
      this.full_name = user.fullName;
    } else {
      this.full_name = 'Guest';
    }
  }
  }

