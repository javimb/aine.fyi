import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { createTestServer } from "@/lib/test-server";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("API integration tests (/api/cima)", () => {
  let server: Awaited<ReturnType<typeof createTestServer>>;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("test server is running and reachable", async () => {
    const response = await server.fetch("/api/cima");
    expect(response.status).toBe(400);
  });

  it("returns 400 when no query parameters provided", async () => {
    const response = await server.fetch("/api/cima");
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it("searches by nombre and enriches resultados with aineAnalysis", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          resultados: [
            { nombre: "Ibuprofeno 400mg", pactivos: "IBUPROFENO" },
            { nombre: "Paracetamol 500mg", pactivos: "PARACETAMOL" },
          ],
        }),
    });

    const response = await server.fetch("/api/cima?nombre=ibuprofeno");
    const body = await response.json();

    expect(body.resultados[0].aineAnalysis.status).toBe("RED");
    expect(body.resultados[0].aineAnalysis.matchedAines[0].level).toBe("RED");
    expect(body.resultados[1].aineAnalysis.status).toBe("GREEN");
    expect(body.resultados[1].aineAnalysis.matchedAines).toEqual([]);
  });

  it("fetches detail by nregistro and enriches with aineAnalysis", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          nombre: "Ibuprofeno 400mg",
          pactivos: "IBUPROFENO",
        }),
    });

    const response = await server.fetch("/api/cima?nregistro=12345");
    const body = await response.json();

    expect(body.aineAnalysis.status).toBe("RED");
    expect(body.aineAnalysis.matchedAines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "IBUPROFENO", level: "RED" }),
      ]),
    );
  });

  it("fetches detail by cn and enriches with aineAnalysis", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          nombre: "Paracetamol 650mg",
          pactivos: "PARACETAMOL",
        }),
    });

    const response = await server.fetch("/api/cima?cn=654321");
    const body = await response.json();

    expect(body.aineAnalysis.status).toBe("GREEN");
    expect(body.aineAnalysis.matchedAines).toEqual([]);
  });

  it("returns 404 with YELLOW analysis when CIMA returns 404 for detail lookup", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const response = await server.fetch("/api/cima?nregistro=99999");
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns 404 with YELLOW analysis when CIMA returns 204 for detail lookup", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: () =>
        Promise.reject(new SyntaxError("Unexpected end of JSON input")),
    });

    const response = await server.fetch("/api/cima?nregistro=99999");
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

    const response = await server.fetch("/api/cima?nombre=test");
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });

  it("returns 502 with YELLOW analysis on fetch error for detail lookup", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await server.fetch("/api/cima?nregistro=12345");
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.aineAnalysis.status).toBe("YELLOW");
  });
});
