import { useCallback, type RefObject } from "react";
import type { HistoricalEvent } from "../types/timeline";

interface UseTimelineHandlersProps {
  selectedEra: string | null;
  scrollContainerRef: RefObject<HTMLDivElement>;
  logoClickTimeoutRef: RefObject<number | null>;
  eraSegments: Array<{ era: string; startPos: number; endPos: number }>;
  setSelectedEra: (era: string | null) => void;
  setSelectedEvent: (event: HistoricalEvent | null) => void;
  setSearchQuery: (query: string) => void;
  setIsClosing: (closing: boolean) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setVisibleEvents: (events: Set<string>) => void;
  setZoomLevel: (fn: (z: number) => number) => void;
  setLogoClickCount: (fn: (prev: number) => number) => void;
  setShowEasterEgg: (show: boolean) => void;
  MIN_ZOOM: number;
  MAX_ZOOM: number;
}

export function useTimelineHandlers(props: UseTimelineHandlersProps) {
  const {
    selectedEra,
    scrollContainerRef,
    logoClickTimeoutRef,
    eraSegments,
    setSelectedEra,
    setSelectedEvent,
    setSearchQuery,
    setIsClosing,
    setIsTransitioning,
    setVisibleEvents,
    setZoomLevel,
    setLogoClickCount,
    setShowEasterEgg,
    MIN_ZOOM,
    MAX_ZOOM,
  } = props;

  const scrollToPosition = useCallback((percentage: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = maxScroll * percentage;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  }, [scrollContainerRef]);

  const scrollToEra = useCallback((era: string) => {
    const eraSegment = eraSegments.find(seg => seg.era === era);
    if (eraSegment) {
      const midPoint = (eraSegment.startPos + eraSegment.endPos) / 2 / 100;
      scrollToPosition(midPoint);
    }
  }, [eraSegments, scrollToPosition]);

  const handleCloseDrawer = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsClosing(false);
    }, 250);
  }, [setIsClosing, setSelectedEvent]);

  const handleEraClick = useCallback((era: string) => {
    const newEra = selectedEra === era ? null : era;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedEra(newEra);
      setVisibleEvents(new Set());
      if (newEra) {
        scrollToEra(newEra);
      }
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [selectedEra, setSelectedEra, setIsTransitioning, setVisibleEvents, scrollToEra]);

  const handleClearFilters = useCallback(() => {
    setSelectedEra(null);
  }, [setSelectedEra]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedEra(null);
    setSearchQuery("");
  }, [setSelectedEra, setSearchQuery]);

  const handleEventClick = useCallback((event: HistoricalEvent) => {
    setSelectedEvent(event);
  }, [setSelectedEvent]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(MAX_ZOOM, z + 0.25));
  }, [setZoomLevel, MAX_ZOOM]);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((z) => Math.max(MIN_ZOOM, z - 0.25));
  }, [setZoomLevel, MIN_ZOOM]);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(() => 1);
  }, [setZoomLevel]);

  const handleLogoClick = useCallback(() => {
    setLogoClickCount((prev) => {
      const newCount = prev + 1;

      if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
      logoClickTimeoutRef.current = window.setTimeout(() => setLogoClickCount(() => 0), 2000);

      if (newCount === 5) {
        setShowEasterEgg(true);
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 100, 50, 100, 200]);
        }
        setTimeout(() => setShowEasterEgg(false), 5000);
        return 0;
      }
      return newCount;
    });
  }, [logoClickTimeoutRef, setLogoClickCount, setShowEasterEgg]);

  return {
    scrollToPosition,
    scrollToEra,
    handleCloseDrawer,
    handleEraClick,
    handleClearFilters,
    handleClearAllFilters,
    handleEventClick,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleLogoClick,
  };
}
