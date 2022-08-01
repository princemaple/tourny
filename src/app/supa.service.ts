import {Injectable} from '@angular/core';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../environments/environment';

@Injectable({providedIn: 'root'})
export class SupaService {
  readonly base: SupabaseClient;

  constructor() {
    this.base = createClient(environment.supabaseUrl, environment.supabaseKey);
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
