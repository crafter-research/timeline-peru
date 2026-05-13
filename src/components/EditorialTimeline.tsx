import { useCallback, useEffect, useMemo, useState } from "react";

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

  // Group events by era
  const eventsByEra = useMemo(() => {
    const grouped: Record<string, HistoricalEvent[]> = {};
    for (const event of events) {
      if (!activeCategories.has(event.category)) continue;
      if (!grouped[event.era]) {
        grouped[event.era] = [];
      }
      grouped[event.era].push(event);
    }
    // Sort events within each era by date
    for (const era of Object.keys(grouped)) {
      grouped[era].sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    return grouped;
  }, [events, activeCategories]);

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
      <header className="border-b border-line-gray px-8 py-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary uppercase">
            Historia del Peru
          </h1>
          <p className="font-serif text-lg text-secondary mt-1 italic">
            Linea de tiempo de eventos
          </p>

          {/* Era Legend */}
          <div className="flex flex-wrap gap-4 mt-6">
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
                className={`text-sm font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 ${
                  selectedEra === era
                    ? "text-accent-red underline underline-offset-4"
                    : "text-secondary hover:text-primary"
                }`}
                aria-pressed={selectedEra === era}
              >
                <span className="font-medium">{ERA_CONFIG[era].label}</span>
                <span className="text-xs ml-1 opacity-70">
                  {ERA_CONFIG[era].range}
                </span>
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap gap-3 mt-4"
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
                className={`px-3 py-1 text-xs font-sans border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 ${
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

      {/* Timeline Content */}
      <main className="px-8 py-12 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {eras
            .filter((era) => !selectedEra || selectedEra === era)
            .filter((era) => eventsByEra[era]?.length > 0)
            .map((era, eraIndex) => (
              <section
                key={era}
                className="mb-16"
                aria-labelledby={`era-${era}`}
              >
                {/* Era Header */}
                <div className="flex items-center gap-4 mb-8">
                  <h2
                    id={`era-${era}`}
                    className="font-serif text-xl font-bold text-primary"
                  >
                    {ERA_CONFIG[era].label}
                  </h2>
                  <span className="text-xs font-sans text-secondary px-2 py-0.5 bg-accent-red/10 text-accent-red">
                    {ERA_CONFIG[era].range}
                  </span>
                  <div
                    className="flex-1 h-px bg-line-gray"
                    aria-hidden="true"
                  />
                </div>

                {/* Timeline Line with Events */}
                <div className="relative">
                  {/* Horizontal Timeline Line */}
                  <div
                    className="absolute left-0 right-0 top-48 h-px bg-line-gray"
                    aria-hidden="true"
                  />

                  {/* Event Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {eventsByEra[era]?.map((event, index) => (
                      <article
                        key={event.id}
                        className="group relative"
                        aria-labelledby={`event-${event.id}`}
                      >
                        {/* Figure Number */}
                        <span
                          className="absolute -top-2 -left-2 text-xs font-sans italic text-secondary z-10"
                          aria-hidden="true"
                        >
                          Fig {eraIndex * 10 + index + 1}
                        </span>

                        {/* Image Panel */}
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => setSelectedEvent(event))
                          }
                          className="w-full aspect-[3/4] bg-sepia-light overflow-hidden mb-3 border border-line-gray hover:border-accent-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2"
                          aria-label={`Ver detalles de ${event.title}`}
                        >
                          {event.image ? (
                            <img
                              src={event.image}
                              alt=""
                              className="w-full h-full object-cover grayscale sepia-[0.3] group-hover:sepia-0 transition-all"
                              loading="lazy"
                              width={200}
                              height={267}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-4">
                              <span className="font-serif text-sm text-sepia-dark text-center leading-tight">
                                {event.title}
                              </span>
                            </div>
                          )}
                        </button>

                        {/* Connecting Line */}
                        <div
                          className="absolute left-1/2 top-[calc(100%-3rem)] w-px h-12 bg-line-gray"
                          aria-hidden="true"
                        />

                        {/* Timeline Marker */}
                        <div
                          className={`absolute left-1/2 top-48 -translate-x-1/2 w-2 h-2 rounded-full border border-line-gray ${
                            event.category === "conflictos"
                              ? "bg-accent-red"
                              : "bg-white"
                          }`}
                          aria-hidden="true"
                        />

                        {/* Date */}
                        <p className="text-xs font-sans text-secondary text-center mt-14">
                          {formatYear(event.date)}
                        </p>

                        {/* Title */}
                        <h3
                          id={`event-${event.id}`}
                          className="font-serif text-sm font-bold text-primary text-center mt-1 leading-tight"
                        >
                          {event.title}
                        </h3>

                        {/* Category */}
                        <p className="text-xs font-sans text-secondary text-center mt-1 italic">
                          {CATEGORY_LABELS[event.category]}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ))}
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
          // biome-ignore lint/a11y/useSemanticElements: Dialog needs div for overlay click handling
        >
          <div
            className="bg-paper border border-line-gray shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              touchAction: "manipulation",
              overscrollBehavior: "contain",
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-paper border-b border-line-gray px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-sans text-accent-red uppercase tracking-wider">
                  {
                    ERA_CONFIG[selectedEvent.era as keyof typeof ERA_CONFIG]
                      ?.label
                  }{" "}
                  · {CATEGORY_LABELS[selectedEvent.category]}
                </span>
                <h2
                  id="modal-title"
                  className="font-serif text-2xl font-bold text-primary mt-1"
                >
                  {selectedEvent.title}
                </h2>
                <p className="text-sm font-sans text-secondary mt-1">
                  {formatFullDate(selectedEvent.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-2 text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-5 h-5"
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
            <div className="p-6">
              {selectedEvent.image && (
                <figure className="mb-6">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full aspect-video object-cover grayscale sepia-[0.2]"
                    width={600}
                    height={338}
                  />
                  <figcaption className="text-xs font-sans italic text-secondary mt-2 text-center">
                    {selectedEvent.title}
                  </figcaption>
                </figure>
              )}

              <div className="font-serif text-base text-primary leading-relaxed prose prose-stone max-w-none">
                <p>{selectedEvent.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
