import itinerary from "@/data/itinerary.json";
import { DayPlanner } from "./day-planner";
import type { TripDay } from "./day-planner";

export default function Home() {
  const days = itinerary.days as TripDay[];

  return (
    <DayPlanner
      days={days}
      route={itinerary.route}
      tripName={itinerary.tripName}
    />
  );
}
