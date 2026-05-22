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

interface TimelineDrawerProps {
  selectedEvent: HistoricalEvent | null;
  isClosing: boolean;
  onClose: () => void;
  drawerRef: RefObject<HTMLDivElement>;
  mobileDrawerRef: RefObject<HTMLDivElement>;
  formatFullDate: (date: Date, locale?: string) => string;
  ERA_CONFIG: Record<string, { label: string; range: string; color: string; borderColor: string; textColor: string; endYear: number }>;
  CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bgColor: string }>;
}

export function TimelineDrawer({
  selectedEvent,
  isClosing,
  onClose,
  drawerRef,
  mobileDrawerRef,
  formatFullDate,
  ERA_CONFIG,
  CATEGORY_CONFIG,
}: TimelineDrawerProps) {
  if (!selectedEvent) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 drawer-backdrop"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Drawer - Desktop */}
      <div
        ref={drawerRef}
        className={`hidden md:block fixed top-0 right-0 bottom-0 w-[560px] bg-white drawer-shadow-layered z-50 overflow-y-auto ${
          isClosing ? "drawer-slide-out" : "drawer-slide-in"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-white border-b border-[#D4D4D4] px-6 py-6 flex items-start justify-between gap-4 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-sans text-[#6B6B6B] uppercase tracking-wider mb-2">
              <span className="text-lg">
                {CATEGORY_CONFIG[selectedEvent.category].icon}
              </span>
              <span>{CATEGORY_CONFIG[selectedEvent.category].label}</span>
              <span>•</span>
              <span>
                {
                  ERA_CONFIG[selectedEvent.era as keyof typeof ERA_CONFIG]
                    ?.label
                }
              </span>
            </div>
            <h2
              id="drawer-title"
              className="font-sans text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight break-words"
            >
              {selectedEvent.title}
            </h2>
            <p className="text-lg font-sans text-[#C4342D] mt-2 font-medium">
              {formatFullDate(selectedEvent.date)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B6B6B] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F5F1E8] transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Drawer Content */}
        <div className="px-6 py-6">
          {selectedEvent.image && (
            <figure className="mb-6">
              <img
                src={selectedEvent.image}
                alt={`Imagen histórica: ${selectedEvent.title}`}
                className="w-full aspect-video object-cover rounded-lg"
                loading="eager"
              />
              <figcaption className="text-xs font-sans italic text-[#6B6B6B] mt-2 text-center">
                {selectedEvent.title}
              </figcaption>
            </figure>
          )}

          <div className="font-sans text-base text-[#1A1A1A] leading-relaxed space-y-4">
            <p>{selectedEvent.content}</p>
          </div>
        </div>
      </div>

      {/* Bottom Sheet - Mobile */}
      <div
        ref={mobileDrawerRef}
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto ${
          isClosing ? "bottom-sheet-slide-down" : "bottom-sheet-slide-up"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-drawer-title"
      >
        {/* Drag handle */}
        <div className="sticky top-0 bg-white border-b border-[#D4D4D4] px-4 py-3 z-10">
          <div className="w-12 h-1 bg-[#D4D4D4] rounded-full mx-auto mb-3" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-sans text-[#6B6B6B] uppercase tracking-wider mb-1">
                <span>{CATEGORY_CONFIG[selectedEvent.category].icon}</span>
                <span>
                  {CATEGORY_CONFIG[selectedEvent.category].label}
                </span>
              </div>
              <h2
                id="mobile-drawer-title"
                className="font-sans text-xl font-bold text-[#1A1A1A] leading-tight"
              >
                {selectedEvent.title}
              </h2>
              <p className="text-sm font-sans text-[#C4342D] mt-1 font-medium">
                {formatFullDate(selectedEvent.date)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#6B6B6B] rounded-lg flex-shrink-0"
              aria-label="Cerrar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        {/* Bottom Sheet Content */}
        <div className="px-4 py-4 pb-8">
          {selectedEvent.image && (
            <figure className="mb-4">
              <img
                src={selectedEvent.image}
                alt={`Imagen histórica: ${selectedEvent.title}`}
                className="w-full aspect-video object-cover rounded-lg"
                loading="eager"
              />
              <figcaption className="text-xs font-sans italic text-[#6B6B6B] mt-2 text-center">
                {selectedEvent.title}
              </figcaption>
            </figure>
          )}

          <div className="font-sans text-sm text-[#1A1A1A] leading-relaxed space-y-3">
            <p>{selectedEvent.content}</p>
          </div>
        </div>
      </div>
    </>
  );
}
