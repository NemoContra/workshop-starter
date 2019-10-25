import { Injectable } from '@angular/core';
import { FlightBookingAppState } from './flight-booking.reducer';
import { select, Store } from '@ngrx/store';
import { selectedFilteredFlights } from './flight-booking.selectors';
import { loadFlights, updateFlight } from './flight-booking.actions';
import { Flight } from '@flight-workspace/flight-api';

@Injectable()
export class FlightBookingFacade {

  flights$ = this.store.pipe(select(selectedFilteredFlights));

  constructor(private store: Store<FlightBookingAppState>) {
  }

  loadFlights(from: string, to: string, urgent: boolean): void {
    this.store.dispatch(loadFlights({
      from,
      to,
      urgent
    }));
  }

  updateFlight(flight: Flight): void {
    this.store.dispatch(updateFlight({ flight }));
  }
}