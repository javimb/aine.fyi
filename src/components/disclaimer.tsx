export default function Disclaimer() {
  return (
    <div
      role="note"
      className="mx-auto w-full max-w-2xl rounded-lg border border-callout-border bg-callout-bg p-4"
    >
      <p className="text-sm font-semibold text-callout">⚠️ Aviso importante</p>
      <p className="mt-1 text-sm text-foreground">
        Esta herramienta es informativa y no sustituye el consejo médico
        profesional. Verifica siempre el prospecto del medicamento físico y
        consulta con tu médico o farmacéutico.
      </p>
    </div>
  );
}
