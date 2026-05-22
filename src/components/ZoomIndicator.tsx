import { IconZoom } from "./icons/IconZoom";

interface ZoomIndicatorProps {
	zoomLevel: number;
	show: boolean;
}

export function ZoomIndicator({ zoomLevel, show }: ZoomIndicatorProps) {
	if (!show) return null;

	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
			<div className="zoom-indicator bg-[#C4342D] text-white px-6 py-4 rounded-2xl shadow-2xl">
				<div className="flex items-center gap-3">
					<IconZoom className="w-6 h-6" zoomIn={zoomLevel < 2} />
					<span className="text-lg font-sans font-bold">
						{Math.round(zoomLevel * 100)}%
					</span>
				</div>
			</div>
		</div>
	);
}
