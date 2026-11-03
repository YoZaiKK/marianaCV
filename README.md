# Mariana Alejo Flores

Portafolio profesional de Recursos Humanos construido con Astro. Presenta experiencia, especialidades, formación, desarrollo profesional, herramientas y contacto en una interfaz editorial, accesible y responsive.

<p align="center">
  <img src="./public/images/pearl-desktop.webp" alt="Textura perlada iridiscente del sitio en formato escritorio" width="760">
</p>

| Escritorio | Móvil |
| --- | --- |
| ![Textura de fondo para escritorio](./public/images/pearl-desktop.webp) | ![Textura de fondo para móvil](./public/images/pearl-mobile.webp) |

## Características

- Contenido profesional en inglés, modelado y validado antes de cada compilación.
- Navegación por secciones: perfil, áreas de experiencia, trayectoria, educación, desarrollo profesional, herramientas, métodos, idiomas y contacto.
- CV bilingüe descargable sin modificación del documento original.
- Diseño responsive con fuentes locales y una textura perlada optimizada para escritorio y móvil.
- Experiencia funcional sin JavaScript para contenido, navegación, desplegables y descarga; JavaScript solo mejora la iluminación de fondo y la copia del correo.
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

## Estructura

```text
src/
  components/  Componentes y secciones editoriales
  content/     Datos, traducciones, esquema y validación
  i18n/        Formateo localizado y acceso a diccionarios
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

Consulta la [guía de actualización de contenido](./docs/content-guide.md) antes de modificar experiencia, formación, contacto o el CV. Las decisiones de procedencia y presentación están documentadas en [fuentes y decisiones editoriales](./docs/source-decisions.md).

El proyecto no declara un dominio ni se publica con una URL canónica inventada. Cuando exista uno, define `SITE_URL` antes de compilar para generar las etiquetas canónicas y `og:url`.
