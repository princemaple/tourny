import {Component, Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';

import {SupaService} from '../supa.service';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
class AddIcons {
  constructor(sanitizer: DomSanitizer, registry: MatIconRegistry) {
    registry.addSvgIconLiteral(
      'github',
      sanitizer.bypassSecurityTrustHtml(`
      <svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14.3333 19V17.137C14.3583 16.8275 14.3154 16.5163 14.2073 16.2242C14.0993 15.9321 13.9286 15.6657 13.7067 15.4428C15.8 15.2156 18 14.4431 18 10.8989C17.9998 9.99256 17.6418 9.12101 17 8.46461C17.3039 7.67171 17.2824 6.79528 16.94 6.01739C16.94 6.01739 16.1533 5.7902 14.3333 6.97811C12.8053 6.57488 11.1947 6.57488 9.66666 6.97811C7.84666 5.7902 7.05999 6.01739 7.05999 6.01739C6.71757 6.79528 6.69609 7.67171 6.99999 8.46461C6.35341 9.12588 5.99501 10.0053 5.99999 10.9183C5.99999 14.4366 8.19999 15.2091 10.2933 15.4622C10.074 15.6829 9.90483 15.9461 9.79686 16.2347C9.68889 16.5232 9.64453 16.8306 9.66666 17.137V19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9.66667 17.7018C7.66667 18.3335 6 17.7018 5 15.7544" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      `),
    );
  }
}

@Component({
    selector: 'oc-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
    ]
})
export class LoginComponent {
  sending = false;

  constructor(private router: Router, private supa: SupaService, protected addIcons: AddIcons) {
    if (supa.user) {
      this.router.navigateByUrl('dashboard');
    }
  }

  async handleLogin(email: string) {
    try {
      this.sending = true;
      const {error} = await this.supa.base.auth.signInWithOtp({email});
      if (error) {
        alert(`It seems that you don't have the permission to login!`);
      } else {
        alert('Check your email for the login link!');
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      this.sending = false;
    }
  }

  async oauth() {
    const {error} = await this.supa.base.auth.signInWithOAuth({provider: 'github'});

    if (error) {
      alert('Failed to sign in with GitHub.');
    }
  }
}
