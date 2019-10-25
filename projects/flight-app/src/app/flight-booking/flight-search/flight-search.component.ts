import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-api';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FlightBookingFacade } from '../+state/flight-booking.facade';

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
    '3': true,
    '5': true
  };

  constructor(
    private flightService: FlightService,
    private flightBookingFacade: FlightBookingFacade) {
  }

  ngOnInit() {
    this.flights$ = this.flightBookingFacade.flights$;
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightBookingFacade.loadFlights(this.from, this.to, this.urgent);
  }


  delay(): void {

    this.flights$.pipe(take(1)).subscribe(flights => {
      let flight = flights[0];

      let oldDate = new Date(flight.date);
      let newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
      let newFlight = { ...flight, date: newDate.toISOString() };

      this.flightBookingFacade.updateFlight(newFlight);
    });
  }

}
