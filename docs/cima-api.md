# Technical Specification: CIMA API (AEMPS)

## Overview

The **CIMA API** (Centro de Información Online de Medicamentos) is a public REST API provided by the Spanish Agency for Medicines and Health Products (AEMPS). It provides comprehensive data on all medicines authorized in Spain.

**Project Goal:** Use this API to identify if a searched medicine contains any **NSAIDs** (Non-Steroidal Anti-Inflammatory Drugs) in its composition to prevent allergic reactions.

---

## 1. Connection Details

- **Base URL:** `https://cima.aemps.es/cima/rest/`
- **Protocol:** HTTPS
- **Authentication:** None (Public Access)
- **Format:** JSON (UTF-8)

---

## 2. Primary Endpoints

### A. Search Medications by Name

`GET /medicamentos?nombre={search_term}`

- **Description:** Returns a list of medications matching the string.
- **Use Case:** Populating a search results list or autocomplete.
- **Key Fields in Response:**
  - `nregistro`: Registration number (Unique ID).
  - `nombre`: Commercial name.
  - `pactivos`: Composed string of active ingredients (summary).

### B. Get Full Medication Details

`GET /medicamento?cn={national_code}` OR `?nregistro={registration_id}`

- **Description:** Returns the complete file for a specific product.
- **Critical Field for Logic:** `pactivos`
  - This field contains the active ingredients.
  - **Format:** A comma-separated string (e.g., `"ACETILSALICILICO ACIDO, CLORFENAMINA MALEATO, FENILEFRINA HIDROCLORURO"`).

---

## 3. Data Schema (Simplified for Logic)

When querying a specific medication, the coding agent should focus on:

| Field      | Type   | Description                                                                                                |
| :--------- | :----- | :--------------------------------------------------------------------------------------------------------- |
| `nombre`   | String | Full commercial name of the drug.                                                                          |
| `pactivos` | String | **The most important field.** List of ingredients to be parsed and compared against the NSAID "Blacklist". |
| `docs`     | Array  | Objects containing URLs for `ft` (Technical Sheet) and `p` (Prospectus/Leaflet).                           |
| `fotos`    | Array  | URLs to product images for user verification.                                                              |

---

## 4. Implementation Logic for NSAID Filter

1. **The Blacklist:** Create a constant array of NSAID active ingredients in Spanish (as the API returns them in Spanish).
   - _Example:_ `['IBUPROFENO', 'ACETILSALICILICO ACIDO', 'NAPROXENO', 'DICLOFENACO', 'DEXKETOPROFENO', 'PIROXICAM', 'ETORICOXIB']`.
2. **The Matcher:**
   - Fetch the medication details.
   - Normalize the `pactivos` string (uppercase, remove accents).
   - Check if any element of the **Blacklist** exists within the `pactivos` string.
3. **The Result:**
   - **MATCH:** Trigger "Danger/Red" UI state.
   - **NO MATCH:** Trigger "Safe/Green" UI state.
   - **ERROR/404:** Trigger "Unknown/Yellow" UI state.
   - **Note:** CIMA returns `204 No Content` (empty body), not 404, for unknown `nregistro`/`cn` lookups. The proxy normalizes 204 to a 404 not-found response so the UI can distinguish not-found from server errors.

---

## 5. Developer Notes & Constraints

- **CORS:** The API might not have CORS headers enabled for direct browser requests. A **Proxy Server** or **Server-Side Fetch** (Next.js Server Components / Node.js) is recommended.
- **Naming Conventions:** Active ingredients are usually in uppercase in the API. Always use `.toUpperCase()` when comparing.
- **Rate Limiting:** While not explicitly documented, avoid aggressive polling. Implement debouncing on the search input (e.g., 300ms).
- **National Code (CN):** The `cn` (Código Nacional) is a 6 or 7-digit identifier found on physical packaging barcodes. Using this as a search parameter is the most accurate method.

---

## 6. Sample Response Object (JSON)

`GET /medicamento?nregistro=57361`

```json
{
  "nregistro": "57361",
  "nombre": "COULDINA CON ACIDO ACETILSALICILICO COMPRIMIDOS EFERVESCENTES",
  "pactivos": "ACETILSALICILICO ACIDO, CLORFENAMINA MALEATO, FENILEFRINA HIDROCLORURO",
  "viasAdministracion": [{ "nombre": "VÍA ORAL" }],
  "docs": [
    {
      "tipo": 1,
      "url": "[https://cima.aemps.es/cima/pdfs/ft/57361/FT_57361.pdf](https://cima.aemps.es/cima/pdfs/ft/57361/FT_57361.pdf)"
    },
    {
      "tipo": 2,
      "url": "[https://cima.aemps.es/cima/dochtml/p/57361/P_57361.html](https://cima.aemps.es/cima/dochtml/p/57361/P_57361.html)"
    }
  ]
}
```
