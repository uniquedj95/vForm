# Form Builder Test Documentation

## Test Suite

The project has comprehensive unit tests for the Vue components using Vitest. Three main component test suites have been fixed:

### VForm Tests (`vForm.spec.ts`)

Tests the main form component that manages schema and validation:

- Verifies form rendering based on schema
- Tests form submission events
- Validates error handling functionality
- Checks form reset capability
- Tests conditional field validation

### EmailInput Tests (`EmailInput.spec.ts`)

Tests the email input component:

- Validates email format
- Tests error state handling
- Verifies component props
- Tests value updates

### SelectInput Tests (`SelectInput.spec.ts`)

Tests the dropdown select component:

- Verifies component rendering
- Tests value selection
- Validates option display

## CI/CD Pipeline

The GitHub Actions workflow (`ci.yml`) runs three main jobs:

1. **Lint**: Checks code quality using ESLint

   - `npm run lint`

2. **Test**: Runs unit tests with coverage reporting

   - `npm run test:coverage`
   - Uploads coverage report as artifact

3. **Build**: Builds the package for publishing
   - `npm run build`
   - Uploads build artifacts

## Local Development

To simulate the CI pipeline locally, you can run:

```bash
# Run linting
npm run lint

# Run tests
npm test

# Build package
npm run build

# Or use the simulation script
./scripts/simulate-ci.sh
```

## Versioning

To create a new version:

```bash
# For patch release (bug fixes)
npm run version:patch

# For minor release (new features)
npm run version:minor

# For major release (breaking changes)
npm run version:major
```

These commands will update the version in package.json and README.md.
