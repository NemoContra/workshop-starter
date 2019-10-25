import {Component, OnInit} from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-api';
import { FlightBookingAppState } from '../+state/flight-booking.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadFlights, updateFlight } from '../+state/flight-booking.actions';
import { take } from 'rxjs/operators';
import { selectedFilteredFlights } from '../+state/flight-booking.selectors';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  from: string = 'Hamburg'; // in Germany
  to: string = 'Graz'; // in Austria
  urgent: boolean = false;

  flights$: Observable<Flight[]>;

  // "shopping basket" with selected flights
  basket: object = {
    "3": true,
    "5": true
  };

  constructor(
    private flightService: FlightService,
    private store: Store<FlightBookingAppState>) {
  }

  ngOnInit() {
    this.flights$ = this.store.select(selectedFilteredFlights);
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.store.dispatch(loadFlights({
      from: this.from,
      to: this.to,
      urgent: this.urgent
    }));
  }


  delay(): void {

    this.flights$.pipe(take(1)).subscribe(flights => {
      let flight = flights[0];

      let oldDate = new Date(flight.date);
      let newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
      let newFlight = { ...flight, date: newDate.toISOString() };

      this.store.dispatch(updateFlight({flight: newFlight}));
    });
  }

}
