# Verificación de la implementación

Fecha: 3 de noviembre de 2026. Actualizado con la implementación bilingüe. Comprobaciones locales; no se publicó ni desplegó el sitio.

## Resultado técnico

| Comprobación | Resultado |
| --- | --- |
| `npm run check` | Correcto: contenido validado; Astro/TypeScript sin errores, advertencias ni hints. |
| `npm test` | 16 pruebas correctas de contenido, referencias, publicación, fechas parciales, iluminación y navegación por idioma. |
| `npm run build` | Correcto: salida estática con las portadas inglesa y española y sus páginas de error. |
| `npm run test:e2e` | 22 pruebas correctas sobre la compilación, con Edge headless en escritorio y móvil emulado. |
| Axe | Sin infracciones detectadas en las etiquetas WCAG A/AA 2.0, 2.1 y 2.2 incluidas, con los detalles laborales abiertos. |
| Descarga del CV | Respuesta PDF correcta, evento de descarga y nombre de archivo comprobados. SHA-256 idéntico a la fuente. |
| Datos residuales de la referencia | Cero coincidencias de identidad, correo y URLs personales de su perfil en el texto del destino y la compilación. |

La revisión automática no equivale a una auditoría de accesibilidad completa. Los diccionarios inglés y español tienen exactamente las mismas 128 claves y nombres de interpolación; sus hojas son strings.

## Idiomas y selector

- Inglés en `/` y español en `/es/`, con los mismos componentes y datos.
- Fechas y números de español con formato `es-MX`, conservando fechas parciales y periodos superpuestos.
- Navegación, contacto, mensajes de éxito/error, metadatos, textos accesibles y páginas de error localizados.
- Títulos y `og:locale` por idioma; canónicas y alternates `hreflang` preparados para el dominio real mediante `SITE_URL`. No se emitió un dominio ficticio.
- Selector de selección única con menú propio, tipografía DM Sans, superficie blanca opaca, radios de 16 px, borde y sombra suaves, y selección salvia.
- Comprobaciones de estilo: fuente compartida con el sitio, superficie, radio, color seleccionado, área táctil de 44 px y menú dentro del viewport.
- Clic y toque emulado para seleccionar; flechas, Home/End, escritura por letras y Enter para cambiar; Escape para cancelar; Tab cierra sin atrapar foco ni cambiar de idioma.
- El cambio entre idiomas conserva el fragmento de sección y los parámetros de URL; no se guardan preferencias ni se fuerza el idioma del navegador.
- Con JavaScript desactivado hay enlaces EN/ES funcionales en ambos sentidos.
- Se comprobó el error español para una ruta inexistente, su enlace a `/es/` y el cambio al error inglés desde su selector.
- Durante las pruebas se corrigió un desbordamiento de “Conversemos” a 320 px. El encabezado de contacto y sus columnas ahora se ajustan sin recortar el texto.

## Navegador e interacciones

- Un solo h1, idioma inglés, títulos de página y anclas válidos.
- Jerarquía y controles de teclado, skip link y foco en el contenido.
- Desplegables activables con Enter y disponibles sin JavaScript.
- Copia del correo: rutas de éxito y denegación comprobadas con Clipboard API controlada en la prueba. La alternativa mailto permanece disponible.
- Navegación, contenido y fondo estático disponibles sin JavaScript; el botón de copia queda oculto.
- Página 404 con título propio y enlace de retorno.
- Sin errores JavaScript observados durante la prueba principal.
- Comprobación responsive a 320, 390, 768, 1024 y 1440 px, y aumento del tamaño raíz de texto al 200%.
- Se detectó y corrigió durante la inspección visual un recorte de texto en el hero móvil. Se añadió una aserción que verifica que la columna de texto permanece dentro del área de contenido de la card.

