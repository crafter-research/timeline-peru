import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollTracking() {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [showScrollHint, setShowScrollHint] = useState(true);

	// Handle scroll tracking with RAF throttling
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		let rafId: number | null = null;

		const handleScroll = () => {
			if (rafId !== null) return;

			rafId = requestAnimationFrame(() => {
				const { scrollLeft, scrollWidth, clientWidth } = container;
				const maxScroll = scrollWidth - clientWidth;
				const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
				setScrollProgress(progress);

				// Hide scroll hint after first scroll
				if (scrollLeft > 10 && showScrollHint) {
					setShowScrollHint(false);
				}

				rafId = null;
			});
		};

		handleScroll();
		container.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			container.removeEventListener("scroll", handleScroll);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [showScrollHint]);

	// Scroll to position
	const scrollToPosition = useCallback((percentage: number) => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const { scrollWidth, clientWidth } = container;
		const maxScroll = scrollWidth - clientWidth;
		const targetScroll = maxScroll * percentage;

		container.scrollTo({
			left: targetScroll,
			behavior: "smooth",
		});
	}, []);

	return {
		scrollContainerRef,
		scrollProgress,
		showScrollHint,
		scrollToPosition,
	};
}
