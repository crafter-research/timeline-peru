import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  preinca: { label: "Pre-Inca", range: "15000 a.C. - 1438" },
  inca: { label: "Inca", range: "1438 - 1532" },
  conquista: { label: "Conquista", range: "1532 - 1572" },
  colonia: { label: "Colonia", range: "1572 - 1821" },
  republica: { label: "Republica", range: "1821 - 1968" },
  contemporaneo: { label: "Contemporaneo", range: "1968 - presente" },
} as const;

const CATEGORY_LABELS = {
  politica: "Politica",
  cultura: "Cultura",
  economia: "Economia",
  conflictos: "Conflictos",
} as const;

const CATEGORY_ICONS = {
  politica: "⚖",
  cultura: "🎭",
  economia: "📊",
  conflictos: "⚔",
} as const;

const ALL_CATEGORIES = new Set(["politica", "cultura", "economia", "conflictos"]);

function formatYear(date: Date): string {
  const year = date.getFullYear();
  if (year < 0) {
    return `${Math.abs(year)} a.C.`;
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

// Century markers for jump-to navigation
const CENTURY_MARKERS = [
  { label: "Pre-Historia", year: -3000 },
  { label: "1500s", year: 1500 },
  { label: "1700s", year: 1700 },
  { label: "1800s", year: 1800 },
  { label: "1900s", year: 1900 },
  { label: "2000s", year: 2000 },
];

export function EditorialTimeline({ events }: EditorialTimelineProps) {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(
    null,
  );
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(ALL_CATEGORIES),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll position tracking
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState<string>("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Read initial filter state from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eraParam = params.get("era");
    const categoriesParam = params.get("categories");

    if (eraParam && eraParam in ERA_CONFIG) {
      setSelectedEra(eraParam);
    }
    if (categoriesParam) {
      const cats = categoriesParam.split(",").filter(c => c in CATEGORY_LABELS);
      if (cats.length > 0) {
        setActiveCategories(new Set(cats));
      }
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedEra) params.set("era", selectedEra);
    if (activeCategories.size < 4) {
      params.set("categories", Array.from(activeCategories).join(","));
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [selectedEra, activeCategories]);

  // All filtered events sorted by date
  const sortedEvents = useMemo(() => {
    return events
      .filter((event) => activeCategories.has(event.category))
      .filter((event) => !selectedEra || event.era === selectedEra)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, activeCategories, selectedEra]);

  // Handle scroll position tracking
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);

      // Update scroll indicators
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < maxScroll - 10);

      // Calculate approximate year based on scroll position
      if (sortedEvents.length > 0) {
        const eventIndex = Math.floor(progress * (sortedEvents.length - 1));
        const event = sortedEvents[Math.min(eventIndex, sortedEvents.length - 1)];
        if (event) {
          setCurrentYear(formatYear(event.date));
        }
      }
    };

    // Initial calculation
    handleScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [sortedEvents]);

  const toggleCategory = useCallback((category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedEra(null);
    setActiveCategories(new Set(ALL_CATEGORIES));
  }, []);

  const hasActiveFilters = selectedEra !== null || activeCategories.size < 4;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, callback: () => void) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        callback();
      }
    },
    [],
  );

  // Jump to specific year
  const jumpToYear = useCallback((year: number) => {
    const eventIndex = sortedEvents.findIndex(e => e.date.getFullYear() >= year);
    if (eventIndex >= 0 && scrollContainerRef.current) {
      const eventElements = scrollContainerRef.current.querySelectorAll('[data-event]');
      eventElements[eventIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [sortedEvents]);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEvent) {
        setSelectedEvent(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selectedEvent]);

  const eras = Object.keys(ERA_CONFIG) as (keyof typeof ERA_CONFIG)[];

  return (
    <div className="min-h-screen bg-paper">
      {/* Skip Link for Accessibility */}
      <a
        href="#timeline-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent-red focus:text-white focus:px-4 focus:py-2 focus:text-sm"
      >
        Saltar al contenido principal
      </a>

      {/* Header */}
      <header className="border-b border-line-gray px-4 py-4 md:px-8 lg:px-12 sticky top-0 bg-paper z-40">
        <div className="max-w-full">
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary uppercase">
            Historia del Peru
          </h1>
          <p className="font-serif text-sm text-secondary mt-0.5 italic">
            Linea de tiempo de eventos
          </p>

          {/* Era Legend */}
          <div className="flex flex-wrap gap-2 mt-4">
            {eras.map((era) => (
              <button
                key={era}
                type="button"
                onClick={() => setSelectedEra(selectedEra === era ? null : era)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () =>
                    setSelectedEra(selectedEra === era ? null : era),
                  )
                }
                className={`text-xs font-sans filter-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 ${
                  selectedEra === era
                    ? "text-accent-red underline underline-offset-4"
                    : "text-secondary hover:text-primary"
                }`}
                aria-pressed={selectedEra === era}
              >
                <span className="font-medium">{ERA_CONFIG[era].label}</span>
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap items-center gap-2 mt-2"
            role="group"
            aria-label="Filtrar por categoria"
          >
            {(
              Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                onKeyDown={(e) => handleKeyDown(e, () => toggleCategory(cat))}
                className={`px-2 py-0.5 text-xs font-sans border filter-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 ${
                  activeCategories.has(cat)
                    ? "border-primary text-primary bg-white"
                    : "border-line-gray text-secondary bg-transparent"
                }`}
                aria-pressed={activeCategories.has(cat)}
              >
                <span className="mr-1" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                {CATEGORY_LABELS[cat]}
              </button>
            ))}

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-accent-red hover:underline filter-transition ml-2"
                aria-label="Limpiar todos los filtros"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 mt-2 text-[10px] text-secondary" role="note" aria-label="Leyenda de colores">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-red" aria-hidden="true" />
              Conflictos
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white border border-line-gray" aria-hidden="true" />
              Otros eventos
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div
        className="sticky top-[125px] md:top-[115px] z-30 bg-paper border-b border-line-gray px-4 md:px-8 py-2"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso del timeline: ${Math.round(scrollProgress * 100)}%${currentYear ? `, año ${currentYear}` : ''}`}
      >
        <div className="flex items-center gap-4">
          {/* Current Year Display */}
          <span className="text-sm font-sans font-medium text-accent-red min-w-[80px]" aria-live="polite">
            {currentYear || '—'}
          </span>

          {/* Progress Bar */}
          <div className="flex-1 h-1.5 bg-line-gray/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-red rounded-full progress-bar-transition"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Century Jump Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {CENTURY_MARKERS.map((marker) => (
              <button
                key={marker.year}
                type="button"
                onClick={() => jumpToYear(marker.year)}
                className="text-[10px] font-sans text-secondary hover:text-accent-red px-1.5 py-0.5 filter-transition"
                aria-label={`Ir a ${marker.label}`}
              >
                {marker.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Timeline - Desktop */}
      <main id="timeline-content" className="relative hidden md:block">
        {/* Timeline Line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-px bg-line-gray pointer-events-none"
          aria-hidden="true"
        />

        {/* Scroll Affordance Container */}
        <div className={`relative ${canScrollLeft ? 'scroll-fade-left' : ''} ${canScrollRight ? 'scroll-fade-right' : ''}`}>
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-4"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex items-center gap-1 px-4 md:px-8 py-8 min-w-max">
              {/* Start marker */}
              <div className="flex flex-col items-center mr-4">
                <span className="text-xs font-sans text-accent-red font-medium">
                  {formatYear(sortedEvents[0]?.date || new Date(-10000, 0, 1))}
                </span>
                <div className="w-3 h-3 rounded-full bg-accent-red mt-1" />
              </div>

              {sortedEvents.map((event) => {
                const hasImage = Boolean(event.image);

                return (
                  <div
                    key={event.id}
                    className="flex flex-col items-center relative event-fade-in"
                    data-event
                  >
                    {/* Event with Image - Small Card */}
                    {hasImage ? (
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setSelectedEvent(event))
                        }
                        className="group flex flex-col items-center focus-visible:outline-none"
                        aria-label={`Ver detalles de ${event.title}, ${formatYear(event.date)}`}
                      >
                        {/* Mini Card */}
                        <div className="w-16 h-20 bg-sepia-light border border-line-gray overflow-hidden mb-1 group-hover:border-accent-red group-focus-visible:ring-2 group-focus-visible:ring-accent-red filter-transition">
                          <img
                            src={event.image}
                            alt={`Imagen histórica: ${event.title}`}
                            className="w-full h-full object-cover grayscale sepia-[0.3] group-hover:sepia-0 filter-transition motion-reduce:transition-none"
                            loading="lazy"
                            width={64}
                            height={80}
                          />
                        </div>

                        {/* Connector */}
                        <div
                          className="w-px h-3 bg-line-gray"
                          aria-hidden="true"
                        />

                        {/* Marker */}
                        <div
                          className={`w-2 h-2 rounded-full border border-line-gray ${
                            event.category === "conflictos"
                              ? "bg-accent-red"
                              : "bg-white"
                          }`}
                          aria-hidden="true"
                        />

                        {/* Year */}
                        <span className="text-[10px] font-sans text-secondary mt-1 whitespace-nowrap">
                          {formatYear(event.date)}
                        </span>

                        {/* Title (truncated) */}
                        <span className="text-[9px] font-serif text-primary text-center max-w-16 truncate">
                          {event.title}
                        </span>
                      </button>
                    ) : (
                      /* Event without Image - Text Only */
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => setSelectedEvent(event))
                        }
                        className="group flex flex-col items-center focus-visible:outline-none"
                        aria-label={`Ver detalles de ${event.title}, ${formatYear(event.date)}`}
                      >
                        {/* Marker */}
                        <div
                          className={`w-2.5 h-2.5 rounded-full border border-line-gray group-hover:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-accent-red filter-transition motion-reduce:transition-none ${
                            event.category === "conflictos"
                              ? "bg-accent-red"
                              : "bg-white group-hover:bg-accent-red/20"
                          }`}
                          aria-hidden="true"
                        />

                        {/* Year */}
                        <span className="text-[10px] font-sans text-secondary mt-1 whitespace-nowrap group-hover:text-primary filter-transition">
                          {formatYear(event.date)}
                        </span>

                        {/* Title */}
                        <span className="text-[9px] font-serif text-primary text-center max-w-20 line-clamp-2 leading-tight group-hover:text-accent-red filter-transition">
                          {event.title}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* End marker */}
              <div className="flex flex-col items-center ml-4">
                <span className="text-xs font-sans text-accent-red font-medium">
                  {formatYear(
                    sortedEvents[sortedEvents.length - 1]?.date || new Date(),
                  )}
                </span>
                <div className="w-3 h-3 rounded-full bg-accent-red mt-1" />
              </div>

              {/* Infinite scroll indicator */}
              <div className="flex items-center ml-8 text-secondary">
                <svg
                  className="w-4 h-4 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Era Indicators */}
        <div className="absolute bottom-0 left-0 right-0 flex px-4 md:px-8 pointer-events-none">
          {eras
            .filter((era) => !selectedEra || selectedEra === era)
            .map((era) => {
              const eraEvents = sortedEvents.filter((e) => e.era === era);
              if (eraEvents.length === 0) return null;
              return (
                <span
                  key={era}
                  className="text-[8px] font-sans text-accent-red/60 uppercase tracking-wider mr-auto"
                >
                  {ERA_CONFIG[era].label}
                </span>
              );
            })}
        </div>
      </main>

      {/* Vertical Timeline - Mobile */}
      <main id="timeline-content-mobile" className="md:hidden px-4 py-6">
        <div className="relative">
          {/* Vertical Line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px bg-line-gray"
            aria-hidden="true"
          />

          {/* Events */}
          <div className="space-y-6 pl-10">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className="relative event-fade-in"
                data-event
              >
                {/* Marker on line */}
                <div
                  className={`absolute -left-[26px] top-1 w-3 h-3 rounded-full border border-line-gray ${
                    event.category === "conflictos"
                      ? "bg-accent-red"
                      : "bg-white"
                  }`}
                  aria-hidden="true"
                />

                {/* Event Card */}
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 rounded"
                  aria-label={`Ver detalles de ${event.title}`}
                >
                  <div className="border border-line-gray bg-white p-3 group-hover:border-accent-red filter-transition">
                    {/* Date & Category */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-sans text-accent-red font-medium">
                        {formatYear(event.date)}
                      </span>
                      <span className="text-[10px] font-sans text-secondary uppercase tracking-wider">
                        <span aria-hidden="true">{CATEGORY_ICONS[event.category]}</span> {CATEGORY_LABELS[event.category]}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-sm font-bold text-primary group-hover:text-accent-red filter-transition">
                      {event.title}
                    </h3>

                    {/* Era */}
                    <span className="text-[10px] font-sans text-secondary">
                      {ERA_CONFIG[event.era as keyof typeof ERA_CONFIG]?.label}
                    </span>

                    {/* Image if available */}
                    {event.image && (
                      <img
                        src={event.image}
                        alt={`Imagen histórica: ${event.title}`}
                        className="w-full h-24 object-cover mt-2 grayscale sepia-[0.3]"
                        loading="lazy"
                      />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={() => setSelectedEvent(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedEvent(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-paper border border-line-gray shadow-2xl max-w-lg w-full max-h-[85vh] overflow-auto modal-content"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              touchAction: "manipulation",
              overscrollBehavior: "contain",
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-paper border-b border-line-gray px-4 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-sans text-accent-red uppercase tracking-wider">
                  <span aria-hidden="true">{CATEGORY_ICONS[selectedEvent.category]}</span>{" "}
                  {
                    ERA_CONFIG[selectedEvent.era as keyof typeof ERA_CONFIG]
                      ?.label
                  }{" "}
                  · {CATEGORY_LABELS[selectedEvent.category]}
                </span>
                <h2
                  id="modal-title"
                  className="font-serif text-lg font-bold text-primary mt-0.5 text-wrap-balance"
                >
                  {selectedEvent.title}
                </h2>
                <p className="text-xs font-sans text-secondary mt-0.5">
                  {formatFullDate(selectedEvent.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-secondary hover:text-primary filter-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red flex-shrink-0"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {selectedEvent.image && (
                <figure className="mb-4">
                  <img
                    src={selectedEvent.image}
                    alt={`Imagen histórica representando: ${selectedEvent.title}`}
                    className="w-full aspect-video object-cover grayscale sepia-[0.2]"
                    width={480}
                    height={270}
                  />
                  <figcaption className="text-[10px] font-sans italic text-secondary mt-1.5 text-center">
                    {selectedEvent.title}
                  </figcaption>
                </figure>
              )}

              <div className="font-serif text-sm text-primary leading-relaxed">
                <p>{selectedEvent.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
