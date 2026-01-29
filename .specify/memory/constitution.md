<!--
SYNC IMPACT REPORT
==================
Version Change: NONE → 1.0.0
Change Type: MAJOR (Initial constitution ratification)

Modified Principles:
- All principles are new (initial creation)

Added Sections:
- Core Principles (7 principles)
- Code Quality Standards
- Development Workflow
- Governance

Removed Sections:
- None (initial creation)

Templates Requiring Updates:
✅ plan-template.md - Reviewed, Constitution Check section already supports dynamic principles
✅ spec-template.md - Reviewed, requirements structure aligns with functional requirements principle
✅ tasks-template.md - Reviewed, test-first and independent story structure aligns with testing and simplicity principles

Follow-up TODOs:
- None - all placeholders filled

Rationale for Version 1.0.0:
This is the initial ratification of the project constitution, establishing foundational
governance for the Todo App bootcamp project. Version starts at 1.0.0 to indicate a
complete and production-ready governance framework.
-->

# Todo App Bootcamp Constitution

## Core Principles

### I. Code Quality Through Standards (NON-NEGOTIABLE)

All code MUST follow established formatting and naming conventions:
- 2-space indentation for all files (JavaScript, JSON, CSS, Markdown)
- camelCase for variables/functions, PascalCase for components/classes, UPPER_SNAKE_CASE for constants
- Line length under 100 characters
- Import organization: external libraries → internal modules → styles, separated by blank lines
- ESLint rules MUST pass before commits; no linting errors in pull requests

**Rationale**: Consistent code style eliminates friction in code reviews, reduces cognitive load when reading code, and prevents style debates. Automated linting catches errors early and enforces standards objectively.

### II. Test-First Development (NON-NEGOTIABLE)

Testing is mandatory and follows Test-Driven Development principles:
- 80%+ code coverage target across all packages
- Tests written alongside or before implementation
- All tests MUST pass before pull request approval
- Test behavior, not implementation details
- Tests MUST be independent, isolated, and use mocked dependencies
- Use Jest with React Testing Library for frontend, Jest for backend

**Rationale**: TDD catches bugs early, documents expected behavior, enables confident refactoring, and ensures maintainability. The 80% coverage target balances thoroughness with pragmatism.

### III. Single Responsibility Principle

Every module, component, and function MUST have one well-defined responsibility:
- Components handle one UI concern (display, form, dialog)
- Functions perform one logical operation
- Services encapsulate one domain area
- One reason to change per unit of code

**Rationale**: Single responsibility makes code easier to understand, test, and maintain. It prevents god objects and promotes reusability through clear, focused interfaces.

### IV. DRY (Don't Repeat Yourself)

Code duplication MUST be eliminated through extraction and abstraction:
- Extract repeated code into shared utilities or components
- Create reusable UI components across the application
- Build utility modules for common operations (formatting, validation, API calls)
- When code appears in 2+ places, refactor into shared location

**Rationale**: DRY reduces maintenance burden—fixing bugs or adding features only requires changes in one place. It also improves consistency and reduces codebase size.

### V. KISS (Keep It Simple, Stupid)

Prefer simple, straightforward implementations:
- Choose clarity over cleverness
- Break complex logic into smaller, understandable functions
- Avoid premature optimization—write clear code first
- Code should be readable at first glance

**Rationale**: Simple code is easier to understand, debug, maintain, and onboard new developers to. Complexity should only be introduced when justified by measurable requirements.

### VI. Error Handling and User Feedback

All operations that can fail MUST handle errors gracefully:
- Wrap fallible operations in try-catch blocks
- Provide meaningful, actionable error messages
- Inform users when operations fail with clear feedback
- Log errors with sufficient context for debugging
- No silent failures

**Rationale**: Graceful error handling prevents crashes, guides users toward resolution, and provides developers with debugging information. User trust depends on clear communication when things go wrong.

### VII. Monorepo Structure and Workspace Discipline

The project follows npm workspaces monorepo architecture:
- Frontend package: `packages/frontend/` (React application)
- Backend package: `packages/backend/` (Express.js API)
- Dependencies managed at workspace root
- Tests colocated in `__tests__/` directories alongside source
- Run scripts from root: `npm run start`, `npm test`

**Rationale**: Monorepo structure keeps related frontend and backend code together, simplifies dependency management, enables atomic commits across both packages, and provides a single source of truth for the application.

## Code Quality Standards

### Import Organization Requirements
All import statements MUST follow this order:
1. External libraries (React, Express, testing libraries)
2. Internal modules (services, utilities, components)
3. Styles (CSS imports)

Each group separated by a blank line. Use relative paths for internal modules.

### SOLID Principles Application
- **Open/Closed**: Extend behavior via props and composition, not modification
- **Liskov Substitution**: Follow React component contracts consistently
- **Interface Segregation**: Pass only necessary props; keep interfaces minimal
- **Dependency Inversion**: Inject dependencies; use context or props appropriately

### Documentation Standards
- Comment "why," not "what" the code does
- Keep comments updated—outdated comments are worse than none
- Avoid obvious comments
- Use JSDoc for public functions and components

### Git Commit Practices
- Atomic commits: one logical change per commit
- Descriptive commit messages explaining the "why"
- Feature branches for new work: `feature/[name]`
- Pull requests required for code review before merge

## Development Workflow

### Code Review Checklist
Before submitting code for review, verify:
- [ ] Code follows naming conventions
- [ ] Imports organized correctly
- [ ] No linting errors or warnings
- [ ] Code is DRY with no duplication
- [ ] Functions/components have single responsibility
- [ ] Error handling implemented for fallible operations
- [ ] Comments are clear, updated, and meaningful
- [ ] Tests written and passing for new functionality
- [ ] Git commits are atomic and well-described
- [ ] No console.log statements in production code

### Testing Workflow
Tests MUST be organized as:
- **Unit tests**: Individual components, functions, utilities in isolation
- **Integration tests**: Component interactions, API communication
- Tests colocated in `__tests__/` directories
- Run `npm test` from root before committing
- Generate coverage with `npm test -- --coverage`

### File Organization
- Frontend: `src/components/`, `src/services/`, `src/utils/`
- Backend: `src/routes/`, `src/controllers/`, `src/services/`
- Tests: `__tests__/` directories colocated with source files

## Governance

This constitution supersedes all other coding practices and guidelines. All code contributions MUST comply with these principles.

### Amendment Process
1. Propose amendment with clear rationale and impact analysis
2. Document affected areas (code, templates, workflows)
3. Increment version following semantic versioning:
   - **MAJOR**: Backward incompatible governance changes, principle removals/redefinitions
   - **MINOR**: New principles added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Update dependent templates and documentation

### Compliance Review
- All pull requests MUST verify compliance with constitution principles
- Code reviews MUST reference constitution when providing feedback
- Complexity MUST be justified when deviating from simplicity principle
- Constitution violations require explicit justification and approval

### Documentation Reference
Runtime development guidance available in:
- `docs/coding-guidelines.md` - Detailed coding standards and examples
- `docs/testing-guidelines.md` - Comprehensive testing strategy
- `docs/functional-requirements.md` - Feature requirements and scope
- `docs/project-overview.md` - Architecture and technology stack
- `docs/ui-guidelines.md` - Design system and UI standards

**Version**: 1.0.0 | **Ratified**: 2026-01-29 | **Last Amended**: 2026-01-29
