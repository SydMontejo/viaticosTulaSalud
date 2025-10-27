import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  user: any = null;

  ngOnInit(): void {
    const data = sessionStorage.getItem('google_user');
    if (data) {
      this.user = JSON.parse(data);
    }
  }
}
