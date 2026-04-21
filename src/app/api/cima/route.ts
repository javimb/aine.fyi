import { NextRequest, NextResponse } from "next/server";

const CIMA_BASE_URL = "https://cima.aemps.es/cima/rest/medicamentos";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("nombre");

  if (!nombre) {
    return NextResponse.json(
      { error: "El parámetro 'nombre' es obligatorio" },
      { status: 400 },
    );
  }

  try {
    const url = new URL(CIMA_BASE_URL);
    url.searchParams.set("nombre", nombre);

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API de CIMA" },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
