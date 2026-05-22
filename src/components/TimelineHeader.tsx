import type { ChangeEvent, RefObject } from "react";

interface TimelineHeaderProps {
  logoClickCount: number;
  onLogoClick: () => void;
  searchQuery: string;
  debouncedSearchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
  searchInputRef: RefObject<HTMLInputElement>;
  showShortcutsTooltip: boolean;
  onShortcutsTooltipShow: () => void;
  onShortcutsTooltipHide: () => void;
  selectedEra: string | null;
  eras: readonly string[];
  onEraSelect: (era: string | null) => void;
  onEraClick: (era: string) => void;
  onClearFilters: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  minZoom: number;
  maxZoom: number;
  filteredEventsCount: number;
  isTransitioning: boolean;
  ERA_CONFIG: Record<string, { label: string; range: string; color: string; borderColor: string; textColor: string; endYear: number }>;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function TimelineHeader({
  logoClickCount,
  onLogoClick,
  searchQuery,
  debouncedSearchQuery,
  onSearchChange,
  onSearchClear,
  searchInputRef,
  showShortcutsTooltip,
  onShortcutsTooltipShow,
  onShortcutsTooltipHide,
  selectedEra,
  eras,
  onEraSelect,
  onEraClick,
  onClearFilters,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  minZoom,
  maxZoom,
  filteredEventsCount,
  isTransitioning,
  ERA_CONFIG,
  theme,
  onThemeToggle,
}: TimelineHeaderProps) {
  return (
    <header className="border-b border-[var(--color-border-default)] px-8 py-6 sticky top-0 bg-[var(--color-bg-primary)] z-40 shadow-sm">
      <div className="max-w-full">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1
              onClick={onLogoClick}
              className="font-sans text-4xl font-bold tracking-tight text-[var(--color-text-primary)] uppercase cursor-pointer select-none hover:text-[var(--color-accent-red)] transition-colors"
              title="Haz clic 5 veces para un secreto..."
            >
              HISTORIA DEL PERÚ
            </h1>
            <p className="font-sans text-sm text-[var(--color-text-secondary)] mt-2">
              Línea de tiempo editorial
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={onSearchChange}
                className="w-80 px-4 py-2 text-sm border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:border-[var(--color-accent-red)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-red-light)] transition-colors"
                aria-label="Buscar eventos (Cmd/Ctrl+K para enfocar)"
              />
              {searchQuery !== debouncedSearchQuery && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-[#C4342D] animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={onSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B6B6B] hover:text-[#1A1A1A] rounded"
                  aria-label="Limpiar búsqueda"
                >
                  <svg
                    className="w-4 h-4"
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
              )}
            </div>

            {/* Theme toggle button */}
            <button
              type="button"
              onClick={onThemeToggle}
              className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] transition-colors"
              aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Keyboard shortcuts button */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={onShortcutsTooltipShow}
                onMouseLeave={onShortcutsTooltipHide}
                onFocus={onShortcutsTooltipShow}
                onBlur={onShortcutsTooltipHide}
                className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] transition-colors"
                aria-label="Mostrar atajos de teclado"
              >
                <span className="text-sm font-bold">?</span>
              </button>

              {/* Keyboard shortcuts tooltip */}
              {showShortcutsTooltip && (
                <div
                  className="absolute top-full right-0 mt-2 w-80 bg-white border-2 border-[#C4342D] rounded-lg shadow-2xl p-4 z-50"
                  role="tooltip"
                >
                  <h3 className="text-sm font-sans font-bold text-[#1A1A1A] mb-3">
                    Atajos de teclado
                  </h3>
                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6B6B]">Buscar eventos</span>
                      <kbd className="px-2 py-1 bg-[#F5F1E8] border border-[#D4D4D4] rounded text-[#1A1A1A] font-mono">
                        Cmd/Ctrl+K
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6B6B]">Restablecer zoom</span>
                      <kbd className="px-2 py-1 bg-[#F5F1E8] border border-[#D4D4D4] rounded text-[#1A1A1A] font-mono">
                        Cmd/Ctrl+0
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6B6B]">Navegar entre eras</span>
                      <kbd className="px-2 py-1 bg-[#F5F1E8] border border-[#D4D4D4] rounded text-[#1A1A1A] font-mono">
                        ← →
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6B6B]">Ir al inicio</span>
                      <kbd className="px-2 py-1 bg-[#F5F1E8] border border-[#D4D4D4] rounded text-[#1A1A1A] font-mono">
                        Home
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6B6B]">Ir al final</span>
                      <kbd className="px-2 py-1 bg-[#F5F1E8] border border-[#D4D4D4] rounded text-[#1A1A1A] font-mono">
                        End
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6B6B]">Cerrar panel</span>
                      <kbd className="px-2 py-1 bg-[#F5F1E8] border border-[#D4D4D4] rounded text-[#1A1A1A] font-mono">
                        Esc
                      </kbd>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Era Filters & Zoom Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-3">
            {eras.map((era) => (
              <button
                key={era}
                type="button"
                onClick={() => onEraClick(era)}
                className={`px-4 py-2 text-sm font-sans rounded-full button-enhanced ${
                  selectedEra === era
                    ? "bg-[#C4342D] text-white shadow-lg"
                    : "bg-white text-[#6B6B6B] border border-[#D4D4D4]"
                }`}
                aria-pressed={selectedEra === era}
                aria-label={`${ERA_CONFIG[era].label} (Navegar con flechas ← →)`}
              >
                {ERA_CONFIG[era].label}
              </button>
            ))}
            {selectedEra && (
              <button
                type="button"
                onClick={onClearFilters}
                className="px-4 py-2 text-sm font-sans text-[#C4342D] hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-[#6B6B6B] font-medium">
              ZOOM
            </span>
            <div className="flex gap-1 border border-[#D4D4D4] rounded-lg p-1 bg-white">
              <button
                type="button"
                onClick={onZoomOut}
                className="px-3 py-1 text-sm font-sans text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1E8] rounded transition-colors"
                aria-label="Reducir zoom"
                disabled={zoomLevel <= minZoom}
              >
                -
              </button>
              <span className="px-3 py-1 text-sm font-sans text-[#1A1A1A] font-medium min-w-[4rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={onZoomIn}
                className="px-3 py-1 text-sm font-sans text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1E8] rounded transition-colors"
                aria-label="Aumentar zoom"
                disabled={zoomLevel >= maxZoom}
              >
                +
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={onZoomReset}
                  className="px-3 py-1 text-xs font-sans text-[#C4342D] hover:bg-[#FEF2F2] rounded transition-colors"
                  aria-label="Restablecer zoom a 100% (Cmd/Ctrl+0)"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="mt-2 text-sm text-[#6B6B6B]">
            {filteredEventsCount === 0
              ? "No se encontraron eventos"
              : `${filteredEventsCount} evento${filteredEventsCount !== 1 ? "s" : ""} encontrado${filteredEventsCount !== 1 ? "s" : ""}`}
          </div>
        )}
      </div>
    </header>
  );
}
