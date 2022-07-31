import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SupaService} from '../supa.service';

@Component({
  selector: 'oc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;

  constructor(router: Router, private supa: SupaService) {
    if (supa.session) {
      router.navigateByUrl('items');
    }

    supa.authChanges((event, _) => {
      if (event === 'SIGNED_IN') {
        router.navigateByUrl('items');
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
