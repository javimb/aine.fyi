import { createServer, request as httpRequest } from "http";
import { AddressInfo } from "net";

interface TestServer {
  url: string;
  fetch: (path: string, init?: RequestInit) => Promise<Response>;
  close: () => Promise<void>;
}

export async function createTestServer(): Promise<TestServer> {
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    const request = new Request(`http://localhost${req.url}`, {
      method: req.method,
      headers: Object.entries(req.headers).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(", ") : String(v),
      ]) as [string, string][],
      body: body || undefined,
    });

    try {
      const { GET } = await import("@/app/api/cima/route");
      const response = await GET(request as import("next/server").NextRequest);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.end(await response.text());
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: String(error) }));
    }
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;
  const url = `http://localhost:${port}`;

  return {
    url,
    fetch: (path: string, init?: RequestInit): Promise<Response> => {
      return new Promise((resolve, reject) => {
        const reqUrl = new URL(path, url);
        const options = {
          hostname: reqUrl.hostname,
          port: reqUrl.port,
          path: reqUrl.pathname + reqUrl.search,
          method: init?.method || "GET",
          headers: init?.headers
            ? Object.fromEntries(
                Array.from(new Headers(init.headers).entries()),
              )
            : {},
        };

        const req = httpRequest(options, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(
              new Response(data, {
                status: res.statusCode || 200,
                headers: Object.entries(res.headers).map(([k, v]) => [
                  k,
                  Array.isArray(v) ? v.join(", ") : String(v),
                ]) as [string, string][],
              }),
            );
          });
        });

        req.on("error", reject);

        if (init?.body) {
          req.write(String(init.body));
        }
        req.end();
      });
    },
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
