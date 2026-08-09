import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockJsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

function createRequest(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const url = `http://localhost:3000/api/cima?${searchParams.toString()}`;
  return new Request(url) as unknown as import("next/server").NextRequest;
}

describe("CIMA proxy route", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns 400 when no query parameters provided", async () => {
    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({});
    const response = await GET(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it("forwards search by nombre and enriches resultados with aineAnalysis", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({
        resultados: [
          { nombre: "Ibuprofeno 400mg", pactivos: "IBUPROFENO" },
          { nombre: "Paracetamol 500mg", pactivos: "PARACETAMOL" },
        ],
      }),
    );

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ nombre: "ibuprofeno" });
    const response = await GET(request);
    const body = await response.json();

    expect(body.resultados[0].aineAnalysis.status).toBe("RED");
    expect(body.resultados[0].aineAnalysis.matchedAines[0].level).toBe("RED");
    expect(body.resultados[1].aineAnalysis.status).toBe("GREEN");
    expect(body.resultados[1].aineAnalysis.matchedAines).toEqual([]);
  });

  it("fetches detail by nregistro and enriches with aineAnalysis", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({
        nombre: "Ibuprofeno 400mg",
        pactivos: "IBUPROFENO",
      }),
    );

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ nregistro: "12345" });
    const response = await GET(request);
    const body = await response.json();

    expect(body.aineAnalysis.status).toBe("RED");
    expect(body.aineAnalysis.matchedAines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "IBUPROFENO", level: "RED" }),
      ]),
    );
  });

  it("fetches detail by cn and enriches with aineAnalysis", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({
        nombre: "Paracetamol 650mg",
        pactivos: "PARACETAMOL",
      }),
    );

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ cn: "654321" });
    const response = await GET(request);
    const body = await response.json();

    expect(body.aineAnalysis.status).toBe("GREEN");
    expect(body.aineAnalysis.matchedAines).toEqual([]);
  });

  it("prioritizes nregistro over cn and nombre", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({ nombre: "Detail", pactivos: "IBUPROFENO" }),
    );

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({
      nregistro: "12345",
      cn: "999",
      nombre: "test",
    });
    await GET(request);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("nregistro=12345");
    expect(calledUrl).not.toContain("cn=");
    expect(calledUrl).not.toContain("nombre=");
  });

  it("prioritizes cn over nombre", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({ nombre: "Detail", pactivos: "PARACETAMOL" }),
    );

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ cn: "999", nombre: "test" });
    await GET(request);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("cn=999");
    expect(calledUrl).not.toContain("nombre=");
  });

  it("returns 404 with YELLOW analysis when CIMA returns 404 for detail lookup", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ nregistro: "99999" });
    const response = await GET(request);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns 404 with YELLOW analysis when CIMA returns 204 for detail lookup by nregistro", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: () =>
        Promise.reject(new SyntaxError("Unexpected end of JSON input")),
    });

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ nregistro: "99999" });
    const response = await GET(request);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns 404 with YELLOW analysis when CIMA returns 204 for detail lookup by cn", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: () =>
        Promise.reject(new SyntaxError("Unexpected end of JSON input")),
    });

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ cn: "99999" });
    const response = await GET(request);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns 502 with YELLOW analysis when CIMA returns server error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ nombre: "test" });
    const response = await GET(request);

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns 502 with YELLOW analysis on fetch error for detail lookup", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ nregistro: "12345" });
    const response = await GET(request);

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns YELLOW analysis when medication has no pactivos", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({ nombre: "Some Med", pactivos: "" }),
    );

    const { GET } = await import("@/app/api/cima/route");
    const request = createRequest({ cn: "123" });
    const response = await GET(request);
    const body = await response.json();

    expect(body.aineAnalysis.status).toBe("YELLOW");
  });
});
