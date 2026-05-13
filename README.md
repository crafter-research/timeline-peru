# Timeline Peru

Linea de tiempo interactiva de la historia del Peru.

## Stack

- **Framework:** Astro 6
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Linting:** Biome
- **Timeline:** Vis.js Timeline

## Development

```bash
bun install
bun dev
```

## Project Structure

```
/
├── src/
│   ├── components/     # React components (timeline, filters)
│   ├── content/
│   │   └── events/     # Markdown files for historical events
│   ├── layouts/        # Astro layouts
│   └── pages/          # Astro pages
├── public/
│   └── images/         # Event images (optional)
└── package.json
```

## Adding Events

Create a new `.md` file in `src/content/events/`:

```md
---
date: 1532-11-16
title: Captura de Atahualpa
category: politica
era: colonia
image: /images/atahualpa.jpg  # optional
---

Descripcion del evento...
```

### Categories

- `politica` - Political events
- `cultura` - Cultural events
- `economia` - Economic events
- `conflictos` - Conflicts and wars

### Eras

- `preinca` - Pre-Inca civilizations
- `inca` - Inca Empire
- `colonia` - Colonial period
- `republica` - Republic
- `contemporaneo` - Contemporary

## Contributing

PRs are welcome. Please follow the event format above and include sources for historical accuracy.

## License

MIT
