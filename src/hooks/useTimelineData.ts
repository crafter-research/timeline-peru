import { useMemo, useCallback } from "react";
import type { HistoricalEvent } from "../types/timeline";
import {
  calculateTimelineRange,
  getEventPosition as getEventPositionUtil,
  groupEventsByCategory,
  getUniqueYearMarkers,
  calculateEraSegments,
  filterEvents,
} from "../utils/timelineHelpers";

export function useTimelineData(
  events: HistoricalEvent[],
  selectedEra: string | null,
  debouncedSearchQuery: string,
  zoomLevel: number
) {
  // Filter events
  const filteredEvents = useMemo(
    () => filterEvents(events, selectedEra, debouncedSearchQuery),
    [events, selectedEra, debouncedSearchQuery]
  );

  // Group by category
  const eventsByCategory = useMemo(
    () => groupEventsByCategory(filteredEvents),
    [filteredEvents]
  );

  // Timeline range
  const timelineRange = useMemo(
    () => calculateTimelineRange(filteredEvents),
    [filteredEvents]
  );

  // Get event position function
  const getEventPosition = useCallback(
    (eventDate: Date) => getEventPositionUtil(eventDate, timelineRange),
    [timelineRange]
  );

  // Year markers
  const yearMarkers = useMemo(
    () => getUniqueYearMarkers(filteredEvents, zoomLevel),
    [filteredEvents, zoomLevel]
  );

  // Era segments
  const eraSegments = useMemo(
    () => calculateEraSegments(timelineRange, getEventPosition),
    [timelineRange, getEventPosition]
  );

  return {
    filteredEvents,
    eventsByCategory,
    timelineRange,
    yearMarkers,
    eraSegments,
    getEventPosition,
  };
}
