import { useEffect, type RefObject } from "react";
import type { ERA_CONFIG } from "../types/timeline";

interface UseKeyboardShortcutsProps {
	selectedEvent: unknown;
	onCloseDrawer: () => void;
	searchInputRef: RefObject<HTMLInputElement>;
	onResetZoom: () => void;
	selectedEra: string | null;
	eras: (keyof typeof ERA_CONFIG)[];
	onEraChange: (era: keyof typeof ERA_CONFIG) => void;
	onScrollToEra: (era: keyof typeof ERA_CONFIG) => void;
	onScrollToPosition: (position: number) => void;
}

export function useKeyboardShortcuts({
	selectedEvent,
	onCloseDrawer,
	searchInputRef,
	onResetZoom,
	selectedEra,
	eras,
	onEraChange,
	onScrollToEra,
	onScrollToPosition,
}: UseKeyboardShortcutsProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Escape key - close drawer
			if (e.key === "Escape" && selectedEvent) {
				onCloseDrawer();
				return;
			}

			// Ignore shortcuts when typing in inputs
			const target = e.target as HTMLElement;
			const isInputFocused =
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable;

			// Cmd/Ctrl+K - Focus search input
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
				return;
			}

			// Cmd/Ctrl+0 - Reset zoom to 100%
			if ((e.metaKey || e.ctrlKey) && e.key === "0") {
				e.preventDefault();
				onResetZoom();
				return;
			}

			// Skip navigation shortcuts if input is focused
			if (isInputFocused) return;

			// Left/Right arrows - Navigate between eras
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				e.preventDefault();
				const currentIndex = selectedEra
					? eras.indexOf(selectedEra as keyof typeof ERA_CONFIG)
					: -1;

				if (e.key === "ArrowLeft") {
					const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
					const prevEra = eras[prevIndex];
					onEraChange(prevEra);
					onScrollToEra(prevEra);
				} else {
					const nextIndex =
						currentIndex < eras.length - 1 ? currentIndex + 1 : eras.length - 1;
					const nextEra = eras[nextIndex];
					onEraChange(nextEra);
					onScrollToEra(nextEra);
				}
				return;
			}

			// Home - Jump to start of timeline
			if (e.key === "Home") {
				e.preventDefault();
				onScrollToPosition(0);
				return;
			}

			// End - Jump to end of timeline
			if (e.key === "End") {
				e.preventDefault();
				onScrollToPosition(1);
				return;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [
		selectedEvent,
		onCloseDrawer,
		searchInputRef,
		onResetZoom,
		selectedEra,
		eras,
		onEraChange,
		onScrollToEra,
		onScrollToPosition,
	]);
}
