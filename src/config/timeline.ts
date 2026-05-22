export const ERA_CONFIG = {
  preinca: {
    label: "Pre-Inca",
    range: "15000 a.C. - 1438",
    color: "#F5E6D3",
    borderColor: "#D4A574",
    textColor: "#8B7355",
    endYear: 1438
  },
  inca: {
    label: "Inca",
    range: "1438 - 1532",
    color: "#FFE8C5",
    borderColor: "#E6B76B",
    textColor: "#A67C52",
    endYear: 1532
  },
  conquista: {
    label: "Conquista",
    range: "1532 - 1572",
    color: "#FFD5CC",
    borderColor: "#E68A7A",
    textColor: "#A85A4A",
    endYear: 1572
  },
  colonia: {
    label: "Colonia",
    range: "1572 - 1821",
    color: "#E3E3ED",
    borderColor: "#9999B8",
    textColor: "#6B6B8B",
    endYear: 1821
  },
  republica: {
    label: "República",
    range: "1821 - 1968",
    color: "#C9E4F0",
    borderColor: "#6BB8DC",
    textColor: "#4A8BA8",
    endYear: 1968
  },
  contemporaneo: {
    label: "Contemporáneo",
    range: "1968 - presente",
    color: "#E8E2D5",
    borderColor: "#A8987A",
    textColor: "#7A6B55",
    endYear: 2030
  },
} as const;

export const CATEGORY_CONFIG = {
  politica: { label: "POLÍTICA", icon: "⚖️", color: "#3B82F6", bgColor: "#EFF6FF" },
  cultura: { label: "CULTURA", icon: "🎭", color: "#8B5CF6", bgColor: "#F5F3FF" },
  economia: { label: "ECONOMÍA", icon: "📊", color: "#10B981", bgColor: "#ECFDF5" },
  conflictos: { label: "CONFLICTOS", icon: "⚔️", color: "#C4342D", bgColor: "#FEF2F2" },
} as const;

export const CATEGORY_ORDER = ["politica", "cultura", "economia", "conflictos"] as const;

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const DEFAULT_ZOOM = 1.5;
