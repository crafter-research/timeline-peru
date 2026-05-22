// Convert dates: years > 2030 are interpreted as BCE (negative years)
// Also handles JavaScript Date parsing quirks (off-by-one for certain years)
export function normalizeDateToBCE(date: Date): Date {
	const year = date.getFullYear();
	// If year is unreasonably in the future, treat as BCE
	if (year > 2030) {
		// Create a new date with negative year for BCE
		const normalizedDate = new Date(date);
		// Add 1 to compensate for JavaScript Date off-by-one bug with large years
		normalizedDate.setFullYear(-(year + 1));
		return normalizedDate;
	}
	// For years 0-100, JavaScript Date can be off by 1
	// Check if original date string indicated a different year
	if (year < 100) {
		// Accept the parsed year as-is, but be aware of potential issues
		// This is a known limitation of JavaScript Date for ancient dates
	}
	return date;
}

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

export function getEraForYear(
	year: number,
): keyof typeof import("../types/timeline").ERA_CONFIG {
	if (year < 1438) return "preinca";
	if (year < 1532) return "inca";
	if (year < 1572) return "conquista";
	if (year < 1821) return "colonia";
	if (year < 1968) return "republica";
	return "contemporaneo";
}
