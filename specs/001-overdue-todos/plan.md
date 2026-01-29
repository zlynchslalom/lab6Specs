# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: January 29, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual indicators (red styling + "Overdue" badge) to identify incomplete todos with due dates before the current timestamp. The overdue status is calculated client-side using browser local time for precise timestamp comparison and updates immediately on user actions (completion status changes, due date edits).

## Technical Context

**Language/Version**: JavaScript ES6+ (Node.js 16+, React 18)
**Primary Dependencies**: React 18.2, React DOM 18.2, Express 4.18, better-sqlite3 11.10
**Storage**: SQLite (better-sqlite3) - existing todos table
**Testing**: Jest 29.7, React Testing Library 14.0, Supertest 6.3
**Target Platform**: Web (Chrome, Firefox, Safari - latest versions)
**Project Type**: Web (monorepo: packages/frontend + packages/backend)
**Performance Goals**: <100ms for overdue status calculation client-side, immediate UI updates
**Constraints**: Page refresh required for date changes (no real-time auto-refresh), single-user application
**Scale/Scope**: Visual enhancement to existing todo app, ~5 UI components affected, client-side calculation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Phase 0) ✅

### Principle I: Code Quality Through Standards
✅ **PASS** - Will follow 2-space indentation, camelCase/PascalCase naming, line length <100 chars, organized imports, ESLint compliance

### Principle II: Test-First Development
✅ **PASS** - Will write tests for overdue calculation utility, TodoCard display logic, and integration tests. Target 80%+ coverage.

### Principle III: Single Responsibility Principle
✅ **PASS** - Overdue calculation logic in utility function, visual indicator in TodoCard component, no mixed concerns

### Principle IV: DRY (Don't Repeat Yourself)
✅ **PASS** - Overdue calculation extracted to shared utility (isOverdue function), reused across all components showing todos

### Principle V: KISS (Keep It Simple, Stupid)
✅ **PASS** - Client-side timestamp comparison using native Date objects, simple conditional styling, no complex algorithms

### Principle VI: Error Handling and User Feedback
✅ **PASS** - Handle missing/invalid due dates gracefully (todos without dates never overdue), no error messages needed for visual indicators

### Principle VII: Monorepo Structure and Workspace Discipline
✅ **PASS** - Changes contained within existing packages/frontend and packages/backend structure, tests colocated in __tests__/

---

### Post-Phase 1 Re-evaluation ✅

All principles continue to pass after design phase. Key confirmations:

**Principle I (Code Quality)**: 
- ✅ quickstart.md documents proper formatting (2-space, camelCase, PascalCase)
- ✅ No linting errors expected (standard React patterns)
- ✅ Import organization follows: external → internal → styles

**Principle II (Test-First)**:
- ✅ Unit tests defined for dateUtils.js (13 test cases)
- ✅ Integration tests defined for TodoCard (6 test cases)
- ✅ Both achieve >80% coverage target
- ✅ Tests use Jest fake timers for deterministic time mocking

**Principle III (Single Responsibility)**:
- ✅ `isOverdue()` utility: single purpose (calculate overdue status)
- ✅ TodoCard component: displays todo with conditional styling
- ✅ CSS classes: separate styling concerns from logic
- ✅ No component doing multiple unrelated tasks

**Principle IV (DRY)**:
- ✅ Overdue calculation centralized in dateUtils.js
- ✅ All components import same utility (no duplication)
- ✅ CSS variables in theme.css reused across components
- ✅ No repeated logic for date comparison

**Principle V (KISS)**:
- ✅ Native Date API (no unnecessary libraries)
- ✅ Simple boolean function with clear logic flow
- ✅ Conditional CSS classes (no over-engineered state management)
- ✅ No premature optimization (useMemo not needed)

**Principle VI (Error Handling)**:
- ✅ Graceful degradation for invalid dates (returns false)
- ✅ Handles null/undefined dueDates safely
- ✅ Development warnings for invalid formats
- ✅ No user-facing errors (silent fail with logging)

**Principle VII (Monorepo Structure)**:
- ✅ Changes in packages/frontend only (backend unchanged)
- ✅ Tests colocated: utils/__tests__/, components/__tests__/
- ✅ No new packages or workspaces created
- ✅ Follows existing project structure

**Final Status**: ✅ **ALL GATES PASSED** - Ready to proceed to Phase 2 (task breakdown)

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TodoCard.js           # Modified: Add overdue visual indicator
│       │   └── __tests__/
│       │       └── TodoCard.test.js  # Modified: Add overdue display tests
│       └── utils/
│           ├── dateUtils.js          # New: Overdue calculation logic
│           └── __tests__/
│               └── dateUtils.test.js # New: Unit tests for isOverdue()
└── backend/
    └── src/
        └── services/
            └── todoService.js         # No changes needed (data model already supports dueDate)
```

**Structure Decision**: Web application structure (Option 2). This feature is frontend-focused with client-side overdue calculation. Backend requires no changes as the existing dueDate field (ISO timestamp string) already provides necessary data.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles pass for this feature implementation.

---

## Phase Completion Summary

### ✅ Phase 0: Research & Outline (COMPLETED)

**Deliverable**: [research.md](research.md)

**Key Decisions Made**:
1. **Timestamp Comparison**: Native JavaScript Date API (no external dependencies)
2. **Conditional Styling**: CSS classes with dedicated overdue styles (follows existing patterns)
3. **Accessibility**: Combined color + text badge approach (WCAG 2.1 compliant)
4. **Test Strategy**: Jest timer mocks for deterministic time-based testing
5. **Performance**: Client-side calculation (O(1), <1ms per todo)

**All NEEDS CLARIFICATION items resolved**: Zero unknowns remaining.

---

### ✅ Phase 1: Design & Contracts (COMPLETED)

**Deliverables**:
- [data-model.md](data-model.md) - Overdue as derived property, no schema changes
- [contracts/api-contract.md](contracts/api-contract.md) - No API modifications required
- [quickstart.md](quickstart.md) - Complete developer implementation guide

**Key Design Outputs**:
1. **Data Model**: Overdue is a derived boolean property calculated from `dueDate` and `completed` fields
2. **API Contract**: Existing endpoints provide all necessary data; zero backend changes
3. **Component Changes**: TodoCard modified, new dateUtils utility created
4. **Test Coverage**: 13 unit tests + 6 integration tests defined

**Constitution Re-evaluation**: ✅ All principles pass post-design

---

### 📋 Phase 2: Task Breakdown (NEXT STEP)

**Command**: `/speckit.tasks`

**Will Generate**: `specs/001-overdue-todos/tasks.md`

**Expected Output**: Independent, P0/P1/P2 prioritized tasks based on user stories in spec.md

---

## Implementation Readiness

**Status**: ✅ **READY FOR IMPLEMENTATION**

All planning phases complete. Developers can proceed with implementation using the quickstart guide.

**Estimated Effort**: 2-4 hours for experienced React developer
- Phase 1 (Utility): 30 minutes
- Phase 2 (Tests): 45 minutes  
- Phase 3 (Component): 45 minutes
- Phase 4 (Integration Tests): 30 minutes
- Phase 5 (CSS): 30 minutes
- Phase 6 (Browser Testing): 30 minutes

**Risk Level**: 🟢 **LOW**
- No backend changes
- No API modifications
- No database migrations
- Simple client-side logic
- Well-defined test strategy
- Clear acceptance criteria

**Dependencies**: None (existing dueDate field sufficient)

**Blockers**: None identified
