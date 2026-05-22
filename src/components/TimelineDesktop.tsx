import type { RefObject } from "react";

interface HistoricalEvent {
  id: string;
  date: Date;
  title: string;
  category: "politica" | "cultura" | "economia" | "conflictos";
  era: string;
  content: string;
  image?: string;
}

interface EraSegment {
  era: string;
  startPos: number;
  endPos: number;
}

interface TimelineDesktopProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  isTransitioning: boolean;
  zoomLevel: number;
  eraSegments: EraSegment[];
  yearMarkers: HistoricalEvent[];
  eventsByCategory: Record<string, HistoricalEvent[]>;
  visibleEvents: Set<string>;
  showScrollHint: boolean;
  filteredEvents: HistoricalEvent[];
  searchQuery: string;
  selectedEra: string | null;
  onEventClick: (event: HistoricalEvent) => void;
  onClearAllFilters: () => void;
  getEventPosition: (date: Date) => number;
  formatYear: (date: Date) => string;
  getEraForYear: (year: number) => string;
  eventObserverRef: RefObject<IntersectionObserver | null>;
  setFeedbackState: (state: 'success' | 'error' | null) => void;
  ERA_CONFIG: Record<string, { label: string; range: string; color: string; borderColor: string; textColor: string; endYear: number }>;
  CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bgColor: string }>;
  CATEGORY_ORDER: readonly string[];
}

