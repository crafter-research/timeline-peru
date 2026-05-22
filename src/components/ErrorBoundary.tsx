import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Timeline Error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-8">
					<div className="max-w-2xl w-full bg-white border-2 border-[#C4342D] rounded-lg shadow-2xl p-8">
						<h1 className="text-3xl font-bold text-[#C4342D] mb-4">
							Error en la Línea de Tiempo
						</h1>
						<p className="text-[#1A1A1A] mb-4">
							Lo sentimos, ha ocurrido un error al cargar la línea de tiempo
							histórica.
						</p>
						{this.state.error && (
							<details className="mt-4 p-4 bg-[#FEF2F2] border border-[#C4342D] rounded">
								<summary className="cursor-pointer font-bold text-[#C4342D] mb-2">
									Detalles del error
								</summary>
								<pre className="text-sm text-[#6B6B6B] overflow-auto">
									{this.state.error.message}
								</pre>
							</details>
						)}
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="mt-6 px-6 py-3 bg-[#C4342D] text-white rounded-lg hover:bg-[#A42D26] transition-colors font-bold"
						>
							Recargar Página
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
