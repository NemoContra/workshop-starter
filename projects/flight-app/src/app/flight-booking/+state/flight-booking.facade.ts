import { Injectable } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-api';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FlightBookingFacade {
  flightsSubject$ = new BehaviorSubject<Flight[]>([]);

  flights$ = this.flightsSubject$.asObservable();

  constructor(private flightService: FlightService) {
  }

  loadFlights(from: string, to: string, urgent: boolean): void {
    this.flightService.find(from, to, urgent).subscribe(flights => this.flightsSubject$.next(flights));
  }

  updateFlight(flight: Flight): void {
    const flights = this.flightsSubject$.getValue().map(f => f.id === flight.id? flight: f);
    this.flightsSubject$.next(flights);
  }
}