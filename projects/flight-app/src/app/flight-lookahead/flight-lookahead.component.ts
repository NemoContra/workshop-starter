import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-api';
import { combineLatest, interval, merge, Observable, OperatorFunction, Subject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  filter, first,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'app-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css']
})
export class FlightLookaheadComponent implements OnInit, OnDestroy {
  online: boolean = false;
  online$: Observable<boolean>;

  control = new FormControl();

  flights$: Observable<Flight[]>;

  closeDemoInterval$ = interval(2000).pipe(startWith( ''));
  destroy$$ = new Subject<void>();

  loading: boolean;

  constructor(private http: HttpClient) {
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  ngOnInit() {

    this.closeDemoInterval$.pipe(takeUntil(this.destroy$$)).subscribe(console.log);

    /* Object destruction
    const value = { test: 1, test2: 2 };
    const fun = ({test, test2}) => {
      test2
    }

    fun(value);
    */

    this.control = new FormControl();

    const input$ =
      this.control
        .valueChanges
        .pipe(
          debounceDistinctUntilChanged(300),
          filter(value => value.length >= 3)
        );

    this.online$
      = interval(2000).pipe(
      startWith(0),
      map(_ => Math.random() < 0.5),
      distinctUntilChanged(),
      tap(value => this.online = value)
    );

    const obs1 = this.load('Graz');
    const obs2 = this.load('Stuttgart');

    obs1.pipe(
      map((flights: Flight[]) => [{
        ...flights[0],
        to: flights[0].to,
        id: 42
      }])
    ).subscribe(console.log);

    this.flights$ = combineLatest([input$, this.online$])
      .pipe(
        // array destruction
        filter(([_, online]) => online),
        map(([input]) => input),
        tap(() => this.loading = true),
        switchMap(input => this.load(input)),
        tap(v => this.loading = false)
      );
  }

  load(from: string): Observable<Flight[]> {
    let url = 'http://www.angular.at/api/flight';

    let params = new HttpParams()
      .set('from', from);

    let headers = new HttpHeaders()
      .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, { params, headers });

  };

}

const debounceDistinctUntilChanged = (time: number) => {
  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      debounceTime(time),
      distinctUntilChanged()
    );
  };
};