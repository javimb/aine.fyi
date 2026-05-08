## Context

The app currently has ~32 hardcoded Spanish UI strings spread across 9 source files (8 components/pages, 1 API route). There is no i18n infrastructure. All strings are inline in JSX and object constants, making them difficult to review as a group — a medical professional reviewing patient-facing text must read through every component file.

The app is a single-locale (es-ES) Next.js 16 App Router application using shadcn/ui and @base-ui/react.

## Goals / Non-Goals

**Goals:**

- Centralize all UI strings into a single `messages/es-ES.json` file that can be handed to a medical reviewer
- Use next-intl with the Provider-Only pattern (no `[locale]` route segment, no middleware)
- Preserve the existing URL structure (no `/es` prefix)
- Support type-safe message key access via next-intl's TypeScript integration
- Support metadata strings (title, description) via `generateMetadata` + `getTranslations`
- Handle singular/plural patterns (ICU message format)
- Include all user-facing strings: client components, server components, and API error responses

**Non-Goals:**

- Adding additional locales (en, ca, etc.) — this establishes the pattern but only ships es-ES
- Locale detection/negotiation middleware
- Dynamic locale switching UI
- URL-based locale routing (`/[locale]/...`)

## Decisions

### 1. Provider-Only pattern (no route segment)

**Decision**: Use next-intl without a `[locale]` route segment. The locale is fixed to `es-ES` in configuration.

**Rationale**: The app serves a single locale. Adding `/es` to every URL adds routing complexity with no user benefit. If additional locales are needed later, the next-intl docs document a clear upgrade path to the routing pattern.

**Alternative considered**: Full i18n routing with `[locale]` segment — rejected because it restructures the entire `app/` directory and adds middleware overhead for a single-locale site.

### 2. Message file location: `messages/es-ES.json`

**Decision**: Store messages in `messages/es-ES.json` at the project root (next-intl convention).

**Rationale**: This is the next-intl default location. A medical reviewer can read this file top-to-bottom without navigating source code. The nested JSON structure mirrors the component hierarchy for easy-to-find strings.

### 3. Configuration: `src/i18n/`

**Decision**: Create `src/i18n/config.ts` (locale list and default) and `src/i18n/request.ts` (getRequestConfig). No middleware file.

**Rationale**: `getRequestConfig` is required by next-intl even in Provider-Only mode. Keeping config separate from messages makes the locale-to-file mapping explicit and easy to modify when adding locales.

### 4. Component integration pattern

**Decision**:

- **Client components** use `useTranslations('namespace')` hook
- **Server components** use `getTranslations('namespace')` async function
- **Metadata** uses `generateMetadata` with `getTranslations()`

**Rationale**: This is the standard next-intl integration for App Router. Server components can't use hooks, so they use the async `getTranslations`. Metadata is generated server-side, so it uses `getTranslations` inside `generateMetadata`.

### 5. API route error messages included in message catalog

**Decision**: The 3 error strings in `api/cima/route.ts` are included in `messages/es-ES.json` under an `api` namespace.

**Rationale**: These strings are user-facing (returned in JSON error responses displayed to the user). Including them in the catalog makes them reviewable by a medical professional alongside all other text. The API route will import the messages file directly since `useTranslations`/`getTranslations` are React-specific.

### 6. STATUS_CONFIG string extraction

**Decision**: Extract `banner` and `message` from `STATUS_CONFIG` into the message catalog. Style properties (`bg`, `text`) remain in the component.

**Rationale**: `STATUS_CONFIG` currently mixes display logic (CSS classes) with user-facing text. Splitting them lets the message catalog own all strings while the component owns styling. The `banner` and `message` become `t('status.red.banner')`, `t('status.red.message')`, etc.

### 7. Pluralization via ICU format

**Decision**: Use ICU message format for the `"1 resultado" / "N resultados"` pattern.

**Rationale**: next-intl supports ICU `{count, plural, one {resultado} other {resultados}}` natively. This is more correct than a ternary (Spanish has more plural forms in theory) and makes adding locales easier later.

## Risks / Trade-offs

- **[Migration to routing later requires restructuring]** → The upgrade path from Provider-Only to `[locale]` routing is well-documented by next-intl. It involves moving `app/layout.tsx` and `app/page.tsx` into `app/[locale]/` and adding middleware. Straightforward but not zero-cost.

- **[API route string access is non-standard]** → API routes can't use React hooks. They'll import the message JSON directly. This creates two string access patterns (hook vs. direct import), but both resolve to the same source of truth. Documented in code comments.

- **[Message key naming must be intentional]** → If key names are poorly chosen, refactor is painful. Using component-based namespaces (`search`, `status`, `results`, etc.) keeps keys organized and predictable.

- **[next-intl bundle adds ~15KB]** → Acceptable for the reviewability and future-proofing benefit. Tree-shaking helps since we only use the Provider mode.
