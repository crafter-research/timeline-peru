import type { HistoricalEvent } from "../types/timeline";
import { ERA_CONFIG } from "../config/timeline";

export function formatYear(date: Date): string {
  const year = date.getFullYear();
  if (year < 0) {
    return `${Math.abs(year)} a.C.`;
  }
  if (year < 1500) {
    return `${year} d.C.`;
  }
  return year.toString();
}

export function formatFullDate(date: Date, locale = "es-PE"): string {
  const year = date.getFullYear();
  if (year < 1000) {
    return formatYear(date);
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getEraForYear(year: number): keyof typeof ERA_CONFIG {
  if (year < 1438) return "preinca";
  if (year < 1532) return "inca";
  if (year < 1572) return "conquista";
  if (year < 1821) return "colonia";
  if (year < 1968) return "republica";
  return "contemporaneo";
}

export function calculateTimelineRange(events: HistoricalEvent[]) {
  if (events.length === 0) {
    return { start: new Date(1400, 0, 1), end: new Date() };
  }

  const dates = events.map((e) => e.date.getTime());
  return {
    start: new Date(Math.min(...dates)),
    end: new Date(Math.max(...dates)),
  };
}

export function getEventPosition(
  eventDate: Date,
  timelineRange: { start: Date; end: Date }
): number {
  const { start, end } = timelineRange;
  const totalRange = end.getTime() - start.getTime();
  const eventOffset = eventDate.getTime() - start.getTime();
  return (eventOffset / totalRange) * 100;
}

export function groupEventsByCategory(events: HistoricalEvent[]) {
  const grouped: Record<string, HistoricalEvent[]> = {
    politica: [],
    cultura: [],
    economia: [],
    conflictos: [],
  };

  for (const event of events) {
    grouped[event.category].push(event);
  }

  return grouped;
}

export function getUniqueYearMarkers(
  events: HistoricalEvent[],
  zoomLevel: number
): HistoricalEvent[] {
  const uniqueYears = new Map<number, HistoricalEvent>();

  events
    .filter((_, index) => index % Math.max(1, Math.floor(8 / zoomLevel)) === 0)
    .forEach((event) => {
      const year = event.date.getFullYear();
      if (!uniqueYears.has(year)) {
        uniqueYears.set(year, event);
      }
    });

  return Array.from(uniqueYears.values());
}

export function calculateEraSegments(
  timelineRange: { start: Date; end: Date },
  getPositionFn: (date: Date) => number
) {
  const { start, end } = timelineRange;
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  const segments: Array<{
    era: keyof typeof ERA_CONFIG;
    startPos: number;
    endPos: number;
  }> = [];

  for (const [eraKey, eraData] of Object.entries(ERA_CONFIG)) {
    const eraStart =
      eraKey === "preinca"
        ? startYear
        : eraKey === "inca"
          ? 1438
          : eraKey === "conquista"
            ? 1532
            : eraKey === "colonia"
              ? 1572
              : eraKey === "republica"
                ? 1821
                : 1968;

    const eraEnd = eraData.endYear;

    if (eraEnd > startYear && eraStart < endYear) {
      const segmentStart = Math.max(eraStart, startYear);
      const segmentEnd = Math.min(eraEnd, endYear);

      const startDate = new Date(segmentStart, 0, 1);
      const endDate = new Date(segmentEnd, 0, 1);

      segments.push({
        era: eraKey as keyof typeof ERA_CONFIG,
        startPos: getPositionFn(startDate),
        endPos: getPositionFn(endDate),
      });
    }
  }

  return segments;
}

export function filterEvents(
  events: HistoricalEvent[],
  selectedEra: string | null,
  searchQuery: string
): HistoricalEvent[] {
  let filtered = events;

  if (selectedEra) {
    filtered = filtered.filter((event) => event.era === selectedEra);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.content.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
}
