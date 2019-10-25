import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-api';
import { combineLatest, interval, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css']
})
export class FlightLookaheadComponent implements OnInit {
  online: boolean = false;
  online$: Observable<boolean>;

  control = new FormControl();

  flights$: Observable<Flight[]>;

  loading: boolean;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.control = new FormControl();

    const input$ =
      this.control
        .valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter(value => value.length >= 3)
        );

    this.online$
      = interval(2000).pipe(
      startWith(0),
      map(_ => Math.random() < 0.5),
      distinctUntilChanged(),
      tap(value => this.online = value)
    );

    this.flights$ = combineLatest([input$, this.online$])
      .pipe(
        filter(([, online]) => online),
        map(([input]) => input),
        tap(input => this.loading = true),
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
