import { useCallback, useEffect, useState } from "react";

const ZOOM_STORAGE_KEY = "timeline-zoom-level";
const DEFAULT_ZOOM = 1.5;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

export function useZoom() {
	// BUG FIX #004: Persist zoom level to localStorage
	const [zoomLevel, setZoomLevel] = useState<number>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem(ZOOM_STORAGE_KEY);
			return saved ? parseFloat(saved) : DEFAULT_ZOOM;
		}
		return DEFAULT_ZOOM;
	});

	const [showZoomIndicator, setShowZoomIndicator] = useState(false);

	// BUG FIX #004: Persist zoom level changes to localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem(ZOOM_STORAGE_KEY, zoomLevel.toString());
		}
	}, [zoomLevel]);

	const zoomIn = useCallback(() => {
		setZoomLevel((z) => Math.min(MAX_ZOOM, z + 0.25));
	}, []);

	const zoomOut = useCallback(() => {
		setZoomLevel((z) => Math.max(MIN_ZOOM, z - 0.25));
	}, []);

	const resetZoom = useCallback(() => {
		setZoomLevel(1);
	}, []);

	const showIndicator = useCallback(() => {
		setShowZoomIndicator(true);
		setTimeout(() => setShowZoomIndicator(false), 1500);
	}, []);

	return {
		zoomLevel,
		setZoomLevel,
		zoomIn,
		zoomOut,
		resetZoom,
		showZoomIndicator,
		showIndicator,
		minZoom: MIN_ZOOM,
		maxZoom: MAX_ZOOM,
	};
}
