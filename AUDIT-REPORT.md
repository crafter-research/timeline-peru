# Reporte de Auditoría Histórica - Timeline Peru
**Fecha**: 2026-05-13
**Auditor**: Sage (Profesor de Historia del Perú)
**Eventos auditados**: 18

---

## Resumen Ejecutivo

Se revisaron todos los eventos existentes en el proyecto timeline-peru. La mayoría de los eventos están correctamente categorizados, fechados y con contenido neutral. Se corrigieron 2 problemas críticos relacionados con precisión de datos y neutralidad en eventos contemporáneos sensibles.

**Estado general**: ✅ APROBADO (con correcciones aplicadas)

---

## Correcciones Aplicadas

### 1. Cifra de víctimas del conflicto armado interno (CRITICAL)
**Archivo**: `1980-sendero-luminoso.md`
**Cambio**:
- ❌ ANTES: "casi 70,000 víctimas"
- ✅ DESPUÉS: "69,280 víctimas fatales y desaparecidos según el Informe Final de la Comisión de la Verdad y Reconciliación (CVR, 2003)"

**Razón**: La precisión en cifras de víctimas es fundamental para eventos sensibles. La CVR es la fuente oficial más autorizada.

### 2. Contexto en cifras de apoyo político (MEDIUM)
**Archivo**: `1992-autogolpe-fujimori.md`
**Cambio**:
- ❌ ANTES: "recibe inicialmente apoyo del 80% de la población"
- ✅ DESPUÉS: "recibió según encuestas de la época apoyo del 80% de la población"

**Razón**: Contextualizar las encuestas evita presentar como hecho objetivo lo que fueron mediciones de la época, posiblemente influenciadas por el contexto autoritario.

---

## Eventos que Requieren Especial Cuidado

### Eventos Contemporáneos Sensibles
Los siguientes eventos deben ser revisados con especial atención si se agregan más detalles:

1. **1980-sendero-luminoso.md**
   - Usar siempre cifras oficiales de la CVR
   - Evitar términos que puedan interpretarse como justificación o minimización del conflicto
   - Mantener neutralidad: ni glorificar acciones estatales ni justificar terrorismo

2. **1992-autogolpe-fujimori.md**
   - Eventos post-2000 relacionados con Fujimori son altamente polarizantes
   - Usar lenguaje descriptivo, no valorativo
   - Citar fuentes cuando se mencionan cifras de apoyo popular

### Eventos de la Guerra del Pacífico
Los 3 eventos relacionados (1879-1879-1880) están bien redactados con tono heroico apropiado para figuras nacionales como Grau y Bolognesi, sin caer en chauvinismo.

---

## Análisis por Era

### Era Preinca (6 eventos)
✅ Todos correctos. Fechas aproximadas bien manejadas con formato `-YYYY-01-01`.

### Era Inca (2 eventos)
✅ Correctos. Categorización política/conflictos apropiada.

### Era Conquista (2 eventos)
✅ Correctos. Fechas exactas cuando están disponibles.

### Era Colonia (1 evento)
✅ Correcto. Rebelión de Túpac Amaru II bien contextualizada.

### Era República (5 eventos)
✅ Correctos. Guerra del Pacífico con fuentes apropiadas.

### Era Contemporánea (2 eventos)
⚠️ Requieren máxima precisión. Correcciones aplicadas.

---

## Análisis por Categoría

| Categoría | Total | Estado |
|-----------|-------|--------|
| cultura | 7 | ✅ Todos correctos |
| politica | 5 | ✅ Todos correctos |
| conflictos | 6 | ⚠️ 1 corregido (cifras CVR) |
| economia | 0 | - |

**Observación**: No hay eventos de categoría "economía". Considerar agregar:
- Reforma Agraria de 1969
- Tratados comerciales importantes
- Crisis económicas significativas (hiperinflación 1988-1990)

---

## Recomendaciones para Nuevos Eventos

### Eventos Post-2000 (Especial Cuidado)
Si se agregan eventos de gobiernos recientes, seguir estas reglas:

**Gobiernos Toledo, García, Humala, PPK, Vizcarra**:
- Usar lenguaje descriptivo, no valorativo
- Citar fuentes oficiales para datos económicos o sociales
- Evitar adjetivos como "corrupto", "exitoso", "desastroso" sin contexto

**Gobiernos Castillo y Boluarte (2021-presente)**:
- ⛔ ESPERAR AL MENOS 5 AÑOS antes de incluir
- Eventos muy recientes carecen de perspectiva histórica
- Alto riesgo de sesgo político

**Excepción**: Eventos objetivamente verificables (terremotos, descubrimientos arqueológicos, tratados internacionales) pueden incluirse sin problema.

### Fuentes Recomendadas
Por orden de prioridad:

1. **Académicas**: Papers, libros de historia revisados por pares
2. **Oficiales**: CVR, Ministerio de Cultura, Biblioteca Nacional
3. **Institucionales**: UNESCO, OEA, instituciones reconocidas
4. **Wikipedia**: Solo como referencia inicial, verificar con fuentes primarias

### Plantilla para Eventos Sensibles

```markdown
---
date: YYYY-MM-DD
title: [Título neutral y descriptivo]
category: [politica|cultura|economia|conflictos]
era: [era correspondiente]
---

[Descripción objetiva del evento sin adjetivos valorativos]

[Si hay cifras, incluir fuente oficial en el texto]

Fuente: [Fuente oficial o académica, no Wikipedia para eventos sensibles]
```

---

## Anti-Patrones Históricos a Evitar

### 🚫 Nacionalismo Excesivo
❌ "El heroico pueblo peruano derrotó al invasor chileno"
✅ "Las fuerzas peruanas defendieron el territorio nacional"

### 🚫 Presentismo
❌ "Pachacútec fue el mejor líder político de su época"
✅ "Pachacútec expandió el Tahuantinsuyo desde Colombia hasta Chile"

### 🚫 Cifras Sin Fuente
❌ "Miles de víctimas"
✅ "69,280 víctimas según CVR (2003)"

### 🚫 Lenguaje Valorativo en Eventos Contemporáneos
❌ "El corrupto gobierno de..."
✅ "El gobierno de [nombre], investigado posteriormente por..."

### 🚫 Omisión de Contexto
❌ "Recibió 80% de aprobación"
✅ "Según encuestas de la época, recibió 80% de aprobación"

---

## Próximos Pasos

1. ✅ Auditoría inicial completa
2. ✅ Correcciones aplicadas a eventos sensibles
3. ⏳ Monitorear nuevos eventos agregados
4. ⏳ Crear eventos de categoría "economía"
5. ⏳ Verificar fuentes de eventos que citan Wikipedia

---

## Contacto para Dudas Históricas

Si tienes dudas sobre:
- **Fechas exactas**: Consultar Biblioteca Nacional del Perú
- **Conflicto armado interno**: CVR - Informe Final (2003)
- **Guerra del Pacífico**: Academia Nacional de Historia Militar
- **Culturas preincaicas**: Ministerio de Cultura - Dirección de Arqueología

---

**Veredicto Final**: ✅ **APROBADO** - Sistema de eventos está bien diseñado. Correcciones menores aplicadas. Listo para agregar más eventos siguiendo las guías establecidas.
