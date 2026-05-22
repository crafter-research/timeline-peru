interface IconZoomProps {
	className?: string;
	zoomIn?: boolean;
}

export function IconZoom({ className = "w-6 h-6", zoomIn = true }: IconZoomProps) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			role="img"
			aria-label={zoomIn ? "Ampliar zoom" : "Reducir zoom"}
		>
			<title>{zoomIn ? "Ampliar zoom" : "Reducir zoom"}</title>
			{zoomIn ? (
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
				/>
			) : (
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
				/>
			)}
		</svg>
	);
}
