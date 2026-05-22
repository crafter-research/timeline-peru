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

interface TimelineMinimapProps {
  eraSegments: EraSegment[];
  selectedEra: string | null;
  scrollProgress: number;
  filteredEvents: HistoricalEvent[];
  onScrollToEra: (era: string) => void;
  onScrollToPosition: (percentage: number) => void;
  getEventPosition: (date: Date) => number;
  ERA_CONFIG: Record<string, { label: string; range: string; color: string; borderColor: string; textColor: string; endYear: number }>;
  CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bgColor: string }>;
}

export function TimelineMinimap({
  eraSegments,
  selectedEra,
  scrollProgress,
  filteredEvents,
  onScrollToEra,
  onScrollToPosition,
  getEventPosition,
  ERA_CONFIG,
  CATEGORY_CONFIG,
}: TimelineMinimapProps) {
  return (
    <div className="sticky bottom-0 bg-[#F5F1E8] border-t border-[#D4D4D4] px-8 py-4 z-30 shadow-lg">
      <div
        className="space-y-3"
        role="navigation"
        aria-label="Navegación de progreso de línea de tiempo"
      >
        {/* Era labels */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans text-[#6B6B6B] whitespace-nowrap font-bold uppercase tracking-wider">
            Eras
          </span>
          <div className="flex-1 flex gap-1">
            {eraSegments.map((segment) => (
              <button
                key={segment.era}
                type="button"
                onClick={() => onScrollToEra(segment.era)}
                className="minimap-segment text-xs font-sans px-3 py-1 rounded-full transition-all duration-300 ease-out"
                style={{
                  flex: segment.endPos - segment.startPos,
                  backgroundColor: ERA_CONFIG[segment.era].color,
                  borderWidth: selectedEra === segment.era ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: selectedEra === segment.era ? '#C4342D' : ERA_CONFIG[segment.era].borderColor,
                  fontWeight: selectedEra === segment.era ? 'bold' : 'normal',
                  color: ERA_CONFIG[segment.era].textColor,
                }}
                title={`${ERA_CONFIG[segment.era].label}: ${ERA_CONFIG[segment.era].range}`}
                aria-label={`Navegar a ${ERA_CONFIG[segment.era].label} (${ERA_CONFIG[segment.era].range})`}
              >
                {ERA_CONFIG[segment.era].label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans text-[#6B6B6B] whitespace-nowrap font-bold uppercase tracking-wider">
            Posición
          </span>
          <div className="flex-1 relative">
            {/* Clickable background for jumping */}
            <button
              type="button"
              className="w-full h-14 bg-white border border-[#D4D4D4] relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                onScrollToPosition(percentage);
              }}
              aria-label="Navegar en la línea de tiempo"
            >
              {/* Era backgrounds in minimap */}
              {eraSegments.map((segment) => (
                <div
                  key={segment.era}
                  className="absolute top-0 bottom-0 transition-opacity group-hover:opacity-70"
                  style={{
                    left: `${segment.startPos}%`,
                    width: `${segment.endPos - segment.startPos}%`,
                    backgroundColor: ERA_CONFIG[segment.era].color,
                  }}
                />
              ))}

              {/* Progress indicator */}
              <div
                className="absolute top-0 bottom-0 bg-[#C4342D]/30 border-r-2 border-[#C4342D] transition-all duration-100"
                style={{ width: `${scrollProgress * 100}%` }}
              />

              {/* Event markers */}
              {filteredEvents.map((event) => {
                const position = getEventPosition(event.date);
                const config = CATEGORY_CONFIG[event.category];
                return (
                  <div
                    key={event.id}
                    className="absolute top-0 bottom-0 w-0.5 transition-opacity group-hover:opacity-100 opacity-60"
                    style={{
                      left: `${position}%`,
                      backgroundColor: config.color,
                    }}
                    title={event.title}
                  />
                );
              })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
