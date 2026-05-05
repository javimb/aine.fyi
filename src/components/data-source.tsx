import { lastUpdated } from "../../data/aine-classification";

export default function DataSource() {
  return (
    <p className="text-sm text-muted-foreground">
      Datos: AEMPS (CIMA) · Actualizado: {lastUpdated}
    </p>
  );
}
