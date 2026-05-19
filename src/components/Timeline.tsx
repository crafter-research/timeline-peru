import { useEffect, useRef, useState } from "react";

import { DataSet } from "vis-data";
import { Timeline as VisTimeline } from "vis-timeline/standalone";

import "vis-timeline/styles/vis-timeline-graph2d.min.css";

interface HistoricalEvent {
  id: string;
  date: Date;
  title: string;
  category: "politica" | "cultura" | "economia" | "conflictos";
  era: string;
  content: string;
  image?: string;
}

interface TimelineProps {
  events: HistoricalEvent[];
}

const CATEGORY_COLORS = {
  politica: "#3b82f6",
  cultura: "#a855f7",
  economia: "#22c55e",
  conflictos: "#ef4444",
};

const CATEGORY_LABELS = {
  politica: "Politica",
  cultura: "Cultura",
  economia: "Economia",
  conflictos: "Conflictos",
};

const GROUPS = Object.entries(CATEGORY_LABELS).map(([id, content]) => ({
  id,
  content,
  style: `color: ${CATEGORY_COLORS[id as keyof typeof CATEGORY_COLORS]}; font-weight: 600;`,
}));

export function Timeline({ events }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<VisTimeline | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(
    null,
  );
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(["politica", "cultura", "economia", "conflictos"]),
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const filteredEvents = events.filter((e) =>
      activeCategories.has(e.category),
    );

    const items = new DataSet(
      filteredEvents.map((event) => ({
        id: event.id,
        content: event.title,
        start: event.date,
        group: event.category,
        style: `background-color: ${CATEGORY_COLORS[event.category]}; color: white; border: none; border-radius: 4px; padding: 4px 8px;`,
      })),
    );

    const options = {
      groups: GROUPS.filter((g) => activeCategories.has(g.id)),
      zoomable: true,
      moveable: true,
      orientation: "top",
      showCurrentTime: false,
      stack: true,
      margin: { item: 10 },
      min: new Date(-15000, 0, 1),
      max: new Date(2030, 11, 31),
    };

    if (timelineRef.current) {
      timelineRef.current.destroy();
    }

    timelineRef.current = new VisTimeline(
      containerRef.current,
      items,
      options as never,
    );

    timelineRef.current.on("select", (properties: { items: string[] }) => {
      const eventId = properties.items[0];
      if (eventId) {
        const event = events.find((e) => e.id === eventId);
        setSelectedEvent(event || null);
      } else {
        setSelectedEvent(null);
      }
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
    };
  }, [events, activeCategories]);

  const toggleCategory = (category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Timeline Peru
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Historia del Peru desde los primeros pobladores hasta hoy
        </p>
      </header>

      <div className="flex gap-4 px-6 py-3 bg-stone-100 border-b border-stone-200">
        {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => toggleCategory(id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              activeCategories.has(id)
                ? "text-white"
                : "bg-stone-200 text-stone-500"
            }`}
            style={{
              backgroundColor: activeCategories.has(id)
                ? CATEGORY_COLORS[id as keyof typeof CATEGORY_COLORS]
                : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="flex-1 bg-white" />

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
                    style={{
                      backgroundColor: CATEGORY_COLORS[selectedEvent.category],
                    }}
                  >
                    {CATEGORY_LABELS[selectedEvent.category]}
                  </span>
                  <h2 className="text-xl font-serif font-bold">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {selectedEvent.date.toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="text-stone-400 hover:text-stone-600"
                  aria-label="Cerrar"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover rounded mt-4"
                />
              )}
              <div className="mt-4 text-stone-700 prose prose-stone prose-sm">
                <p>{selectedEvent.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
