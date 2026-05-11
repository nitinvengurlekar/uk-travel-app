import itinerary from "@/data/itinerary.json";

type TripDay = {
  day: number;
  date: string;
  weekday: string;
  city: string;
  lodging: string;
  dailyContext: string;
  railSchedule: string;
  whatToExpect: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export default function Home() {
  const days = itinerary.days as TripDay[];

  return (
    <main className="min-h-dvh bg-[#f7f4ee] text-[#19211f]">
      <section className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-8 pt-[max(20px,env(safe-area-inset-top))]">
        <header className="sticky top-0 z-10 -mx-5 border-b border-[#d8d0c3] bg-[#f7f4ee]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#b3261e]">
                {itinerary.route}
              </p>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-[#10231f]">
                {itinerary.tripName}
              </h1>
            </div>
            <div className="shrink-0 rounded-full bg-[#0f766e] px-3 py-1 text-sm font-semibold text-white">
              {days.length} days
            </div>
          </div>
        </header>

        <div className="space-y-4 py-5">
          {days.map((day) => (
            <article
              className="border border-[#d8d0c3] bg-white p-4 shadow-sm"
              key={day.date}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#b3261e]">
                    Day {day.day} · {day.weekday},{" "}
                    {dateFormatter.format(new Date(`${day.date}T12:00:00`))}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold leading-tight text-[#10231f]">
                    {day.city}
                  </h2>
                </div>
                <p className="rounded-full bg-[#e6f2ef] px-3 py-1 text-sm font-semibold text-[#0f5f59]">
                  {day.city.includes("Inverness") ? "North" : "Capital"}
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#596763]">
                {day.lodging}
              </p>

              <div className="mt-4 grid gap-3">
                <InfoBlock title="Daily Context" value={day.dailyContext} />
                <InfoBlock title="Rail Schedule" value={day.railSchedule} />
                <InfoBlock title="What to Expect" value={day.whatToExpect} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="border-l-4 border-[#0f766e] bg-[#f7f4ee] px-3 py-2">
      <h3 className="text-sm font-bold text-[#19211f]">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#43524e]">{value}</p>
    </section>
  );
}
