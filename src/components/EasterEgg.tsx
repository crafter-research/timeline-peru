interface EasterEggProps {
  show: boolean;
  onClose: () => void;
}

export function EasterEgg({ show, onClose }: EasterEggProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="easter-egg-reveal bg-white border-4 border-[#C4342D] rounded-xl px-8 py-6 shadow-2xl pointer-events-auto">
        <div className="text-6xl mb-4 text-center">🇵🇪</div>
        <div className="text-2xl font-bold text-[#C4342D] text-center">
          ¡Viva el Perú!
        </div>
        <div className="text-sm text-[#6B6B6B] text-center mt-2">
          Has descubierto el secreto de la línea de tiempo
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-[#C4342D] text-white rounded-lg hover:bg-[#A42D26] transition-colors"
        >
          Continuar explorando
        </button>
      </div>
    </div>
  );
}
