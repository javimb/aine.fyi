import { aineBlacklistSchema } from "./aines.schema";

const aines = [
  {
    name: "Ibuprofeno",
    cimaNames: ["IBUPROFENO"],
    aliases: ["Advil", "Motrin", "Nurofen", "Espidifen"],
    family: "Profeno",
  },
  {
    name: "Ácido Acetilsalicílico",
    cimaNames: ["ACETILSALICILICO ACIDO"],
    aliases: ["Aspirina", "Aspirin", "ASA", "Adiro"],
    family: "Salicilato",
  },
  {
    name: "Naproxeno",
    cimaNames: ["NAPROXENO"],
    aliases: ["Naprosyn", "Aleve", "Antalgin", "Naproxeno"],
    family: "Profeno",
  },
  {
    name: "Diclofenaco",
    cimaNames: ["DICLOFENACO", "DICLOFENACO SODICO", "DICLOFENACO POTASICO"],
    aliases: ["Voltaren", "Diclofen", "Artrotec", "Delator"],
    family: "Acético",
  },
  {
    name: "Dexketoprofeno",
    cimaNames: ["DEXKETOPROFENO", "DEXKETOPROFENO TROMETAMOL"],
    aliases: ["Enantyum", "Ketesse", "Syndol"],
    family: "Profeno",
  },
  {
    name: "Indometacina",
    cimaNames: ["INDOMETACINA"],
    aliases: ["Indocid", "Indometacin", "Metindol"],
    family: "Acético",
  },
  {
    name: "Piroxicam",
    cimaNames: ["PIROXICAM"],
    aliases: ["Feldene", "Piroxicam", "Brexidol"],
    family: "Oxicam",
  },
];

export const validatedAines = aineBlacklistSchema.parse(aines);

export default validatedAines;
