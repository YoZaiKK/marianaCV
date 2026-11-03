# Mariana Alejo Flores

Portafolio profesional de Recursos Humanos construido con Astro. Presenta experiencia, especialidades, formación, desarrollo profesional, herramientas y contacto en una interfaz editorial, accesible y responsive.

<p align="center">
  <img src="./public/images/pearl-desktop.webp" alt="Textura perlada iridiscente del sitio en formato escritorio" width="760">
</p>

| Escritorio                                                              | Móvil                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| ![Textura de fondo para escritorio](./public/images/pearl-desktop.webp) | ![Textura de fondo para móvil](./public/images/pearl-mobile.webp) |

## Características

- Contenido profesional en inglés (`/`) y español (`/es/`), con las mismas 128 claves e interpolaciones, validado antes de cada compilación.
- Navegación por secciones: perfil, áreas de experiencia, trayectoria, educación, desarrollo profesional, herramientas, métodos, idiomas y contacto.
- CV bilingüe descargable sin modificación del documento original.
- Diseño responsive con fuentes locales y una textura perlada optimizada para escritorio y móvil.
- Selector de idioma con menú acorde a Editorial perla, navegación por teclado, selección táctil y conservación de anclas y parámetros.
- Experiencia funcional sin JavaScript para contenido, navegación, desplegables y descarga; el cambio de idioma conserva enlaces EN/ES y JavaScript mejora el selector, la iluminación y la copia del correo.
- Accesibilidad cubierta con navegación por teclado, enlace para saltar al contenido, foco visible y pruebas Axe WCAG A/AA.
- Respeta `prefers-reduced-motion` y evita solicitudes a servicios de fuentes externos.

## Tecnologías

- [Astro](https://astro.build/) con salida estática
- TypeScript y validación de contenido
- Node.js Test Runner y Playwright
- Fontsource: DM Sans y DM Serif Display

## Desarrollo local

Requiere Node.js `>=22.23.4`.

```sh
npm ci
npm run dev -- --background
```

El servidor de desarrollo se administra en modo background:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## Verificación

```sh
npm run check
npm test
npm run build
```

Para comprobar la versión estática con las pruebas de navegador:

```sh
npm run serve:build
```

En otra terminal:

```sh
npm run test:e2e
```

El servidor de la compilación se expone en `http://127.0.0.1:4322`. Las pruebas de navegador usan Microsoft Edge en modo headless y también cubren una vista móvil emulada. Puede utilizarse `TEST_BASE_URL` para apuntarlas a otra URL local.

## Capturas conservadas

Las cinco capturas anteriores están archivadas sin cambios en `docs/screenshots/before-i18n-2026-11-03/`. Los conjuntos de la versión bilingüe se guardan por separado; ver [el índice de capturas](./docs/screenshots/README.md).

Con la compilación sirviéndose, crear un conjunto nuevo sin sobrescribir los anteriores:

```sh
npm run capture -- nombre-unico-de-la-revision
```

Cada conjunto incluye un manifiesto SHA-256. El comando rechaza nombres ya utilizados.

## Estructura

```text
src/
  components/  Componentes y secciones editoriales
  content/     Datos, traducciones, esquema y validación
  i18n/        Registro de idiomas, formato localizado y navegación
  layouts/     Estructura global de la página
  styles/      Tokens y estilos responsive
  views/       Composición del portafolio
public/
  images/      Texturas optimizadas del sitio
  resume/      CV bilingüe descargable
tests/         Pruebas unitarias y de integración
docs/          Guías de contenido y decisiones de fuentes
```

## Contenido y despliegue

Consulta la [guía de actualización de contenido](./docs/content-guide.md) antes de modificar experiencia, formación, contacto o el CV. Las decisiones de procedencia y presentación están documentadas en [fuentes y decisiones editoriales](./docs/source-decisions.md); los controles locales más recientes están recogidos en el [informe de verificación](./docs/verification.md).

El proyecto no declara un dominio ni se publica con una URL canónica inventada. Cuando exista uno, define `SITE_URL` antes de compilar para generar las etiquetas canónicas y `og:url`.

También se generan alternates `hreflang` con ese dominio. El español utiliza fechas y números de México. Las páginas de error comparten composición y cuentan con versiones en ambos idiomas; el enrutamiento de errores en producción depende del hosting que se elija.
