# Fuentes y decisiones editoriales

Revisión: 3 de noviembre de 2026.

## Separación de proyectos

- Destino: `irregular-iron`, base Astro mínima existente.
- Referencia técnica: `subsequent-spiral`, consultada en modo de lectura. No se trasladaron sus componentes, datos personales, CV, textos ni dependencias de interfaz.
- Fuentes originales: carpeta `marianaCV` proporcionada por el usuario. No se modificaron.

Al inicio se registraron en memoria huellas SHA-256 de 63 archivos de la referencia y 4 fuentes. La comparación final y su resultado se documentan en `verification.md`; las rutas y datos personales del propietario de la referencia no se guardan en este proyecto.

## CV

`CV Mariana Alejo.pdf`, 193493 bytes, dos páginas: español e inglés. Sus metadatos indican creación y modificación el 20 de octubre de 2026. Es el único CV proporcionado. No hay evidencia de cuál de las dos páginas se actualizó después.

La copia descargable es idéntica al original; su huella e identidad/contacto verificados están en `resume-source.json`. Se utiliza este PDF suministrado, sin afirmar una confirmación posterior de edición ni corregir su contenido silenciosamente.

## Diferencias resueltas de forma conservadora

| Fuente | Diferencia | Decisión |
| --- | --- | --- |
| Perfil inglés | Afirma más de tres años de experiencia | No publicar años acumulados; no sumar periodos superpuestos. |
| Kaptan, inglés | Reducción del tiempo de contratación y mejora de candidatos | Omitir esos resultados hasta confirmación. |
| Kaptan, inglés | Implementación de Buk | Describir administración de registros y bases de datos en Buk, respaldada por español. |
| Colmena, inglés | Gestión de áreas de capacitación y desarrollo | Mantener liderazgo de procesos y apoyo a capacitación; no atribuir dirección de departamentos. |
| Información adicional, español | Incluye 9 Box, ausente en inglés | Incluir como metodología respaldada por la fuente española. |
| Licenciatura, inglés | Traduce el grado como B.A. | Utilizar Degree in Psychology, sin asignar un tipo de grado extranjero. |
| DC-3, inglés | Utiliza certification | Presentar DC-3 training record, sin ampliar acreditación. |
| Taller de duelo, inglés | Añade Therapeutic | Conservar Grief Management como workshop; no presentar servicios clínicos. |
| Fechas inglesas | Usa Actual y orden poco natural | Mostrar Present y formato localizado; conservar precisión original. |

## Pendientes

- Confirmación de resultados de contratación y alcance de implementación de Buk.
- Confirmación de que el PDF proporcionado es la edición que se desea mantener como descarga.
- Instituciones emisoras, fechas y duración de formación complementaria, si se desea publicarlas.
- Escala del promedio 9.07; no se añadió /10.
- Dominio, fotografía y perfiles profesionales, si se proporcionan. No se inventaron.
- Imagen social específica: no se configuró `og:image` con un recurso inadecuado.

Los periodos de Kaptan y Colmena se mantienen superpuestos. Colmena comienza en 2025 sin mes. La práctica y la licenciatura conservan 2019–2022 sin interpretar la modalidad de trabajo. Inglés B2 se presenta como nivel declarado en el CV y no como certificación.

## Referencias visuales

Las dos referencias de páginas inspiran la jerarquía editorial, el equilibrio entre bloques y las superficies claras. No se reutilizan sus fotografías, logotipos o contenido. La tercera referencia define material y paleta; no se utiliza la imagen con muestras como fondo.

## Textura generada

Herramienta: `imagegen` integrada, siguiendo la habilidad imagegen. Nueva imagen original, no edición de las referencias. El original se conservó en su destino de generación y se copió al proyecto.

- Original local: `src/assets/background/pearl-original.png`.
- Fondo escritorio: `public/images/pearl-desktop.webp` (1536 × 1024, 69328 bytes).
- Fondo móvil: `public/images/pearl-mobile.webp` (768 × 1280, 31894 bytes; recorte central del mismo material).
- Optimización y recorte: Sharp disponible con Astro; no se retocó el contenido de la imagen.

Prompt final empleado:

> Use case: stylized-concept. Asset type: full viewport background texture for an elegant professional editorial website. Generate one high-resolution landscape 3:2 image of a continuous pearl satin silk surface / flexible iridescent sheet, seen close up. Large flowing soft fabric folds, dimensional depth, broad smooth highlights and quiet shadow valleys. Actual folded material, not a flat gradient. Dominantly off-white pearl with soft pale sage #E8EFD2, restrained lilac #BEB9DE, blush pink #F7CDE7 and very subtle cyan glints. Understated luxurious editorial aesthetic, soft diffused studio lighting, low contrast, no hard black shadows, no blown highlights, no busy wrinkles. Folds travel diagonally through image; composition should remain beautiful in both landscape and central portrait crops. Texture fills entire image edge to edge. No objects, no people, no text, no lettering, no logos, no watermark, no palette swatches, no border. This is a new original texture, not a screenshot or webpage mockup.

Las capas CSS de iluminación aproximan reflejos sobre esta textura: no son un cálculo físico de iluminación. Esta solución prioriza calidad visual y coste bajo frente a un shader.
