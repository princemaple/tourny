import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';

import {SupaService} from '../supa.service';

@Component({
  selector: 'oc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
})
export class LoginComponent {
  loading = false;

  constructor(router: Router, private supa: SupaService) {
    if (supa.session) {
      router.navigateByUrl('dashboard');
    }

    supa.authChanges((event, _) => {
      if (event === 'SIGNED_IN') {
        router.navigateByUrl('dashboard');
      }
    });
  }

  async handleLogin(email: string) {
    try {
      this.loading = true;
      const login = await this.supa.signIn(email);
      if (login.error) {
        alert(`It seems that you don't have the permission to login!`);
      } else {
        alert('Check your email for the login link!');
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }
}
