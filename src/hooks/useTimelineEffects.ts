import { useEffect, useCallback, type RefObject } from "react";
import type { HistoricalEvent } from "../types/timeline";
import { ERA_CONFIG } from "../config/timeline";

interface UseTimelineEffectsProps {
  selectedEvent: HistoricalEvent | null;
  selectedEra: string | null;
  showScrollHint: boolean;
  eras: readonly string[];
  scrollContainerRef: RefObject<HTMLDivElement>;
  drawerRef: RefObject<HTMLDivElement>;
  mobileDrawerRef: RefObject<HTMLDivElement>;
  lastFocusedElementRef: RefObject<HTMLElement | null>;
  searchInputRef: RefObject<HTMLInputElement>;
  eventObserverRef: RefObject<IntersectionObserver | null>;
  setScrollProgress: (progress: number) => void;
  setShowScrollHint: (show: boolean) => void;
  setVisibleEvents: (fn: (prev: Set<string>) => Set<string>) => void;
  setSelectedEra: (era: string | null) => void;
  setZoomLevel: (level: number) => void;
  scrollToEra: (era: string) => void;
  scrollToPosition: (percentage: number) => void;
  handleCloseDrawer: () => void;
}

export function useTimelineEffects(props: UseTimelineEffectsProps) {
  const {
    selectedEvent,
    selectedEra,
    showScrollHint,
    eras,
    scrollContainerRef,
    drawerRef,
    mobileDrawerRef,
    lastFocusedElementRef,
    searchInputRef,
    eventObserverRef,
    setScrollProgress,
    setShowScrollHint,
    setVisibleEvents,
    setSelectedEra,
    setZoomLevel,
    scrollToEra,
    scrollToPosition,
    handleCloseDrawer,
  } = props;

  // Intersection Observer
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
  }, [eventObserverRef, setVisibleEvents]);

  // Scroll tracking
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
  }, [scrollContainerRef, showScrollHint, setScrollProgress, setShowScrollHint]);

  // Keyboard shortcuts
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
  }, [selectedEvent, selectedEra, eras, searchInputRef, handleCloseDrawer, setSelectedEra, setZoomLevel, scrollToEra, scrollToPosition]);

  // Focus trap
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
  }, [selectedEvent, drawerRef, mobileDrawerRef, lastFocusedElementRef]);
}
