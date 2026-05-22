export function TimelineSkeleton() {
	return (
		<div>
			{/* Header skeleton */}
			<div className="border-b border-[#D4D4D4] px-8 py-6 sticky top-0 bg-[#F5F1E8] z-40">
				<div className="h-10 bg-[#D4D4D4] rounded w-80 mb-3 skeleton-item" />
				<div className="flex gap-2">
					{[1, 2, 3, 4, 5].map((i) => (
						<div
							key={i}
							className="h-8 w-24 bg-[#D4D4D4] rounded-full skeleton-item"
						/>
					))}
				</div>
			</div>
			{/* Timeline skeleton */}
			<div className="px-8 py-12">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-32 bg-[#D4D4D4] rounded mb-4 skeleton-item" />
				))}
			</div>
		</div>
	);
}
