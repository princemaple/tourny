import {Injectable} from '@angular/core';

import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import {fetch} from 'cross-fetch';

import {environment} from '../environments/environment';
import {LoadingService} from './loading.service';

@Injectable({providedIn: 'root'})
export class SupaService {
  readonly base: SupabaseClient;

  constructor(loading: LoadingService) {
    this.base = createClient(environment.supabaseUrl, environment.supabaseKey, {
      fetch: async (...args) => {
        loading.inc();
        try {
          return await fetch(...args);
        } finally {
          loading.dec();
        }
      },
    });
  }

  get user() {
    return this.base.auth.user();
  }

  get session() {
    return this.base.auth.session();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.base.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.base.auth.signIn({email});
  }

  signOut() {
    return this.base.auth.signOut();
  }
}
