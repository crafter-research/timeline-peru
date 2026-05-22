interface HistoricalEvent {
  id: string;
  date: Date;
  title: string;
  category: "politica" | "cultura" | "economia" | "conflictos";
  era: string;
  content: string;
  image?: string;
}

interface TimelineMobileProps {
  filteredEvents: HistoricalEvent[];
  onEventClick: (event: HistoricalEvent) => void;
  formatYear: (date: Date) => string;
  ERA_CONFIG: Record<string, { label: string; range: string; color: string; borderColor: string; textColor: string; endYear: number }>;
  CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bgColor: string }>;
}

export function TimelineMobile({
  filteredEvents,
  onEventClick,
  formatYear,
  ERA_CONFIG,
  CATEGORY_CONFIG,
}: TimelineMobileProps) {
  return (
    <main className="md:hidden px-4 py-6">
      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onEventClick(event)}
            className="w-full text-left event-fade-in hover-lift"
          >
            <div className="border border-[#D4D4D4] bg-white p-4 rounded-lg hover:border-[#C4342D] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">
                  {CATEGORY_CONFIG[event.category].icon}
                </span>
                <span className="text-xs font-sans font-bold text-[#C4342D]">
                  {formatYear(event.date)}
                </span>
                <span className="text-xs font-sans text-[#6B6B6B]">
                  {CATEGORY_CONFIG[event.category].label}
                </span>
              </div>
              <h3 className="font-sans text-lg font-bold text-[#1A1A1A]">
                {event.title}
              </h3>
              <p className="text-xs font-sans text-[#6B6B6B] mt-1">
                {ERA_CONFIG[event.era as keyof typeof ERA_CONFIG]?.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
