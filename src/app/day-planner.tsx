"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

export type TripDay = {
  day: number;
  date: string;
  weekday: string;
  city: string;
  segment: string;
  lodging: string;
  dailyContext: string;
  railSchedule: string;
  whatToExpect: string;
  localEvents: {
    summary: string;
    searchQuery: string;
    sources: {
      name: string;
      url: string;
    }[];
  };
};

type DayPlannerProps = {
  days: TripDay[];
  route: string;
  tripName: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function DayPlanner({ days, route, tripName }: DayPlannerProps) {
  const [selectedDate, setSelectedDate] = useState(days[0]?.date ?? "");
  const [selectedSegment, setSelectedSegment] = useState("All");

  const selectedDay = useMemo(
    () => days.find((day) => day.date === selectedDate) ?? days[0],
    [days, selectedDate],
  );
  const segments = useMemo(
    () => ["All", ...Array.from(new Set(days.map((day) => day.segment)))],
    [days],
  );
  const visibleDays = useMemo(
    () =>
      selectedSegment === "All"
        ? days
        : days.filter((day) => day.segment === selectedSegment),
    [days, selectedSegment],
  );

  if (!selectedDay) {
    return null;
  }

  return (
    <main className="min-h-dvh bg-[#f7f4ee] text-[#19211f]">
      <section className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pb-6 pt-[max(18px,env(safe-area-inset-top))]">
        <header className="space-y-4 border-b border-[#d8d0c3] pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#b3261e]">
                {route}
              </p>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-[#10231f]">
                {tripName}
              </h1>
            </div>
            <div className="shrink-0 rounded-full bg-[#0f766e] px-3 py-1 text-sm font-semibold text-white">
              {days.length} days
            </div>
          </div>

          <nav aria-label="Trip sections" className="grid grid-cols-2 gap-2">
            {segments.map((segment) => {
              const isSelected = segment === selectedSegment;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`h-10 border px-3 text-sm font-bold ${
                    isSelected
                      ? "border-[#0f766e] bg-[#0f766e] text-white"
                      : "border-[#d8d0c3] bg-white text-[#43524e]"
                  }`}
                  key={segment}
                  onClick={() => {
                    setSelectedSegment(segment);

                    const firstDay =
                      segment === "All"
                        ? days[0]
                        : days.find((day) => day.segment === segment);

                    if (firstDay) {
                      setSelectedDate(firstDay.date);
                    }
                  }}
                  type="button"
                >
                  {segment}
                </button>
              );
            })}
          </nav>

          <label className="block">
            <span className="text-sm font-bold text-[#19211f]">
              Choose travel day
            </span>
            <select
              className="mt-2 h-12 w-full appearance-none border border-[#aeb8b2] bg-white px-4 text-base font-semibold text-[#10231f] shadow-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              onChange={(event) => {
                const nextDay = days.find(
                  (day) => day.date === event.target.value,
                );

                setSelectedDate(event.target.value);

                if (nextDay) {
                  setSelectedSegment(nextDay.segment);
                }
              }}
              value={selectedDate}
            >
              {days.map((day) => (
                <option key={day.date} value={day.date}>
                  Day {day.day} - {day.weekday},{" "}
                  {dateFormatter.format(new Date(`${day.date}T12:00:00`))} -{" "}
                  {day.city}
                </option>
              ))}
            </select>
          </label>

          <nav aria-label="Trip days" className="flex gap-2 overflow-x-auto pb-1">
            {visibleDays.map((day) => {
              const isSelected = day.date === selectedDay.date;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`h-10 min-w-10 shrink-0 border px-3 text-sm font-bold ${
                    isSelected
                      ? "border-[#0f766e] bg-[#0f766e] text-white"
                      : "border-[#d8d0c3] bg-white text-[#43524e]"
                  }`}
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  type="button"
                >
                  {day.day}
                </button>
              );
            })}
          </nav>
        </header>

        <section className="flex flex-1 flex-col gap-4 py-5">
          <article className="border border-[#d8d0c3] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#b3261e]">
                  Day {selectedDay.day} · {selectedDay.weekday},{" "}
                  {dateFormatter.format(
                    new Date(`${selectedDay.date}T12:00:00`),
                  )}
                </p>
                <h2 className="mt-1 text-3xl font-bold leading-tight text-[#10231f]">
                  {selectedDay.city}
                </h2>
              </div>
              <p className="rounded-full bg-[#e6f2ef] px-3 py-1 text-sm font-semibold text-[#0f5f59]">
                {selectedDay.segment}
              </p>
            </div>

            <div className="mt-4 border-t border-[#ece5dc] pt-4">
              <p className="text-xs font-bold uppercase text-[#596763]">
                Lodging
              </p>
              <p className="mt-1 text-sm leading-6 text-[#43524e]">
                {selectedDay.lodging}
              </p>
            </div>
          </article>

          <div className="grid gap-3">
            <InfoPanel title="Daily Context" value={selectedDay.dailyContext} />
            <InfoPanel title="Rail / Transit" value={selectedDay.railSchedule} />
            <InfoPanel title="What to Expect" value={selectedDay.whatToExpect} />
            <LocalEventsPanel day={selectedDay} key={selectedDay.date} />
          </div>
        </section>
      </section>
    </main>
  );
}

function LocalEventsPanel({ day }: { day: TripDay }) {
  const storageKey = `local-events-summary-${day.date}`;
  const storageEvent = `local-events-summary-change:${storageKey}`;
  const savedSummary = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(storageEvent, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(storageEvent, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => window.localStorage.getItem(storageKey) ?? "",
    () => "",
  );

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    day.localEvents.searchQuery,
  )}`;
  const summary = savedSummary || day.localEvents.summary;
  const searchLabel = `Search web for ${day.weekday}, ${dateFormatter.format(
    new Date(`${day.date}T12:00:00`),
  )}`;

  return (
    <section className="border-l-4 border-[#b3261e] bg-white px-4 py-3 shadow-sm">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-[#19211f]">Local Events</h3>
          <p className="mt-1 text-sm leading-6 text-[#43524e]">{summary}</p>
        </div>

        <a
          aria-label={searchLabel}
          className="block w-full border border-[#0f766e] bg-[#0f766e] px-3 py-3 text-center text-sm font-bold text-white"
          href={searchUrl}
          rel="noreferrer"
          target="_blank"
        >
          Search web for this day
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {day.localEvents.sources.map((source) => (
          <a
            className="border border-[#d8d0c3] bg-[#f7f4ee] px-3 py-2 text-sm font-semibold text-[#43524e]"
            href={source.url}
            key={source.url}
            rel="noreferrer"
            target="_blank"
          >
            {source.name}
          </a>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-bold uppercase text-[#596763]">
          Saved event summary
        </span>
        <textarea
          className="mt-2 min-h-24 w-full resize-y border border-[#d8d0c3] bg-[#f7f4ee] p-3 text-sm leading-6 text-[#19211f] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
          onChange={(event) => {
            window.localStorage.setItem(storageKey, event.target.value);
            window.dispatchEvent(new Event(storageEvent));
          }}
          placeholder="Paste or write a short summary of local events for this day."
          value={savedSummary}
        />
      </label>
    </section>
  );
}

function InfoPanel({ title, value }: { title: string; value: string }) {
  return (
    <section className="border-l-4 border-[#0f766e] bg-white px-4 py-3 shadow-sm">
      <h3 className="text-sm font-bold text-[#19211f]">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#43524e]">{value}</p>
    </section>
  );
}
