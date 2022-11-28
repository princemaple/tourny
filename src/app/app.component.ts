import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SupaService} from './supa.service';

@Component({
  selector: 'tn-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private supa: SupaService) {}

  async ngOnInit() {
    const {
      data: {session},
    } = await this.supa.base.auth.getSession();

    if (session?.user) {
      this.supa.user = session!.user;
      this.router.navigateByUrl('dashboard');
    }

    this.supa.base.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.supa.user = session!.user;
        this.router.navigateByUrl('dashboard');
      }

      if (event === 'SIGNED_OUT') {
        this.supa.user = null;
        this.router.navigateByUrl('login');
      }
    });
  }
}
