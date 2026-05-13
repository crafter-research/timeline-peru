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

export function EditorialTimeline({ events }: EditorialTimelineProps) {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(
    null,
  );
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(["politica", "cultura", "economia", "conflictos"]),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // All filtered events sorted by date
  const sortedEvents = useMemo(() => {
    return events
      .filter((event) => activeCategories.has(event.category))
      .filter((event) => !selectedEra || event.era === selectedEra)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, activeCategories, selectedEra]);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, callback: () => void) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        callback();
      }
    },
    [],
  );

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
                className={`text-xs font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 ${
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
            className="flex flex-wrap gap-2 mt-2"
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
                className={`px-2 py-0.5 text-xs font-sans border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 ${
                  activeCategories.has(cat)
                    ? "border-primary text-primary bg-white"
                    : "border-line-gray text-secondary bg-transparent"
                }`}
                aria-pressed={activeCategories.has(cat)}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Horizontal Timeline */}
      <main className="relative">
        {/* Timeline Line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-px bg-line-gray pointer-events-none"
          aria-hidden="true"
        />

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

            {sortedEvents.map((event, index) => {
              const hasImage = Boolean(event.image);

              return (
                <div
                  key={event.id}
                  className="flex flex-col items-center relative"
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
                      aria-label={`Ver detalles de ${event.title}`}
                    >
                      {/* Mini Card */}
                      <div className="w-16 h-20 bg-sepia-light border border-line-gray overflow-hidden mb-1 group-hover:border-accent-red group-focus-visible:ring-2 group-focus-visible:ring-accent-red transition-colors">
                        <img
                          src={event.image}
                          alt=""
                          className="w-full h-full object-cover grayscale sepia-[0.3] group-hover:sepia-0 transition-all motion-reduce:transition-none"
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
                      aria-label={`Ver detalles de ${event.title}`}
                    >
                      {/* Marker */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full border border-line-gray group-hover:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-accent-red transition-transform motion-reduce:transition-none ${
                          event.category === "conflictos"
                            ? "bg-accent-red"
                            : "bg-white group-hover:bg-accent-red/20"
                        }`}
                        aria-hidden="true"
                      />

                      {/* Year */}
                      <span className="text-[10px] font-sans text-secondary mt-1 whitespace-nowrap group-hover:text-primary transition-colors">
                        {formatYear(event.date)}
                      </span>

                      {/* Title */}
                      <span className="text-[9px] font-serif text-primary text-center max-w-20 line-clamp-2 leading-tight group-hover:text-accent-red transition-colors">
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

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedEvent(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-paper border border-line-gray shadow-2xl max-w-lg w-full max-h-[85vh] overflow-auto"
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
                className="p-1.5 text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red flex-shrink-0"
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
                    alt={selectedEvent.title}
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
