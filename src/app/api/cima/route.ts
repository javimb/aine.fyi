import { NextRequest, NextResponse } from "next/server";
import { matchAines } from "@/lib/aine-matcher";
import aineBlacklist from "../../../../data/aines";

const CIMA_BASE_URL = "https://cima.aemps.es/cima/rest";
const YELLOW_ANALYSIS = { status: "YELLOW" as const, matchedAines: [] };

function enrichWithAineAnalysis(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const pactivos = data.pactivos as string | undefined | null;
  return { ...data, aineAnalysis: matchAines(pactivos, aineBlacklist) };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nregistro = searchParams.get("nregistro");
  const cn = searchParams.get("cn");
  const nombre = searchParams.get("nombre");

  if (nregistro) {
    return handleDetail(
      `${CIMA_BASE_URL}/medicamento?nregistro=${encodeURIComponent(nregistro)}`,
    );
  }

  if (cn) {
    return handleDetail(
      `${CIMA_BASE_URL}/medicamento?cn=${encodeURIComponent(cn)}`,
    );
  }

  if (nombre) {
    return handleSearch(nombre);
  }

  return NextResponse.json(
    {
      error:
        "Se requiere al menos uno de los parámetros: nombre, nregistro o cn",
    },
    { status: 400 },
  );
}

async function handleDetail(url: string) {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { aineAnalysis: YELLOW_ANALYSIS },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { aineAnalysis: YELLOW_ANALYSIS },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(enrichWithAineAnalysis(data));
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor", aineAnalysis: YELLOW_ANALYSIS },
      { status: 502 },
    );
  }
}

async function handleSearch(nombre: string) {
  try {
    const url = new URL(`${CIMA_BASE_URL}/medicamentos`);
    url.searchParams.set("nombre", nombre);

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Error al consultar la API de CIMA",
          aineAnalysis: YELLOW_ANALYSIS,
        },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (Array.isArray(data.resultados)) {
      data.resultados = data.resultados.map((item: Record<string, unknown>) =>
        enrichWithAineAnalysis(item),
      );
    }

    if (data.pactivos !== undefined) {
      data.aineAnalysis = matchAines(
        data.pactivos as string | undefined | null,
        aineBlacklist,
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor", aineAnalysis: YELLOW_ANALYSIS },
      { status: 502 },
    );
  }
}
