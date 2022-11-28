import {Injectable} from '@angular/core';

import {createClient, SupabaseClient, User} from '@supabase/supabase-js';

import {environment} from '../environments/environment';
import {LoadingService} from './loading.service';

@Injectable({providedIn: 'root'})
export class SupaService {
  readonly base: SupabaseClient;

  user: User | null = null;

  constructor(loading: LoadingService) {
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
        fetch: (url: URL | RequestInfo, options?: RequestInit | undefined) => {
          loading.inc();
          return fetch(url, options).finally(() => {
            loading.dec();
          });
        },
      },
    });
  }
}
