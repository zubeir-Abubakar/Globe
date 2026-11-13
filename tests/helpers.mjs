import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { createServer as createNetServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export async function freePort() {
  const server = createNetServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  server.close();
  await once(server, "close");
  return port;
}

export async function waitForUrl(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "no response";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(2_000),
      });
      if (response.status < 500) return response;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

export async function startNext(port, environment = {}) {
  const buildId = path.join(projectRoot, ".next", "BUILD_ID");
  if (!existsSync(buildId)) {
    throw new Error("Production build missing. Run `npm run build` before `npm test`.");
  }

  const child = spawn(
    process.execPath,
    [
      path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
      "start",
      "-p",
      String(port),
    ],
    {
      cwd: projectRoot,
      env: { ...process.env, PORT: String(port), ...environment },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let logs = "";
  child.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await waitForUrl(`${baseUrl}/en`);
  } catch (error) {
    child.kill("SIGKILL");
    throw new Error(
      `${error instanceof Error ? error.message : String(error)}\n${logs}`,
    );
  }

  return {
    baseUrl,
    logs: () => logs,
    async stop() {
      if (child.exitCode !== null) return;
      child.kill("SIGTERM");
      await Promise.race([
        once(child, "exit"),
        new Promise((resolve) => setTimeout(resolve, 3_000)),
      ]);
      if (child.exitCode === null) child.kill("SIGKILL");
    },
  };
}

export async function startMockForm(port) {
  const received = [];
  const state = { failNext: false };
  const server = createServer((request, response) => {
    let bytes = 0;
    request.on("data", (chunk) => {
      bytes += chunk.length;
    });
    request.on("end", () => {
      received.push({
        method: request.method,
        url: request.url,
        contentType: request.headers["content-type"] ?? "",
        bytes,
      });
      if (state.failNext) {
        state.failNext = false;
        response.writeHead(502, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "mock provider failure" }));
        return;
      }
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true }));
    });
  });

  server.listen(port, "127.0.0.1");
  await once(server, "listening");

  return {
    endpoint: `http://127.0.0.1:${port}/form`,
    received,
    failNext() {
      state.failNext = true;
    },
    async stop() {
      server.close();
      await once(server, "close");
    },
  };
}
