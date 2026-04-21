## ADDED Requirements

### Requirement: CIMA API proxy route
The project SHALL expose a Next.js API route at `/api/cima` that proxies requests to the CIMA (Información de Medicamentos) API.

#### Scenario: Proxying a valid drug lookup
- **WHEN** a GET request is sent to `/api/cima?nombre=<drug-name>`
- **THEN** the route SHALL forward the request to the CIMA API and return the response JSON to the client

#### Scenario: Handling CIMA API errors
- **WHEN** the CIMA API returns an error status code (4xx or 5xx)
- **THEN** the proxy route SHALL return an appropriate error response to the client without exposing internal CIMA details

### Requirement: CORS bypass via server-side proxy
The CIMA proxy route SHALL execute requests server-side, eliminating browser CORS restrictions for client code.

#### Scenario: Client fetches CIMA data through proxy
- **WHEN** client-side code fetches from `/api/cima`
- **THEN** the request SHALL succeed without CORS errors, as the actual CIMA API call is made server-side

### Requirement: Type-safe CIMA query interface
The proxy route SHALL accept well-defined query parameters and return typed responses.

#### Scenario: Missing required query parameters
- **WHEN** a request is sent to `/api/cima` without the required query parameter
- **THEN** the route SHALL return a 400 error with a descriptive message