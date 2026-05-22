# Checklist de Acentuación - Timeline Peru

Referencia rápida para correcciones ortográficas frecuentes.

---

## PALABRAS CRÍTICAS (MÁS FRECUENTES)

### Términos históricos y académicos
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| Peru | Perú |
| politica | política |
| economica | económica |
| historica | histórica |
| geografica | geográfica |
| arqueologica | arqueológica |
| iconografia | iconografía |
| ceramica | cerámica |
| metalurgia | metalúrgica |

### Adjetivos de magnitud
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| maxima | máxima |
| minima | mínima |
| ultima | última |
| unica | única |
| rapida | rápida |
| proxima | próxima |
| publica | pública |

### Términos militares
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| ejercito | ejército |
| heroe | héroe |
| exito | éxito |
| tactica | táctica |
| estrategica | estratégica |
| belica | bélica |

### Verbos comunes (pasado)
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| construyo | construyó |
| inicio | inició |
| destruyo | destruyó |
| organizo | organizó |
| expandio | expandió |
| conquisto | conquistó |

### Geografía
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| Cusco o Cuzco | Ambos aceptables (preferir Cusco) |
| Ancash | Áncash |
| Huanuco | Huánuco |
| Cajamarca | ✅ (sin acento) |
| Lambayeque | ✅ (sin acento) |

---

## NOMBRES PROPIOS INCAS

| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| Pachacutec | Pachacútec |
| Tupac | Túpac |
| Capac | Cápac |
| Huascar | Huáscar |
| Atahualpa | ✅ (sin acento) |
| Huayna Capac | Huayna Cápac |
| Manco Capac | Manco Cápac |
| Sinchi Roca | ✅ (sin acentos) |

---

## NOMBRES ESPAÑOLES/COLONIALES

| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| Martin | Martín |
| Simon | Simón |
| Andres | Andrés |
| Jose | José |
| Ramon | Ramón |
| Gonzalez | González |
| Hernandez | Hernández |
| Rodriguez | Rodríguez |
| Sanchez | Sánchez |
| Perez | Pérez |

---

## TÉRMINOS QUECHUAS Y ANDINOS

| Término | Uso correcto |
|---------|-------------|
| Qhapaq Ñan | Con Ñ (no Qhapaq Nan) |
| Tahuantinsuyo | Sin acento |
| quipu / quipus | Plural español: quipus |
| ayllu / ayllus | Plural español: ayllus |
| huaca / huacas | Sin acento |
| tambo / tambos | Sin acento |
| mitayo / mitayos | Sin acento |
| curaca | Sin acento |

---

## TÉRMINOS TÉCNICOS

### Arqueología y arte
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| litica | lítica |
| pictorica | pictórica |
| escenica | escénica |
| simetrica | simétrica |
| geometrica | geométrica |
| antropomorfa | antropomórfica |
| zooforma | zoomorfa |

### Arquitectura
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| piramide | pirámide |
| monolitico | monolítico |
| hidraulica | hidráulica |
| sismico | sísmico |
| ciclópeo | ciclópeo |

---

## DIFERENCIAS SUTILES

### Más vs Mas
- **más** = cantidad (Most/more)
  - "más grande"
  - "más de 100"
- **mas** = pero (but) - arcaico, evitar

### Sólo vs Solo
- **sólo** = solamente (RAE 2010: ya no obligatorio)
- **solo** = sin compañía
- Recomendación: usar "solamente" si hay ambigüedad

### Aún vs Aun
- **aún** = todavía (still/yet)
  - "aún no termina"
- **aun** = incluso (even)
  - "aun los expertos"

### Dé vs De
- **dé** = verbo dar
  - "que él dé"
- **de** = preposición
  - "de Lima"

### Sé vs Se
- **sé** = verbo saber o ser
  - "yo sé"
  - "sé honesto"
- **se** = pronombre
  - "se fue"

---

## NÚMEROS Y FECHAS

### Siglos
| ❌ Incorrecto | ✅ Correcto |
|--------------|------------|
| siglo 16 | siglo XVI |
| S. 18 | s. XVIII |
| siglo dieciseis | siglo XVI |

### Fechas antes de Cristo
| Formato archivo | En texto |
|----------------|----------|
| -0800 | 800 a.C. |
| -3200 | 3200 a.C. |

---

## BÚSQUEDA RÁPIDA

### Patrones regex útiles
```regex
[Pp]eru(?![áñ])           # Peru sin acento
[Mm]axima                 # maxima sin acento
[Ee]jercito               # ejercito sin acento
iconografia               # iconografia sin acento
ceramica                  # ceramica sin acento
[Pp]achacutec             # Pachacutec sin acento
[Tt]upac                  # Tupac sin acento
[Cc]apac                  # Capac sin acento (en nombres)
```

---

## VERIFICACIÓN FINAL

Antes de guardar un archivo, verificar:
- [ ] "Peru" → "Perú"
- [ ] "ejercito" → "ejército"
- [ ] "politica/economica/maxima" → con tilde
- [ ] Nombres incas con Cápac/Túpac
- [ ] "iconografia/ceramica" → con tilde
- [ ] Verbos pasado: "construyo" → "construyó"
- [ ] Apellidos españoles: González, Hernández, etc.

---

**Uso**: Consultar este checklist durante la edición de archivos .md
**Actualización**: Agregar palabras frecuentes según se identifiquen
