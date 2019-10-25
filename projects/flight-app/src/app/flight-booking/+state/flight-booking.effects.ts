import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { flightsLoaded, loadFlights } from './flight-booking.actions';
import { FlightService } from '@flight-workspace/flight-api';

@Injectable()
export class FlightBookingEffects {

  loadFlights = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFlights),
      switchMap(a => this.flightService.find(a.from, a.to, a.urgent)),
      map(flights => flightsLoaded({ flights })));
  });

  constructor(
    private actions$: Actions,
    private flightService: FlightService) {}
}
