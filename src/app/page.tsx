import itinerary from "@/data/itinerary.json";
import { DayPlanner } from "./day-planner";
import type { Hotel, TripDay } from "./day-planner";

export default function Home() {
  const days = itinerary.days as TripDay[];
  const hotels = itinerary.hotels as Hotel[];

  return (
    <DayPlanner
      days={days}
      hotels={hotels}
      route={itinerary.route}
      tripName={itinerary.tripName}
    />
  );
}
