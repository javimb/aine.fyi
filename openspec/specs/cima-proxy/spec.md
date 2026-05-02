## ADDED Requirements

### Requirement: CIMA API proxy route

The project SHALL expose a Next.js API route at `/api/cima` that proxies requests to the CIMA API and enriches all responses with AINE analysis.

#### Scenario: Searching medications by name with analysis

- **WHEN** a GET request is sent to `/api/cima?nombre=<drug-name>`
- **THEN** the route SHALL forward the request to CIMA `/medicamentos?nombre=<drug-name>`, run AINE analysis on each medication in the result list, and return the enriched data with `aineAnalysis` per item

#### Scenario: Fetching medication detail by nregistro with analysis

- **WHEN** a GET request is sent to `/api/cima?nregistro=<registration-id>`
- **THEN** the route SHALL forward the request to CIMA `/medicamento?nregistro=<registration-id>`, run AINE analysis on the medication, and return the enriched data with `aineAnalysis`

#### Scenario: Fetching medication detail by national code with analysis

- **WHEN** a GET request is sent to `/api/cima?cn=<national-code>`
- **THEN** the route SHALL forward the request to CIMA `/medicamento?cn=<national-code>`, run AINE analysis on the medication, and return the enriched data with `aineAnalysis`

#### Scenario: Parameter precedence when multiple provided

- **WHEN** a GET request is sent with more than one of `nombre`, `nregistro`, or `cn`
- **THEN** the route SHALL process parameters in this precedence order: `nregistro` > `cn` > `nombre`, ignoring lower-precedence parameters

#### Scenario: Handling CIMA API errors

- **WHEN** the CIMA API returns an error status code (4xx or 5xx)
- **THEN** the proxy route SHALL return a 502 error with a generic message, and the response SHALL include `aineAnalysis` with status `YELLOW` and an empty `matchedAines` array

#### Scenario: Medication not found in CIMA (404)

- **WHEN** the CIMA API returns a 404 for a detail lookup by `nregistro` or `cn`
- **THEN** the proxy route SHALL return a 404 with `aineAnalysis` status `YELLOW` and an empty `matchedAines` array

#### Scenario: Missing required query parameters

- **WHEN** a request is sent to `/api/cima` without any of `nombre`, `nregistro`, or `cn`
- **THEN** the route SHALL return a 400 error with a descriptive message

### Requirement: CORS bypass via server-side proxy

The CIMA proxy route SHALL execute requests server-side, eliminating browser CORS restrictions for client code.

#### Scenario: Client fetches CIMA data through proxy

- **WHEN** client-side code fetches from `/api/cima`
- **THEN** the request SHALL succeed without CORS errors, as the actual CIMA API call is made server-side

### Requirement: Enriched response shape with aineAnalysis

All successful CIMA proxy responses SHALL include an `aineAnalysis` field on each medication object with the following shape: `{ status: "RED" | "GREEN" | "YELLOW", matchedAines: Array<{ name: string, family: string }> }`.

#### Scenario: Successful search response with AINE analysis

- **WHEN** a search by nombre returns a list of medications
- **THEN** each medication object in the list SHALL include an `aineAnalysis` field with status and matchedAines

#### Scenario: Successful detail response with AINE analysis

- **WHEN** a detail lookup by `nregistro` or `cn` returns a single medication
- **THEN** the response SHALL include an `aineAnalysis` field with status and matchedAines