Se inspeccionaron capturas de escritorio, de una posición intermedia de scroll y de móvil. Las cinco capturas originales permanecen en `artifacts/` y tienen copias idénticas en `docs/screenshots/before-i18n-2026-11-03/`, con manifiesto SHA-256. Las revisiones bilingües se conservan en carpetas independientes. La revisión final tiene ocho imágenes: ambos idiomas, escritorio y móvil, con selector cerrado y abierto. Ver `docs/screenshots/README.md`. Una captura de página completa solo dibuja la capa fija en el viewport capturado: las capturas de viewport intermedio comprueban su presencia al desplazarse.

## Fondo

- Textura real de pliegues generada, sin muestras de paleta, texto ni logos.
- Posición y dimensiones de la capa fija iguales antes y después de desplazarse.
- Cambio de iluminación de acuerdo con el progreso real del documento.
- Reversibilidad al volver a la misma posición.
- Estado estable al detener el scroll.
- Recálculo al abrir detalles y cambiar la altura del documento.
- Al activar movimiento reducido se retiran las actualizaciones y los estilos dinámicos; al desactivarlo se reanuda el cálculo.
- Respaldo estático con JavaScript desactivado.
- El código programa un solo requestAnimationFrame pendiente y no contiene un bucle de animación permanente.

## Recursos y rendimiento

| Recurso | Tamaño medido |
| --- | --- |
| Textura de escritorio WebP | 69328 bytes |
| Textura móvil WebP | 31894 bytes |
| JavaScript propio incluido en cada portada | 4266 bytes; 1789 bytes gzip |
| HTML inglés | 25246 bytes |
| HTML español | 26070 bytes |

Las fuentes se sirven localmente con Fontsource y font-display swap. Se incluyen sus licencias OFL en `public/fonts/`. No se incorporaron React, shaders, librerías de animación ni componentes interactivos del proyecto de referencia.

Estos tamaños corresponden a esta compilación y pueden cambiar al actualizar contenido. No se ejecutó Lighthouse ni se afirma una puntuación o métrica de campo de Core Web Vitals.

## Integridad de fuentes y referencia

Las cuatro fuentes de `marianaCV` conservaron exactamente las huellas SHA-256 registradas al inicio. El PDF descargable coincide byte por byte con el PDF suministrado.

Esta tarea no ejecutó escrituras en `subsequent-spiral`. Sin embargo, la comparación final con las 63 entradas registradas al inicio detectó cambios concurrentes en esa carpeta: 7 archivos cambiaron, se añadieron 2 imágenes y desaparecieron 3 logs de `.playwright-mcp`. El inventario final contiene 62 entradas. Los cambios afectan README, recursos de documentación y estilos/componentes del laboratorio.

La referencia contiene el commit `e9192cd`, “Kanban”, fechado el 3 de noviembre de 2026 a las 00:20:09 UTC−06, durante esta implementación. No se revirtieron ni incorporaron esos cambios al sitio de Mariana. Por ello se distingue entre **ausencia de escrituras de esta tarea en la referencia** y **ausencia de cambios concurrentes**, que no puede afirmarse.

En la ampliación bilingüe se tomó una nueva referencia de esas 62 entradas: todas conservaron sus huellas al finalizar, al igual que las cuatro fuentes originales. Los cambios concurrentes descritos arriba corresponden a la entrega inicial, no a esta ampliación. También se verificaron las cinco capturas originales y sus copias archivadas: ninguna cambió de contenido.

## Límites y pendientes

- Navegador comprobado: Edge/Chromium en Windows, con móvil emulado. No se verificó Safari ni un dispositivo iOS/Android físico.
- La prueba de aumento de texto no sustituye una revisión manual completa de todas las combinaciones de zoom y navegador.
- La iluminación sobre la textura es una aproximación artística y no un material con iluminación física.
- No se configuraron dominio definitivo, URL canónica absoluta ni imagen social específica; se habilitan con recursos confirmados.
- Las discrepancias y campos pendientes del CV permanecen en `source-decisions.md`. Las afirmaciones no confirmadas no se añadieron al contenido web.

El servidor temporal de verificación se detiene al finalizar. Para desarrollar, utilizar `npm run dev -- --background` y administrarlo con los comandos documentados en README y AGENTS.md.