export function TimelineDesktop({
  scrollContainerRef,
  isTransitioning,
  zoomLevel,
  eraSegments,
  yearMarkers,
  eventsByCategory,
  visibleEvents,
  showScrollHint,
  filteredEvents,
  searchQuery,
  selectedEra,
  onEventClick,
  onClearAllFilters,
  getEventPosition,
  formatYear,
  getEraForYear,
  eventObserverRef,
  setFeedbackState,
  ERA_CONFIG,
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
}: TimelineDesktopProps) {
  return (
    <main
      id="timeline-main"
      className="hidden md:block relative"
      role="region"
      aria-label="Línea de tiempo histórica de cuatro carriles"
    >
      {/* Timeline Container */}
      <div
        ref={scrollContainerRef}
        className={`overflow-x-auto overflow-y-hidden ${isTransitioning ? 'page-transition-fade' : ''}`}
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="relative min-w-max transition-all duration-300"
          style={{ width: `${500 * zoomLevel}%` }}
        >
          {/* Era background segments */}
          <div className="absolute inset-0 pointer-events-none">
            {eraSegments.map((segment) => (
              <div
                key={segment.era}
                className="absolute top-0 bottom-0 era-background"
                style={{
                  left: `${segment.startPos}%`,
                  width: `${segment.endPos - segment.startPos}%`,
                  backgroundColor: ERA_CONFIG[segment.era].color,
                }}
              />
            ))}
          </div>

          {/* Era boundary markers with transition labels */}
          <div className="absolute inset-0 pointer-events-none">
            {eraSegments.map((segment, index) => {
              if (index === eraSegments.length - 1) return null;
              const nextSegment = eraSegments[index + 1];
              const boundaryPosition = segment.endPos;

              // Determine transition year
              const transitionYear =
                segment.era === 'preinca' ? 1438 :
                segment.era === 'inca' ? 1532 :
                segment.era === 'conquista' ? 1572 :
                segment.era === 'colonia' ? 1821 :
                segment.era === 'republica' ? 1968 : null;

              if (!transitionYear) return null;

              return (
                <div
                  key={`boundary-${segment.era}`}
                  className="absolute top-0 bottom-0 w-1 z-10 era-boundary"
                  style={{
                    left: `${boundaryPosition}%`,
                    background: `linear-gradient(to bottom,
                      ${ERA_CONFIG[segment.era].borderColor} 0%,
                      ${ERA_CONFIG[nextSegment.era].borderColor} 100%)`,
                    boxShadow: `0 0 8px ${ERA_CONFIG[segment.era].borderColor}40`,
                  }}
                >
                  {/* Transition year badge */}
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono font-bold px-2 py-1 rounded-full bg-white/95 shadow-md backdrop-blur-sm"
                    style={{
                      borderWidth: '1.5px',
                      borderStyle: 'solid',
                      borderColor: ERA_CONFIG[segment.era].borderColor,
                      color: ERA_CONFIG[segment.era].textColor
                    }}
                  >
                    {transitionYear}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Year markers at top */}
          <div className="sticky top-0 z-20 bg-transparent border-b border-[#D4D4D4] px-8 py-4">
            <div className="relative h-12">
              {yearMarkers.map((event) => {
                const position = getEventPosition(event.date);
                const eventYear = event.date.getFullYear();
                const era = getEraForYear(eventYear);

                return (
                  <div
                    key={event.id}
                    className="absolute top-0 group"
                    style={{ left: `${position}%` }}
                  >
                    {/* Year label - more prominent */}
                    <div className="flex flex-col items-center">
                      <div
                        className="text-base font-bold tabular-nums year-display whitespace-nowrap mb-2"
                        style={{
                          fontVariantNumeric: 'tabular-nums',
                          color: ERA_CONFIG[era].textColor
                        }}
                      >
                        {formatYear(event.date)}
                      </div>
                      <div className="w-px h-4 bg-[#C4342D]/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Lanes */}
          <div className="relative">
            {CATEGORY_ORDER.map((category) => {
              const categoryEvents = eventsByCategory[category];
              const config = CATEGORY_CONFIG[category];

              return (
                <div
                  key={category}
                  className="relative border-b border-[#D4D4D4] category-lane category-lane-enhanced"
                  style={{
                    backgroundColor: "transparent",
                    height: "200px",
                  }}
                >
                  {/* Category Label - Fixed on left */}
                  <div className="absolute left-0 top-0 bottom-0 z-10 bg-[#F5F1E8] border-r border-[#D4D4D4] px-6 flex items-center shadow-sm">
                    <div className="text-left">
                      <div className="text-2xl mb-2">{config.icon}</div>
                      <div className="text-xs font-sans font-bold text-[#1A1A1A] tracking-wider">
                        {config.label}
                      </div>
                    </div>
                  </div>

                  {/* Timeline content area */}
                  <div className="relative h-full ml-32">
                    {/* Vertical date lines */}
                    {yearMarkers.map((event) => {
                      const position = getEventPosition(event.date);
                      return (
                        <div
                          key={event.id}
                          className="absolute top-0 bottom-0 w-px bg-[#C4342D]/15"
                          style={{ left: `${position}%` }}
                        />
                      );
                    })}

                    {/* Horizontal center line */}
                    <div
                      className="absolute left-0 right-0 top-1/2 h-px bg-[#D4D4D4]"
                      aria-hidden="true"
                    />

                    {/* Events for this category */}
                    {categoryEvents.map((event, index) => {
                      const position = getEventPosition(event.date);
                      const isVisible = visibleEvents.has(event.id);
                      const staggerClass = `stagger-${Math.min(index % 10 + 1, 10)}`;

                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={(e) => {
                            onEventClick(event);
                            // Success feedback animation
                            setFeedbackState('success');
                            setTimeout(() => setFeedbackState(null), 600);
                            // Haptic feedback on mobile
                            if ('vibrate' in navigator) {
                              navigator.vibrate(30);
                            }
                          }}
                          className={`absolute top-1/2 -translate-y-1/2 group ${isVisible ? `event-scroll-reveal ${staggerClass}` : ''}`}
                          style={{ left: `${position}%` }}
                          aria-label={`${event.title}, ${formatYear(event.date)}, categoría ${CATEGORY_CONFIG[category].label}`}
                          aria-describedby={`tooltip-${event.id}`}
                          data-event-id={event.id}
                          ref={(el) => {
                            if (el && eventObserverRef.current && !visibleEvents.has(event.id)) {
                              eventObserverRef.current.observe(el);
                            }
                          }}
                        >
                          {/* Invisible larger click target for accessibility (44x44 minimum) */}
                          <div
                            className="absolute -inset-4 cursor-pointer"
                            aria-hidden="true"
                          />

                          {/* Event dot with enhanced depth and interaction */}
                          <div className="relative flex flex-col items-center event-dot-wrapper">
                            {/* Base shadow layer for depth */}
                            <div
                              className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 group-focus-visible:opacity-50 transition-opacity duration-300"
                              style={{
                                backgroundColor: config.color,
                                transform: "scale(2)",
                              }}
                            />

                            {/* Primary dot */}
                            <div
                              className="event-dot relative z-10"
                              style={{
                                backgroundColor: config.color,
                                boxShadow: `0 2px 8px ${config.color}60, inset 0 1px 2px rgba(255,255,255,0.4)`,
                              }}
                            >
                              {/* Inner highlight for 3D effect */}
                              <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                            </div>

                            {/* Pulse ring */}
                            <div
                              className="event-pulse-ring"
                              style={{ backgroundColor: config.color }}
                            />

                            {/* Connection line to tooltip */}
                            <div
                              className="absolute top-full h-2 w-0.5 opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40 transition-opacity duration-300"
                              style={{ backgroundColor: config.color }}
                            />

                            {/* Tooltip on hover/focus */}
                            <div
                              id={`tooltip-${event.id}`}
                              role="tooltip"
                              className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none bg-white border-2 px-4 py-3 rounded-lg shadow-2xl z-30 max-w-xs"
                              style={{
                                borderColor: config.color,
                                whiteSpace: "normal",
                              }}
                            >
                              <div className="text-xs font-sans font-bold text-[#1A1A1A] mb-2 break-words">
                                {event.title}
                              </div>
                              <div className="text-xs font-sans text-[#6B6B6B]">
                                {formatYear(event.date)}
                              </div>
                              <div
                                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t-2 border-l-2 bg-white"
                                style={{ borderColor: config.color }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty state when no results */}
      {filteredEvents.length === 0 && (
        <div
          className={`flex items-center justify-center h-96 empty-state-reveal ${(searchQuery || selectedEra) ? 'error-shake' : ''}`}
          role="status"
        >
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-[#D4D4D4] empty-state-icon-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="font-sans text-xl font-bold text-[#1A1A1A] mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-sm text-[#6B6B6B] mb-4">
              Intenta ajustar los filtros o buscar otro término
            </p>
            {(selectedEra || searchQuery) && (
              <button
                type="button"
                onClick={onClearAllFilters}
                className="px-4 py-2 bg-[#C4342D] text-white rounded-lg hover:bg-[#A42D26] transition-colors"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
