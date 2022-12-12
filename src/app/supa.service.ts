import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {createClient, SupabaseClient, User} from '@supabase/supabase-js';
import {ReplaySubject} from 'rxjs';

import {environment} from '../environments/environment';
import {LoadingService} from './loading.service';

@Injectable({providedIn: 'root'})
export class SupaService {
  readonly base: SupabaseClient;

  user$ = new ReplaySubject<User | null>(1);

  #user: User | null = null;
  get user() {
    return this.#user;
  }
  set user(v: User | null) {
    this.#user = v;
    this.user$.next(v);
  }

  constructor(loading: LoadingService, private router: Router) {
    this.base = createClient(environment.supabaseUrl, environment.supabaseKey, {
      db: {
        schema: 'public',
      },

      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },

      global: {
        fetch: async (url: URL | RequestInfo, options?: RequestInit | undefined) => {
          loading.inc();
          try {
            return await fetch(url, options);
          } finally {
            loading.dec();
          }
        },
      },
    });

    this.setup();
  }

  async setup() {
    const {
      data: {session},
    } = await this.base.auth.getSession();

    if (session?.user) {
      this.user = session!.user;
    }

    this.base.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.user = session!.user;
      }

      if (event === 'SIGNED_OUT') {
        this.user = null;
        this.router.navigateByUrl('login');
      }
    });
  }
}
