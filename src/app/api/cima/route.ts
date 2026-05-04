import { NextRequest, NextResponse } from "next/server";
import { matchAines, YELLOW_ANALYSIS } from "@/lib/aine-matcher";
import { principioClassification } from "../../../../data/aine-classification";

const CIMA_BASE_URL = "https://cima.aemps.es/cima/rest";

function enrichWithAineAnalysis(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const pactivos = data.pactivos as string | undefined | null;
  return {
    ...data,
    aineAnalysis: matchAines(pactivos, principioClassification),
  };
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

async function fetchDetail(
  nregistro: string,
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(
      `${CIMA_BASE_URL}/medicamento?nregistro=${encodeURIComponent(nregistro)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
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
      const enriched = [];
      const batchSize = 5;
      for (let i = 0; i < data.resultados.length; i += batchSize) {
        const batch = data.resultados.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (item: Record<string, unknown>) => {
            if (item.pactivos) {
              return enrichWithAineAnalysis(item);
            }
            const detail = await fetchDetail(item.nregistro as string);
            if (detail && detail.pactivos) {
              return enrichWithAineAnalysis({
                ...item,
                pactivos: detail.pactivos,
              });
            }
            return enrichWithAineAnalysis(item);
          }),
        );
        enriched.push(...batchResults);
      }
      data.resultados = enriched;
    }

    if (data.pactivos !== undefined) {
      data.aineAnalysis = matchAines(
        data.pactivos as string | undefined | null,
        principioClassification,
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
