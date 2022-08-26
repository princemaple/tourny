import {Injectable} from '@angular/core';
import {throttleTime, ReplaySubject, asyncScheduler} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoadingService {
  #loadingCount = 0;

  #count = new ReplaySubject(1);
  count = this.#count.pipe(throttleTime(100, asyncScheduler, {trailing: true}));

  inc() {
    this.#loadingCount += 1;
    this.#count.next(this.#loadingCount);
  }

  dec() {
    this.#loadingCount -= 1;
    this.#count.next(this.#loadingCount);
  }
}
