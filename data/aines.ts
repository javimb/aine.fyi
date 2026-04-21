import { aineBlacklistSchema } from "./aines.schema";

const aines = [
  {
    name: "Ibuprofeno",
    aliases: ["Advil", "Motrin", "Nurofen", "Espidifen"],
    family: "Profeno",
  },
  {
    name: "Ácido Acetilsalicílico",
    aliases: ["Aspirina", "Aspirin", "ASA", "Adiro"],
    family: "Salicilato",
  },
  {
    name: "Naproxeno",
    aliases: ["Naprosyn", "Aleve", "Antalgin", "Naproxeno"],
    family: "Profeno",
  },
  {
    name: "Diclofenaco",
    aliases: ["Voltaren", "Diclofen", "Artrotec", "Delator"],
    family: "Acético",
  },
  {
    name: "Dexketoprofeno",
    aliases: ["Enantyum", "Ketesse", "Syndol"],
    family: "Profeno",
  },
  {
    name: "Indometacina",
    aliases: ["Indocid", "Indometacin", "Metindol"],
    family: "Acético",
  },
  {
    name: "Piroxicam",
    aliases: ["Feldene", "Piroxicam", "Brexidol"],
    family: "Oxicam",
  },
];

export const validatedAines = aineBlacklistSchema.parse(aines);

export default validatedAines;
