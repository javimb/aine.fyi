# ¿Es un AINE?

A web application that helps people with NSAID (AINE) allergies check whether commercial medications contain NSAID compounds. It queries the [CIMA API](https://cima.aemps.es/) (Agencia Española de Medicamentos y Productos Sanitarios) and displays results via a color-coded risk indicator. Live at **[aine.fyi](https://aine.fyi)**.

| Color     | Meaning                                                           |
| :-------- | :---------------------------------------------------------------- |
| 🔴 Red    | **Contains AINE** — critical alert showing the detected compound  |
| 🟠 Amber  | **Contains salicilato** — caution, AINE-related compound          |
| 🟢 Green  | **No AINE detected** — safe based on official composition         |
| 🟡 Yellow | **Uncertain / not found** — incomplete data, consult a pharmacist |

Principios activos last updated: 2026-08-01 <!-- last-updated: 2026-08-01 -->

> **IMPORTANT:** This application is an informational tool based on public data. It does not replace the advice of a healthcare professional. Always verify the physical medication leaflet and consult a doctor or pharmacist before taking any medication, especially in cases of severe allergies.

Inspired by [e-lactancia.org](https://www.e-lactancia.org/).

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20

### Getting Started

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Script           | Description                          |
| :--------------- | :----------------------------------- |
| `npm run dev`    | Start the Next.js development server |
| `npm run build`  | Create a production build            |
| `npm run start`  | Start the production server          |
| `npm run lint`   | Run ESLint on source files           |
| `npm run format` | Format files with Prettier           |
| `npm run test`   | Run tests with Vitest                |

### Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Vitest**
- **CIMA API** — Spanish Medicines Agency public API
