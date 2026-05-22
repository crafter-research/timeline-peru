import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TimelineHeader } from "./TimelineHeader";
import { CategoryLegend } from "./CategoryLegend";
import { TimelineDesktop } from "./TimelineDesktop";
import { TimelineMobile } from "./TimelineMobile";
import { TimelineDrawer } from "./TimelineDrawer";
import { TimelineMinimap } from "./TimelineMinimap";
import { EasterEgg } from "./EasterEgg";

interface HistoricalEvent {
  id: string;
  date: Date;
  title: string;
  category: "politica" | "cultura" | "economia" | "conflictos";
  era: string;
  content: string;
  image?: string;
}

interface EditorialTimelineProps {
  events: HistoricalEvent[];
}

const ERA_CONFIG = {
  preinca: {
    label: "Pre-Inca",
    range: "15000 a.C. - 1438",
    color: "#F5E6D3",
    borderColor: "#D4A574",
    textColor: "#8B7355",
    endYear: 1438
  },
  inca: {
    label: "Inca",
    range: "1438 - 1532",
    color: "#FFE8C5",
    borderColor: "#E6B76B",
    textColor: "#A67C52",
    endYear: 1532
  },
  conquista: {
    label: "Conquista",
    range: "1532 - 1572",
    color: "#FFD5CC",
    borderColor: "#E68A7A",
    textColor: "#A85A4A",
    endYear: 1572
  },
  colonia: {
    label: "Colonia",
    range: "1572 - 1821",
    color: "#E3E3ED",
    borderColor: "#9999B8",
    textColor: "#6B6B8B",
    endYear: 1821
  },
  republica: {
    label: "Republica",
    range: "1821 - 1968",
    color: "#C9E4F0",
    borderColor: "#6BB8DC",
    textColor: "#4A8BA8",
    endYear: 1968
  },
  contemporaneo: {
    label: "Contemporaneo",
    range: "1968 - presente",
    color: "#E8E2D5",
    borderColor: "#A8987A",
    textColor: "#7A6B55",
    endYear: 2030
  },
} as const;

const CATEGORY_CONFIG = {
  politica: { label: "POLÍTICA", icon: "⚖️", color: "#3B82F6", bgColor: "#EFF6FF" },
  cultura: { label: "CULTURA", icon: "🎭", color: "#8B5CF6", bgColor: "#F5F3FF" },
  economia: { label: "ECONOMÍA", icon: "📊", color: "#10B981", bgColor: "#ECFDF5" },
  conflictos: { label: "CONFLICTOS", icon: "⚔️", color: "#C4342D", bgColor: "#FEF2F2" },
} as const;

const CATEGORY_ORDER = ["politica", "cultura", "economia", "conflictos"] as const;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

function formatYear(date: Date): string {
  const year = date.getFullYear();
  if (year < 0) {
    return `${Math.abs(year)} a.C.`;
  }
  if (year < 1500) {
    return `${year} d.C.`;
  }
  return year.toString();
}

