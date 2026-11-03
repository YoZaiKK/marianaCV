import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { locales, defaultLocale } from '../src/i18n/config.ts';

const root = resolve('dist');
const port = Number(process.env.PORT || 4322);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405);
    response.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    } catch {
      const locale = locales.find(
        (value) =>
          value !== defaultLocale &&
          (pathname === `/${value}` || pathname.startsWith(`/${value}/`)),
      );
      file = locale ? resolve(root, `${locale}/404/index.html`) : resolve(root, '404.html');
      response.statusCode = 404;
    }
    const errorPaths = [
      '/404.html',
      ...locales
        .filter((value) => value !== defaultLocale)
        .flatMap((locale) => [`/${locale}/404/`, `/${locale}/404/index.html`]),
    ];
    if (errorPaths.includes(pathname)) response.statusCode = 404;
    const bytes = await readFile(file);
    response.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    response.writeHead(400);
    response.end();
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Build preview: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => server.close(() => process.exit(0)));
