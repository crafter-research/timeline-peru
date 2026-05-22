interface CategoryLegendProps {
  CATEGORY_ORDER: readonly string[];
  CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bgColor: string }>;
}

export function CategoryLegend({ CATEGORY_ORDER, CATEGORY_CONFIG }: CategoryLegendProps) {
  return (
    <div className="border-b border-[#D4D4D4] px-8 py-3 bg-white sticky top-[7.5rem] z-30">
      <div className="flex items-center gap-6">
        <span className="text-xs font-sans text-[#6B6B6B] font-bold uppercase tracking-wider">
          Categorías
        </span>
        <div className="flex flex-wrap gap-4">
          {CATEGORY_ORDER.map((category) => {
            const config = CATEGORY_CONFIG[category];
            return (
              <div
                key={category}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{
                    backgroundColor: config.color,
                    borderColor: "white",
                  }}
                  aria-hidden="true"
                />
                <span className="text-xs">{config.icon}</span>
                <span className="text-xs font-sans text-[#1A1A1A] font-medium">
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
