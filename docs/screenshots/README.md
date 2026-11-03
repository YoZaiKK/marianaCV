# Capturas del sitio

Los conjuntos son independientes y no se sobrescriben. Cada carpeta incluye un manifiesto SHA-256.

- `before-i18n-2026-11-03/`: las cinco capturas originales, copiadas sin modificar sus bytes. Los originales también permanecen en `artifacts/`.
- `i18n-2026-11-03/`: primera revisión de inglés y español, con selector cerrado y abierto.
- `i18n-final-2026-11-03/`: revisión final de ambos idiomas en escritorio y móvil, con estados completos del desplegable.

## Revisión final

| Estado                    | Escritorio                                                        | Móvil                                                            |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| Inglés                    | [Página](i18n-final-2026-11-03/en-desktop-page.png)               | [Página](i18n-final-2026-11-03/en-mobile-page.png)               |
| Inglés, selector abierto  | [Desplegable](i18n-final-2026-11-03/en-desktop-language-open.png) | [Desplegable](i18n-final-2026-11-03/en-mobile-language-open.png) |
| Español                   | [Página](i18n-final-2026-11-03/es-desktop-page.png)               | [Página](i18n-final-2026-11-03/es-mobile-page.png)               |
| Español, selector abierto | [Desplegable](i18n-final-2026-11-03/es-desktop-language-open.png) | [Desplegable](i18n-final-2026-11-03/es-mobile-language-open.png) |

Para crear otro conjunto, servir la compilación y ejecutar `npm run capture -- nombre-unico`. Los menús se capturan con las transiciones completadas para evitar estados intermedios.
