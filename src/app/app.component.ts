import {Component, inject} from '@angular/core';

import {SupaService} from './supa.service';

@Component({
  selector: 'tn-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  supa = inject(SupaService);
}
