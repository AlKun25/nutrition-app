- Use bun as package manager for Typescript/React related commands
- This is a TypeScript project. Do not generate JS/JSX files.

## Code Style Rules

### Code Formatting

- No semicolons (enforced)
- Single quotes (enforced)
- No unnecessary curly braces (enforced)
- 2-space indentation
- Import order: external → internal → types

### General Principles

- **TypeScript**: All code must be strictly typed, leverage TypeScript's type safety features

### Code style rules

- Interfaces over types - use interfaces for object types
- Use enum for constant values, prefer them over string literals
- Export all types by default
- Use type guards instead of type assertions

### Best Practices

#### Library-First Approach

- Common areas where libraries should be preferred:
  - Date/time manipulation → date-fns, dayjs
  - Form validation → joi, yup, zod
  - HTTP requests → axios, got
  - State management → Redux, MobX, Zustand
  - Utility functions → lodash, ramda

#### Code Quality

- Use destructuring of objects where possible:
  - Instead of `const name = user.name` use `const { name } = user`
  - Instead of `const result = await getUser(userId)` use `const { data: user } = await getUser(userId)`
  - Instead of `const parseData = (data) => data.name` use `const parseData = ({ name }) => name`
- Use `ms` package for time related configuration and environment variables, instead of multiplying numbers by 1000

## Reference: docs/prd/ (PRD Documentation)

The PRD has been split into focused documents for easy navigation. Start with **[docs/prd/README.md](docs/prd/README.md)** for an index and guide to all sections.

**Quick links by task:**
- **Setting up the project?** → [docs/prd/appendix.md](docs/prd/appendix.md) (full tech stack & setup)
- **Understanding data models?** → [docs/prd/data-model.md](docs/prd/data-model.md)
- **Implementing a feature?** → [docs/prd/features.md](docs/prd/features.md) (all 5 core features)
- **Need calculations?** → [docs/prd/appendix.md#nutritional-calculation-formulas](docs/prd/appendix.md)
- **Development phases?** → [docs/prd/development-plan.md](docs/prd/development-plan.md)
- **UI requirements?** → [docs/prd/ui-requirements.md](docs/prd/ui-requirements.md)
- **Product context?** → [docs/prd/product-context.md](docs/prd/product-context.md)
- **Technical decisions?** → [docs/prd/technical-decisions.md](docs/prd/technical-decisions.md)