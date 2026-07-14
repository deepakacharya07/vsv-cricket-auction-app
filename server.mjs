import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const preferredPort = Number(process.env.PORT ?? 5173);
const host = process.env.HOST ?? "127.0.0.1";
const root = process.cwd();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function createStaticServer(port) {
  return createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://localhost:${port}`);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const requestedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    const filePath = resolve(join(root, requestedPath));

    if (!filePath.startsWith(root) || !existsSync(filePath)) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    if (!statSync(filePath).isFile()) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    response.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  });
}

function listen(port, remainingAttempts = 10) {
  const server = createStaticServer(port);

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && remainingAttempts > 0) {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      listen(port + 1, remainingAttempts - 1);
      return;
    }

    throw error;
  });

  server.listen(port, host, () => {
    console.log(`VSV Cricket Auction running at http://${host}:${port}`);
  });
}

listen(preferredPort);
