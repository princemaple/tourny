import {Injectable} from '@angular/core';

import {createClient, SupabaseClient, User} from '@supabase/supabase-js';
import {fetch} from 'cross-fetch';

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
        persistSession: true,
      },
      global: {
        fetch: async (...args) => {
          loading.inc();
          return fetch(...args).finally(() => {
            loading.dec();
          });
        },
      },
    });
  }
}
