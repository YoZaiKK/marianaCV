# Actualizar el sitio de Mariana

El sitio se genera con Astro en inglés (`/`) y español (`/es/`). Los documentos de trabajo no se publican.

## Datos y textos

- `src/content/portfolio.data.json`: identidad, contacto, organizaciones, fechas, identificadores, orden, estados, relaciones y nombres propios.
- `src/content/en.json` y `src/content/es.json`: textos públicos, botones, accesibilidad, mensajes y metadatos con exactamente las mismas claves e interpolaciones. Las hojas siempre son strings; las colecciones se definen en los datos.
- `src/content/model.ts`: esquema Zod y tipos derivados. `src/content/validation.ts` valida referencias y traducciones.
- `src/content/index.ts`: acceso centralizado. No hay un idioma global mutable.

Después de actualizar contenido, ejecutar `npm run check`, `npm test` y `npm run build`.

## Experiencia

1. Añadir la organización con un `id` único si no existe.
2. Añadir el empleo con su `organizationId`, `contentKey`, fechas y `order`.
3. Crear los textos de `role`, `summary` y responsabilidades bajo esa clave en ambos diccionarios.
4. Definir responsabilidades `primary` (visibles) y `additional` (desplegable nativo).
5. Usar `publicationStatus: "draft"` hasta que el contenido esté listo. No dejar claves faltantes en borradores.

Los resultados demostrados se incorporan a `outcomes` mediante referencias a textos propios. No convertir responsabilidades en logros. Conservar solapamientos entre empleos y no calcular experiencia sumando periodos.

Fechas: `{ "value": "2025", "precision": "year" }` o `{ "value": "2026-08", "precision": "month" }`. Un puesto actual usa `end: null` e `isCurrent: true`. Un puesto finalizado necesita su fecha final. No inventar meses o días. El formato de pantalla depende del idioma.

## Formación y desarrollo

`education` distingue `degree` y `diploma`. `development` distingue `dc3`, `introductoryTraining`, `training` y `workshop`, y se relaciona con `developmentGroups`. No añadir emisores, folios, fechas o acreditaciones que no estén documentados. `academicAverage` conserva el número del CV sin asumir una escala.

Las herramientas, métodos e idiomas viven en `practices`, asociados a `practiceGroups`. Los nombres propios usan `name`; los textos traducibles usan `contentKey`. Cada elemento debe utilizar exactamente una de esas opciones. No añadir barras ni porcentajes de dominio.

## Contacto y perfiles

Actualizar `profile.email`, su ubicación traducida y, si corresponde, `phone`. El teléfono está conservado en datos y oculto en esta versión. Una implementación futura de teléfono visible debe decidir expresamente su presentación; cambiar `visible` por sí solo no crea una acción pública.

Los perfiles profesionales se añaden a `profile.links` solo con URLs HTTPS confirmadas y una clave de etiqueta en ambos diccionarios. No deducir perfiles ni habilitar WhatsApp a partir de un número. La copia del correo se habilita cuando la API está disponible; ante denegación presenta un aviso y conserva el enlace de correo.

## Sustituir el CV

1. Verificar identidad, correo y teléfono en el nuevo PDF.
2. Colocarlo en `public/resume/` y actualizar `profile.resumeUrl` si cambia el nombre.
3. Registrar su SHA-256, identidad y contacto comprobados en `docs/resume-source.json`.
4. Ejecutar las verificaciones y actualizar la comprobación de integridad del PDF en la prueba de navegador si cambia la fuente.
5. Comprobar descarga y apertura del resultado compilado.

El PDF actual es bilingüe y se conserva íntegro. `resumeUrl: null` oculta todas las acciones de descarga. No modificar el PDF silenciosamente para reconciliar diferencias entre idiomas.

## Incorporar otro idioma

1. Crear el nuevo diccionario con exactamente las mismas claves y hojas string que `en.json`. Conservar los nombres de las interpolaciones, como `{{name}}` y `{{company}}`.
2. Registrar el idioma y su formato regional en `src/i18n/config.ts`. Astro y el selector utilizan ese registro.
3. Importar el diccionario y añadirlo a `dictionaries` en `src/i18n/index.ts`.
4. Añadir su nombre nativo bajo `language.names` en todos los diccionarios.
5. Crear su página con `<PortfolioPage locale="…" />` y su error con `<NotFoundPage locale="…" />`.
6. Revisar la resolución de errores del hosting y ampliar los metadatos regionales si se incorporan otros idiomas. Los alternates `hreflang` utilizan `SITE_URL` cuando existe un dominio confirmado.

La composición, los datos y los componentes se comparten. El inglés está en `/` y el español en `/es/`. La validación compara todas las claves y los nombres de las interpolaciones; falla si faltan textos o quedan variables sin resolver. Español utiliza `es-MX` para fechas y números. Los nombres nativos English y Español se conservan para reconocer las opciones desde cualquier idioma.

El selector usa un combobox de selección única y un menú con las superficies opacas, radios, tipografía y colores del sitio. Flechas, Home/End y escritura por letras recorren opciones; Enter/Espacio confirma; Escape cancela. Tab cierra sin cambiar de idioma ni atrapar el foco. El cambio conserva la sección y los parámetros de la URL. Sin JavaScript aparecen enlaces EN/ES. No guarda preferencias ni realiza redirecciones automáticas por idioma del navegador.

## Dominio y metadatos

`SITE_URL` configura el dominio en tiempo de compilación. No está establecido por defecto: así se evita publicar una URL canónica inventada. Cuando exista un dominio real, configurar la variable y compilar de nuevo. Añadir `og:image` solamente al disponer de una imagen social apropiada y su URL definitiva.

## Fondo y recursos

Los originales de generación están en `src/assets/background/`; las versiones servidas están en `public/images/`. El fondo no cambia de geometría con el scroll: solo varía la iluminación. No añadir bucles permanentes ni animar desplazamiento/escala de la textura. Con movimiento reducido queda estático.

Conservar las licencias OFL de las fuentes instaladas. DM Sans y DM Serif Display se sirven localmente a través de Fontsource; no se hacen solicitudes a Google Fonts.

## Contenido futuro

Crear artículos o casos únicamente cuando exista material real y publicable. No hay colecciones o secciones públicas vacías para esas funciones. La navegación omite las secciones que no tienen elementos publicados.
