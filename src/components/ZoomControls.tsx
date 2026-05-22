interface ZoomControlsProps {
	zoomLevel: number;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onReset: () => void;
	minZoom: number;
	maxZoom: number;
}

export function ZoomControls({
	zoomLevel,
	onZoomIn,
	onZoomOut,
	onReset,
	minZoom,
	maxZoom,
}: ZoomControlsProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs font-sans text-[#6B6B6B] font-medium">
				ZOOM
			</span>
			<div className="flex gap-1 border border-[#D4D4D4] rounded-lg p-1 bg-white shadow-sm">
				<button
					type="button"
					onClick={onZoomOut}
					className="px-3 py-1 text-sm font-sans text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1E8] rounded transition-all duration-200 ease-out hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
					aria-label="Reducir zoom"
					disabled={zoomLevel <= minZoom}
				>
					-
				</button>
				<span className="px-3 py-1 text-sm font-sans text-[#1A1A1A] font-medium min-w-[4rem] text-center transition-all duration-300">
					{Math.round(zoomLevel * 100)}%
				</span>
				<button
					type="button"
					onClick={onZoomIn}
					className="px-3 py-1 text-sm font-sans text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F1E8] rounded transition-all duration-200 ease-out hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
					aria-label="Aumentar zoom"
					disabled={zoomLevel >= maxZoom}
				>
					+
				</button>
				{zoomLevel !== 1 && (
					<button
						type="button"
						onClick={onReset}
						className="px-3 py-1 text-xs font-sans text-[#C4342D] hover:bg-[#FEF2F2] rounded transition-all duration-200 ease-out hover:scale-105 active:scale-95 hover:text-[#A42D26]"
						aria-label="Restablecer zoom a 100% (Cmd/Ctrl+0)"
					>
						Reset
					</button>
				)}
			</div>
		</div>
	);
}
