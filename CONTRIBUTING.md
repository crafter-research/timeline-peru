# Contributing to Timeline Peru

Gracias por tu interes en contribuir. Este proyecto busca documentar la historia del Peru de forma precisa y accesible.

## Como agregar un evento

1. Crea un archivo `.md` en `src/content/events/`
2. Usa el formato: `YYYY-nombre-del-evento.md` (ej: `1821-independencia-peru.md`)
3. Incluye el frontmatter requerido:

```md
---
date: 1821-07-28
title: Declaracion de Independencia del Peru
category: politica
era: republica
image: /images/independencia.jpg  # opcional
---

Jose de San Martin proclama la independencia del Peru en Lima.
Fuente: [Wikipedia](https://es.wikipedia.org/wiki/Independencia_del_Peru)
```

## Categorias

- `politica` - Eventos politicos, gobiernos, tratados
- `cultura` - Arte, literatura, tradiciones, educacion
- `economia` - Comercio, industria, recursos
- `conflictos` - Guerras, revoluciones, conflictos internos

## Eras

- `preinca` - Antes del Imperio Inca (~15000 a.C. - 1438)
- `inca` - Imperio Inca (1438 - 1532)
- `colonia` - Periodo colonial espanol (1532 - 1821)
- `republica` - Republica del Peru (1821 - 1968)
- `contemporaneo` - Era contemporanea (1968 - presente)

## Requisitos

- **Precision historica**: Incluye fuentes confiables
- **Fechas verificables**: Usa fechas exactas cuando sea posible
- **Descripcion concisa**: 1-3 oraciones que expliquen el evento
- **Sin sesgo politico**: Mantén un tono neutral y factual

## Proceso de revision

1. Abre un PR con tu evento
2. Un maintainer revisara la precision historica
3. Si hay correcciones, se solicitaran cambios
4. Una vez aprobado, se mergea

## Imagenes

Las imagenes son opcionales. Si incluyes una:
- Debe estar en dominio publico o tener licencia compatible
- Coloca el archivo en `public/images/`
- Usa formato JPG o PNG
- Tamano recomendado: 800x600px
