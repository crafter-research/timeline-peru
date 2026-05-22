import { useState, useCallback, useRef, useEffect } from "react";
import type { HistoricalEvent } from "../types/timeline";
import { MIN_ZOOM, MAX_ZOOM, DEFAULT_ZOOM } from "../config/timeline";

export function useTimelineState() {
  // Core state
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Zoom state with localStorage
  const [zoomLevel, setZoomLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedZoom = localStorage.getItem('timeline-zoom-level');
      if (savedZoom) {
        const parsed = parseFloat(savedZoom);
        if (!isNaN(parsed) && parsed >= MIN_ZOOM && parsed <= MAX_ZOOM) {
          return parsed;
        }
      }
    }
    return DEFAULT_ZOOM;
  });

  // UI state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showShortcutsTooltip, setShowShortcutsTooltip] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'success' | 'error' | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const eventObserverRef = useRef<IntersectionObserver | null>(null);
  const logoClickTimeoutRef = useRef<number | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Persist zoom
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeline-zoom-level', zoomLevel.toString());
    }
  }, [zoomLevel]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return {
    // State
    selectedEra,
    setSelectedEra,
    selectedEvent,
    setSelectedEvent,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    isClosing,
    setIsClosing,
    isLoading,
    zoomLevel,
    setZoomLevel,
    scrollProgress,
    setScrollProgress,
    showScrollHint,
    setShowScrollHint,
    showShortcutsTooltip,
    setShowShortcutsTooltip,
    visibleEvents,
    setVisibleEvents,
    isTransitioning,
    setIsTransitioning,
    feedbackState,
    setFeedbackState,
    logoClickCount,
    setLogoClickCount,
    showEasterEgg,
    setShowEasterEgg,
    // Refs
    scrollContainerRef,
    drawerRef,
    mobileDrawerRef,
    lastFocusedElementRef,
    searchInputRef,
    eventObserverRef,
    logoClickTimeoutRef,
  };
}
