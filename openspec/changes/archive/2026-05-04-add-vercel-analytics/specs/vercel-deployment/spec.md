## MODIFIED Requirements

### Requirement: Vercel project configuration in code

The project SHALL include a `vercel.json` file at the repository root with region configuration set to `cdg1` (Paris), the closest available Vercel region to Spain, ensuring all serverless functions execute close to the CIMA API data source. The project SHALL also have Web Analytics enabled, either via the Vercel Dashboard or the `vercel analytics enable` CLI command.

#### Scenario: Deploying to the correct region

- **WHEN** Vercel deploys the application
- **THEN** all serverless functions SHALL execute in the `cdg1` region

#### Scenario: Region configuration is version-controlled

- **WHEN** a developer inspects the repository
- **THEN** the region setting SHALL be defined in `vercel.json`, not only in the Vercel Dashboard

#### Scenario: Web Analytics is enabled on the project

- **WHEN** the Vercel project is deployed
- **THEN** Web Analytics SHALL be enabled and collecting page view and visitor data