function formatFullDate(date: Date, locale = "es-PE"): string {
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

function getEraForYear(year: number): keyof typeof ERA_CONFIG {
  if (year < 1438) return "preinca";
  if (year < 1532) return "inca";
  if (year < 1572) return "conquista";
  if (year < 1821) return "colonia";
  if (year < 1968) return "republica";
  return "contemporaneo";
}

// Skeleton loading component
function TimelineSkeleton() {
  return (
    <div className="relative overflow-hidden">
      {/* Header skeleton */}
      <div className="border-b border-[#D4D4D4] px-8 py-6 sticky top-0 bg-[#F5F1E8] z-40">
        <div className="h-10 skeleton-shimmer rounded w-80 mb-3" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-24 skeleton-shimmer rounded-full"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Timeline skeleton with stagger */}
      <div className="px-8 py-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 skeleton-shimmer rounded mb-4"
            style={{
              animationDelay: `${i * 150}ms`,
              opacity: 1 - (i * 0.1)
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function EditorialTimeline({ events }: EditorialTimelineProps) {
  // State
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    return 1.5;
  });
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Persist zoom level to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeline-zoom-level', zoomLevel.toString());
    }
  }, [zoomLevel]);

  // Intersection Observer for scroll-triggered reveals
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    eventObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const eventId = entry.target.getAttribute('data-event-id');
            if (eventId) {
              setVisibleEvents((prev) => new Set(prev).add(eventId));
              if ('vibrate' in navigator && Math.random() < 0.1) {
                navigator.vibrate(10);
              }
            }
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    return () => {
      eventObserverRef.current?.disconnect();
    };
  }, []);

  // Easter egg - 5 clicks on logo
  const handleLogoClick = useCallback(() => {
    setLogoClickCount((prev) => {
      const newCount = prev + 1;

      if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
      logoClickTimeoutRef.current = window.setTimeout(() => setLogoClickCount(0), 2000);

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
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter events by era and search
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

  // Calculate position for an event (0 to 100%)
  const getEventPosition = useCallback(
    (eventDate: Date) => {
      const { start, end } = timelineRange;
      const totalRange = end.getTime() - start.getTime();
      const eventOffset = eventDate.getTime() - start.getTime();
      return (eventOffset / totalRange) * 100;
    },
    [timelineRange],
  );

  // Memoized year markers
  const yearMarkers = useMemo(() => {
    const uniqueYears = new Map<number, HistoricalEvent>();

    filteredEvents
      .filter((_, index) => index % Math.max(1, Math.floor(8 / zoomLevel)) === 0)
      .forEach((event) => {
        const year = event.date.getFullYear();
        if (!uniqueYears.has(year)) {
          uniqueYears.set(year, event);
        }
      });

    return Array.from(uniqueYears.values());
  }, [filteredEvents, zoomLevel]);

  // Get era segments for visual backgrounds
  const eraSegments = useMemo(() => {
    const { start, end } = timelineRange;
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    const segments: Array<{
      era: keyof typeof ERA_CONFIG;
      startPos: number;
      endPos: number;
    }> = [];

    for (const [eraKey, eraData] of Object.entries(ERA_CONFIG)) {
      const eraStart = eraKey === "preinca" ? startYear :
        eraKey === "inca" ? 1438 :
        eraKey === "conquista" ? 1532 :
        eraKey === "colonia" ? 1572 :
        eraKey === "republica" ? 1821 : 1968;

      const eraEnd = eraData.endYear;

      if (eraEnd > startYear && eraStart < endYear) {
        const segmentStart = Math.max(eraStart, startYear);
        const segmentEnd = Math.min(eraEnd, endYear);

        const startDate = new Date(segmentStart, 0, 1);
        const endDate = new Date(segmentEnd, 0, 1);

        segments.push({
          era: eraKey as keyof typeof ERA_CONFIG,
          startPos: getEventPosition(startDate),
          endPos: getEventPosition(endDate),
        });
      }
    }

    return segments;
  }, [timelineRange, getEventPosition]);

  // Handle scroll tracking with RAF throttling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        setScrollProgress(progress);

        if (scrollLeft > 10 && showScrollHint) {
          setShowScrollHint(false);
        }

        rafId = null;
      });
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [showScrollHint]);

  // Scroll to position
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
  }, []);

  // Scroll to era
  const scrollToEra = useCallback((era: string) => {
    const eraSegment = eraSegments.find(seg => seg.era === era);
    if (eraSegment) {
      const midPoint = (eraSegment.startPos + eraSegment.endPos) / 2 / 100;
      scrollToPosition(midPoint);
    }
  }, [eraSegments, scrollToPosition]);

  // Close drawer handler
  const handleCloseDrawer = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null);
      setIsClosing(false);
    }, 250);
  }, []);

  // Get eras array
  const eras = useMemo(() => Object.keys(ERA_CONFIG) as (keyof typeof ERA_CONFIG)[], []);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEvent) {
        handleCloseDrawer();
        return;
      }

      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        setZoomLevel(1);
        return;
      }

      if (isInputFocused) return;

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (!selectedEra) return;

        e.preventDefault();
        const currentIndex = eras.indexOf(selectedEra as keyof typeof ERA_CONFIG);

        if (e.key === "ArrowLeft") {
          if (currentIndex > 0) {
            const prevEra = eras[currentIndex - 1];
            setSelectedEra(prevEra);
            scrollToEra(prevEra);
          } else {
            setSelectedEra(null);
          }
        } else {
          if (currentIndex < eras.length - 1) {
            const nextEra = eras[currentIndex + 1];
            setSelectedEra(nextEra);
            scrollToEra(nextEra);
          } else {
            setSelectedEra(null);
          }
        }
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        scrollToPosition(0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        scrollToPosition(1);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent, handleCloseDrawer, selectedEra, scrollToEra, scrollToPosition, eras]);

  // Focus trap for drawer
  useEffect(() => {
    if (!selectedEvent) return;

    lastFocusedElementRef.current = document.activeElement as HTMLElement;

    const focusTimer = setTimeout(() => {
      const drawer = drawerRef.current || mobileDrawerRef.current;
      if (drawer) {
        const closeButton = drawer.querySelector(
          'button[aria-label="Cerrar"]',
        ) as HTMLElement;
        closeButton?.focus();
      }
    }, 100);

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const drawer = drawerRef.current || mobileDrawerRef.current;
      if (!drawer) return;

      const focusableElements = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleFocusTrap);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleFocusTrap);
      lastFocusedElementRef.current?.focus();
    };
  }, [selectedEvent]);

  // Handler functions
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
  }, [selectedEra, scrollToEra]);

  const handleClearFilters = useCallback(() => {
    setSelectedEra(null);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedEra(null);
    setSearchQuery("");
  }, []);

  const handleEventClick = useCallback((event: HistoricalEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(MAX_ZOOM, z + 0.25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((z) => Math.max(MIN_ZOOM, z - 0.25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Skip link for accessibility */}
      <a
        href="#timeline-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#C4342D] focus:text-white focus:rounded"
      >
        Saltar al contenido principal
      </a>

      {/* Live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {(searchQuery || selectedEra) &&
          `Se encontraron ${filteredEvents.length} eventos. ${
            selectedEra
              ? `Filtrando por era: ${ERA_CONFIG[selectedEra as keyof typeof ERA_CONFIG]?.label}. `
              : ""
          }${searchQuery ? `Buscando: ${searchQuery}` : ""}`}
      </div>

      {/* Header */}
      <TimelineHeader
        logoClickCount={logoClickCount}
        onLogoClick={handleLogoClick}
        searchQuery={searchQuery}
        debouncedSearchQuery={debouncedSearchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchClear={() => setSearchQuery("")}
        searchInputRef={searchInputRef}
        showShortcutsTooltip={showShortcutsTooltip}
        onShortcutsTooltipShow={() => setShowShortcutsTooltip(true)}
        onShortcutsTooltipHide={() => setShowShortcutsTooltip(false)}
        selectedEra={selectedEra}
        eras={eras}
        onEraSelect={setSelectedEra}
        onEraClick={handleEraClick}
        onClearFilters={handleClearFilters}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        filteredEventsCount={filteredEvents.length}
        isTransitioning={isTransitioning}
        ERA_CONFIG={ERA_CONFIG}
      />

      {/* Easter Egg */}
      <EasterEgg show={showEasterEgg} onClose={() => setShowEasterEgg(false)} />

      {/* Legend */}
      <CategoryLegend CATEGORY_ORDER={CATEGORY_ORDER} CATEGORY_CONFIG={CATEGORY_CONFIG} />

      {/* Desktop Timeline */}
      <TimelineDesktop
        scrollContainerRef={scrollContainerRef}
        isTransitioning={isTransitioning}
        zoomLevel={zoomLevel}
        eraSegments={eraSegments}
        yearMarkers={yearMarkers}
        eventsByCategory={eventsByCategory}
        visibleEvents={visibleEvents}
        showScrollHint={showScrollHint}
        filteredEvents={filteredEvents}
        searchQuery={searchQuery}
        selectedEra={selectedEra}
        onEventClick={handleEventClick}
        onClearAllFilters={handleClearAllFilters}
        getEventPosition={getEventPosition}
        formatYear={formatYear}
        getEraForYear={getEraForYear}
        eventObserverRef={eventObserverRef}
        setFeedbackState={setFeedbackState}
        ERA_CONFIG={ERA_CONFIG}
        CATEGORY_CONFIG={CATEGORY_CONFIG}
        CATEGORY_ORDER={CATEGORY_ORDER}
      />

      {/* Mobile Timeline */}
      <TimelineMobile
        filteredEvents={filteredEvents}
        onEventClick={handleEventClick}
        formatYear={formatYear}
        ERA_CONFIG={ERA_CONFIG}
        CATEGORY_CONFIG={CATEGORY_CONFIG}
      />

      {/* Minimap */}
      <TimelineMinimap
        eraSegments={eraSegments}
        selectedEra={selectedEra}
        scrollProgress={scrollProgress}
        filteredEvents={filteredEvents}
        onScrollToEra={scrollToEra}
        onScrollToPosition={scrollToPosition}
        getEventPosition={getEventPosition}
        ERA_CONFIG={ERA_CONFIG}
        CATEGORY_CONFIG={CATEGORY_CONFIG}
      />

      {/* Drawer */}
      <TimelineDrawer
        selectedEvent={selectedEvent}
        isClosing={isClosing}
        onClose={handleCloseDrawer}
        drawerRef={drawerRef}
        mobileDrawerRef={mobileDrawerRef}
        formatFullDate={formatFullDate}
        ERA_CONFIG={ERA_CONFIG}
        CATEGORY_CONFIG={CATEGORY_CONFIG}
      />
    </div>
  );
}
