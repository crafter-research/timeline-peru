import { type RefObject } from "react";
import { IconClose } from "./icons/IconClose";
import { IconSpinner } from "./icons/IconSpinner";

interface SearchBarProps {
	searchQuery: string;
	debouncedSearchQuery: string;
	onSearchChange: (value: string) => void;
	onClear: () => void;
	inputRef: RefObject<HTMLInputElement>;
}

export function SearchBar({
	searchQuery,
	debouncedSearchQuery,
	onSearchChange,
	onClear,
	inputRef,
}: SearchBarProps) {
	const isSearching = searchQuery !== debouncedSearchQuery;

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="search"
				placeholder="Buscar eventos..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="w-80 px-4 py-2 text-sm border border-[#D4D4D4] bg-white rounded-lg focus:border-[#C4342D] focus:outline-none focus:ring-2 focus:ring-[#C4342D]/20 transition-all duration-300 ease-out focus:shadow-lg hover:border-[#C4342D]/50"
				aria-label="Buscar eventos (Cmd/Ctrl+K para enfocar)"
			/>
			{isSearching && (
				<div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
					<IconSpinner className="w-4 h-4 text-[#C4342D] animate-spin" />
				</div>
			)}
			{searchQuery && (
				<button
					type="button"
					onClick={onClear}
					className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B6B6B] hover:text-[#1A1A1A] rounded"
					aria-label="Limpiar búsqueda"
				>
					<IconClose className="w-4 h-4" />
				</button>
			)}
		</div>
	);
}
