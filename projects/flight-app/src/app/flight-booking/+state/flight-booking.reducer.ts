import { Action, createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';
import { Flight } from '@flight-workspace/flight-api';
import { flightsLoaded, updateFlight } from './flight-booking.actions';

export interface State {
  flights: Flight[];
  negativeList: number[]
}

export interface FlightBookingAppState {
  flightBooking: State
}

export const initialState: State = {
  flights: [],
  negativeList: [3]
};

const flightBookingReducer = createReducer(
  initialState,

  on(flightsLoaded, (state, action) => {
    const flights = action.flights;
    return { ...state, flights };
  }),

  on(updateFlight, (state, action) => {
    const flight = action.flight;
    const flights = state.flights.map(f => f.id === flight.id? flight: f);
    return { ...state, flights };
  })

);

export function reducer(state: State | undefined, action: Action) {
  return flightBookingReducer(state, action);
}
