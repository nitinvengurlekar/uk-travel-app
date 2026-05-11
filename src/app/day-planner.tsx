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

const sectionStyles: Record<string, string> = {
  All: "from-[#1b4332] via-[#45624d] to-[#d7c7a3]",
  Travel: "from-[#243447] via-[#5f7f96] to-[#d8c29d]",
  Edinburgh: "from-[#344e41] via-[#7b4f45] to-[#d7c7a3]",
  Inverness: "from-[#18392b] via-[#3f6f59] to-[#b7c7a4]",
  London: "from-[#26364c] via-[#8b3f46] to-[#d6b16c]",
};

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

  const progressPercentage = Math.round((selectedDay.day / days.length) * 100);
  const selectedStyle =
    sectionStyles[selectedDay.segment] ?? sectionStyles[selectedSegment];
  const dayType = getDayType(selectedDay);

  return (
    <main className="min-h-dvh bg-[#f7f4ee] text-[#19211f]">
      <section className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pb-6">
        <header
          className={`-mx-5 space-y-4 bg-gradient-to-br ${selectedStyle} px-5 pb-5 pt-[max(18px,env(safe-area-inset-top))] text-white shadow-sm`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-white/80">
                {route}
              </p>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-white">
                {tripName}
              </h1>
            </div>
            <div className="shrink-0 border border-white/30 bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
              Day {selectedDay.day}/{days.length}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-white/80">
              <span>{selectedDay.segment}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-2 overflow-hidden bg-white/25">
              <div
                className="h-full bg-white"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <nav aria-label="Trip sections" className="grid grid-cols-2 gap-2">
            {segments.map((segment) => {
              const isSelected = segment === selectedSegment;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`h-10 border px-3 text-sm font-bold backdrop-blur ${
                    isSelected
                      ? "border-white bg-white text-[#10231f]"
                      : "border-white/30 bg-white/10 text-white"
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
            <span className="text-sm font-bold text-white">
              Choose travel day
            </span>
            <select
              className="mt-2 h-12 w-full appearance-none border border-white/40 bg-white px-4 text-base font-semibold text-[#10231f] shadow-sm outline-none focus:border-white focus:ring-2 focus:ring-white/30"
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
                      ? "border-white bg-white text-[#10231f]"
                      : "border-white/30 bg-white/10 text-white"
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
              <div className="space-y-2 text-right">
                <p className="bg-[#e6f2ef] px-3 py-1 text-sm font-semibold text-[#0f5f59]">
                  {selectedDay.segment}
                </p>
                <p className="bg-[#f7eee2] px-3 py-1 text-sm font-semibold text-[#8a3a2b]">
                  {dayType}
                </p>
              </div>
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
  const [isOpen, setIsOpen] = useState(false);
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
    <section className="border-l-4 border-[#b3261e] bg-white shadow-sm">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>
          <span className="block text-sm font-bold text-[#19211f]">
            Local Events
          </span>
          <span className="mt-1 block text-sm leading-6 text-[#43524e]">
            {summary}
          </span>
        </span>
        <span className="shrink-0 text-sm font-bold text-[#b3261e]">
          {isOpen ? "Hide" : "Open"}
        </span>
      </button>

      {isOpen ? (
        <div className="space-y-3 border-t border-[#ece5dc] px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-[#19211f]">
            Search and Save
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#43524e]">
            Open a day-specific search, then save the useful event summary here
            for offline reference.
          </p>
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

      <div className="flex flex-wrap gap-2">
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
        </div>
      ) : null}
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

function getDayType(day: TripDay) {
  const combined = `${day.dailyContext} ${day.railSchedule} ${day.whatToExpect}`;

  if (day.segment === "Travel") {
    return combined.toLowerCase().includes("flight") ? "Flight" : "Transit";
  }

  if (combined.toLowerCase().includes("free day")) {
    return "Free Day";
  }

  if (combined.toLowerCase().includes("meet up")) {
    return "Meetup";
  }

  if (combined.toLowerCase().includes("tour") || combined.toLowerCase().includes("trip")) {
    return "Tour";
  }

  return "Explore";
}
