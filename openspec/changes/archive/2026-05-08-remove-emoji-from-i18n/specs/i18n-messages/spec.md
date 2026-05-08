## MODIFIED Requirements

### Requirement: Status banner and message keys

The `status` namespace in the message catalog SHALL contain entries for each status level (RED, AMBER, GREEN, YELLOW). Each status level SHALL define three keys: `banner` (the status banner label, plain text without emoji), `message` (the contextual warning or safe message, plain text without emoji), and `ariaLabel` (the accessible label for screen readers). The `status` namespace SHALL also define an `activeIngredientsLabel` key for the active ingredients list aria-label.

#### Scenario: Status level has required keys

- **WHEN** a developer inspects `messages/es-ES.json`
- **THEN** the `status` namespace SHALL contain sub-namespaces `RED`, `AMBER`, `GREEN`, and `YELLOW`
- **AND** each SHALL contain `banner`, `message`, and `ariaLabel` keys
- **AND** no string value SHALL contain emoji characters
- **AND** the `status` namespace SHALL contain an `activeIngredientsLabel` key
