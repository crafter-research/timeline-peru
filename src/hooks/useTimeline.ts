import { useMemo } from "react";
import type { HistoricalEvent } from "../types/timeline";

export function useTimeline(
	events: HistoricalEvent[],
	selectedEra: string | null,
	debouncedSearchQuery: string,
) {
	// Filter events by era and search (uses debounced query)
	const filteredEvents = useMemo(() => {
		let filtered = events;

		if (selectedEra) {
			filtered = filtered.filter((event) => event.era === selectedEra);
		}

		if (debouncedSearchQuery.trim()) {
			const query = debouncedSearchQuery.toLowerCase();
			filtered = filtered.filter(
				(event) =>
					event.title.toLowerCase().includes(query) ||
					event.content.toLowerCase().includes(query),
			);
		}

		return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
	}, [events, selectedEra, debouncedSearchQuery]);

	// Group events by category
	const eventsByCategory = useMemo(() => {
		const grouped: Record<string, HistoricalEvent[]> = {
			politica: [],
			cultura: [],
			economia: [],
			conflictos: [],
		};

		for (const event of filteredEvents) {
			grouped[event.category].push(event);
		}

		return grouped;
	}, [filteredEvents]);

	// Calculate timeline range
	const timelineRange = useMemo(() => {
		if (filteredEvents.length === 0) {
			return { start: new Date(1400, 0, 1), end: new Date() };
		}

		const dates = filteredEvents.map((e) => e.date.getTime());
		return {
			start: new Date(Math.min(...dates)),
			end: new Date(Math.max(...dates)),
		};
	}, [filteredEvents]);

	return {
		filteredEvents,
		eventsByCategory,
		timelineRange,
	};
}
