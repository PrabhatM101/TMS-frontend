import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth-service';
import { NameColorPipe } from '../../pipes/name-color-pipe';
import { GetInitialsPipe } from '../../pipes/get-intials-pipe';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NgbDropdownModule,NameColorPipe,GetInitialsPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private auth = inject(AuthService);
  private router = inject(Router);

  user$ = this.auth.user$;

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }

  logout() {
    this.auth.logout(true);
  }

}
