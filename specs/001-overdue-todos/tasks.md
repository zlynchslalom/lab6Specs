# Tasks: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Date**: January 29, 2026  
**Input**: Design documents from `/specs/001-overdue-todos/`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with monorepo structure:
- **Frontend**: `packages/frontend/src/`
- **Backend**: `packages/backend/src/` (no changes needed for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure for new utility module

- [ ] T001 Create utils directory in packages/frontend/src/ (if not exists)
- [ ] T002 [P] Create __tests__ directory in packages/frontend/src/utils/ (if not exists)

**Checkpoint**: Directory structure ready for utility implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core overdue calculation utility that ALL user stories depend on

**⚠️ CRITICAL**: This phase must be complete before any user story work can begin

- [ ] T003 Create isOverdue utility function in packages/frontend/src/utils/dateUtils.js
- [ ] T004 Write unit tests for isOverdue (null/undefined dates) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T005 Write unit tests for isOverdue (completed todos) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T006 Write unit tests for isOverdue (past due dates) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T007 Write unit tests for isOverdue (future due dates) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T008 Write unit tests for isOverdue (invalid date formats) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T009 Write unit tests for isOverdue (boundary cases - midnight, exact current time) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T010 Run unit tests and verify 100% coverage for dateUtils.js

**Checkpoint**: Foundation ready - isOverdue utility is tested and working. User story implementation can now begin.

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which incomplete todos are past their due date through visual indicators (red styling + "Overdue" badge)

**Independent Test**: Create todos with past due dates and verify they display red left border and "Overdue" badge. Complete an overdue todo and verify indicators disappear immediately.

### Implementation for User Story 1

- [ ] T011 [US1] Import isOverdue utility in packages/frontend/src/components/TodoCard.js
- [ ] T012 [US1] Add overdue status calculation in TodoCard component (call isOverdue with todo.dueDate and todo.completed)
- [ ] T013 [US1] Add conditional 'overdue' CSS class to todo-card container based on overdue status
- [ ] T014 [US1] Add conditional rendering of overdue badge element when overdue is true
- [ ] T015 [P] [US1] Define .todo-card.overdue styles in packages/frontend/src/components/TodoCard.css (red left border, light red background)
- [ ] T016 [P] [US1] Define .overdue-badge styles in packages/frontend/src/components/TodoCard.css (red background, white text, padding, border-radius)
- [ ] T017 [P] [US1] Add dark mode overdue styles in packages/frontend/src/components/TodoCard.css
- [ ] T018 [P] [US1] Add overdue color variables to packages/frontend/src/styles/theme.css (--danger-color, --danger-bg-light, --danger-bg-dark)
- [ ] T019 [US1] Write integration test: overdue badge displays for incomplete past due todo in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T020 [US1] Write integration test: overdue badge NOT displayed for completed past due todo in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T021 [US1] Write integration test: overdue badge NOT displayed for future due date in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T022 [US1] Write integration test: overdue badge NOT displayed for todo without due date in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T023 [US1] Run integration tests and verify all TodoCard overdue tests pass
- [ ] T024 [US1] Manual browser test: Create todo with past due date and verify red border and "Overdue" badge appear
- [ ] T025 [US1] Manual browser test: Complete overdue todo and verify indicators disappear immediately

**Checkpoint**: User Story 1 complete - Users can visually identify overdue todos. This is the MVP!

---

## Phase 4: User Story 2 - Persistent Overdue Status Through Date Changes (Priority: P2)

**Goal**: Overdue status updates to reflect the current date whenever the page is loaded or refreshed

**Independent Test**: Create a todo with tomorrow's date, simulate time passing (or adjust system time), refresh page, and verify todo now shows as overdue.

### Implementation for User Story 2

- [ ] T026 [US2] Write integration test: future todo becomes overdue after date change and page refresh in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T027 [US2] Write integration test: editing overdue todo to future date removes overdue indicator immediately in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T028 [US2] Write integration test: multiple todos with different due dates show correct overdue status in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T029 [US2] Run integration tests and verify User Story 2 tests pass
- [ ] T030 [US2] Manual browser test: Create todo with tomorrow's date
- [ ] T031 [US2] Manual browser test: Change system date to tomorrow (or wait), refresh page, verify todo is now marked overdue
- [ ] T032 [US2] Manual browser test: Edit overdue todo to extend due date to future, verify overdue indicator disappears

**Checkpoint**: User Story 2 complete - Overdue status persists correctly through date changes

---

## Phase 5: User Story 3 - Consistent Overdue Indication Across Actions (Priority: P3)

**Goal**: Overdue visual indicator remains consistent throughout all todo interactions (creating, editing, viewing)

**Independent Test**: Create a new todo with past due date and verify it immediately shows overdue. Edit an overdue todo and verify status is visible in form. Perform actions on one todo and verify other overdue indicators remain consistent.

### Implementation for User Story 3

- [ ] T033 [US3] Write integration test: newly created todo with past due date immediately shows overdue indicator in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T034 [US3] Write integration test: overdue indicators remain consistent when performing actions (delete, complete, edit) on other todos in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T035 [US3] Run integration tests and verify User Story 3 tests pass
- [ ] T036 [US3] Manual browser test: Create new todo with past due date, verify overdue badge appears immediately
- [ ] T037 [US3] Manual browser test: Have multiple overdue todos, delete one, verify others still show overdue indicators
- [ ] T038 [US3] Manual browser test: Edit overdue todo (form interaction), verify overdue status is clear in UI

**Checkpoint**: User Story 3 complete - Overdue indicators are consistent across all interactions

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and validation

- [ ] T039 [P] Verify all tests pass with npm test --workspace=frontend
- [ ] T040 [P] Verify code coverage meets 80%+ target for modified files
- [ ] T041 [P] Run linter and fix any warnings/errors
- [ ] T042 [P] Test in both light and dark modes
- [ ] T043 [P] Test accessibility: verify "Overdue" badge is announced by screen readers
- [ ] T044 [P] Test keyboard navigation: ensure all interactive elements are focusable
- [ ] T045 Verify no console.log statements remain in production code
- [ ] T046 Cross-browser test: verify feature works in Chrome, Firefox, Safari
- [ ] T047 Review code against constitution principles (DRY, KISS, Single Responsibility)
- [ ] T048 Update any relevant documentation if needed

**Checkpoint**: Feature complete and polished, ready for code review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if multiple developers)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational phase - No dependencies on other stories ✅ MVP-ready
- **User Story 2 (P2)**: Depends only on Foundational phase - Independently testable, but builds on US1 UI
- **User Story 3 (P3)**: Depends only on Foundational phase - Independently testable, validates US1 and US2 consistency

### Within Each User Story

1. Implementation tasks before tests (or tests-first if doing TDD)
2. CSS styles can be developed in parallel with component logic
3. Integration tests after implementation
4. Manual browser tests last

### Parallel Opportunities

**Phase 1 (Setup)**: Both tasks can run in parallel

**Phase 2 (Foundational)**: 
- T003 (utility function) must complete first
- T004-T009 (unit tests) can all run in parallel after T003
- T010 (run tests) must be last

**Phase 3 (User Story 1)**:
- T015, T016, T017, T018 (CSS/styles) can all run in parallel
- T011-T014 (component logic) are sequential
- T019-T022 (integration tests) can run in parallel after implementation
- T024-T025 (manual tests) run last

**Phase 4 (User Story 2)**:
- T026-T028 (integration tests) can run in parallel
- T030-T032 (manual tests) are sequential

**Phase 5 (User Story 3)**:
- T033-T034 (integration tests) can run in parallel
- T036-T038 (manual tests) are sequential

**Phase 6 (Polish)**:
- T039, T040, T041, T042, T043, T044 can all run in parallel
- T045-T048 are quick checks and can run sequentially

---

## Parallel Example: Phase 2 (Foundational)

After T003 completes, launch all unit tests together:

```bash
# All these test tasks can run in parallel:
Task: T004 - "Write unit tests for isOverdue (null/undefined dates)"
Task: T005 - "Write unit tests for isOverdue (completed todos)"
Task: T006 - "Write unit tests for isOverdue (past due dates)"
Task: T007 - "Write unit tests for isOverdue (future due dates)"
Task: T008 - "Write unit tests for isOverdue (invalid date formats)"
Task: T009 - "Write unit tests for isOverdue (boundary cases)"
```

## Parallel Example: Phase 3 (User Story 1)

CSS styling tasks can run in parallel:

```bash
# All these CSS tasks can run in parallel:
Task: T015 - "Define .todo-card.overdue styles in TodoCard.css"
Task: T016 - "Define .overdue-badge styles in TodoCard.css"
Task: T017 - "Add dark mode overdue styles in TodoCard.css"
Task: T018 - "Add overdue color variables to theme.css"
```

Integration tests can run in parallel:

```bash
# All these test tasks can run in parallel:
Task: T019 - "Test: overdue badge displays for incomplete past due todo"
Task: T020 - "Test: overdue badge NOT displayed for completed past due todo"
Task: T021 - "Test: overdue badge NOT displayed for future due date"
Task: T022 - "Test: overdue badge NOT displayed for todo without due date"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~5 minutes)
2. Complete Phase 2: Foundational (~45 minutes)
   - **CRITICAL**: This creates the isOverdue utility that everything depends on
3. Complete Phase 3: User Story 1 (~90 minutes)
   - Component changes, CSS styling, tests
4. **STOP and VALIDATE**: Test User Story 1 independently
5. If satisfied, deploy MVP with just visual identification feature
6. Estimated total: **2-2.5 hours for MVP**

### Incremental Delivery

1. **Foundation** (Phase 1-2): ~50 minutes
   - Utility function with comprehensive tests
   - Foundation blocks all stories but enables parallel work afterward
2. **MVP** (Phase 3): ~90 minutes
   - User Story 1: Visual identification of overdue todos
   - Test independently → Deploy/Demo
3. **Enhancement** (Phase 4): ~30 minutes
   - User Story 2: Persistent overdue status through date changes
   - Test independently → Deploy/Demo
4. **Polish** (Phase 5): ~20 minutes
   - User Story 3: Consistent indication across actions
   - Test independently → Deploy/Demo
5. **Final** (Phase 6): ~20 minutes
   - Cross-cutting concerns and polish

**Total estimated effort**: 3.5-4 hours for complete feature

### Parallel Team Strategy

With multiple developers:

1. **Together**: Complete Phase 1 (Setup) and Phase 2 (Foundational)
2. **After Foundational completes**:
   - Developer A: Phase 3 (User Story 1) - Core feature
   - Developer B: Phase 4 (User Story 2) - Date persistence (starts with tests)
   - Developer C: Phase 5 (User Story 3) - Consistency (starts with tests)
3. **Merge order**: US1 → US2 → US3 → Polish
4. Each story is independently testable and valuable

**Benefits of parallel approach**:
- Faster delivery (2 hours with 3 developers vs 3.5 hours with 1)
- Independent testing reduces integration issues
- Can stop at any user story if time is limited
- Each merge adds incremental value

---

## Task Summary

**Total Tasks**: 48 tasks
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 8 tasks (CRITICAL - blocks all stories)
- Phase 3 (User Story 1 - P1): 15 tasks
- Phase 4 (User Story 2 - P2): 7 tasks
- Phase 5 (User Story 3 - P3): 6 tasks
- Phase 6 (Polish): 10 tasks

**Parallel Opportunities**:
- Phase 1: 1 parallel task
- Phase 2: 6 parallel tasks (tests)
- Phase 3: 8 parallel tasks (4 CSS, 4 integration tests)
- Phase 4: 3 parallel tasks (tests)
- Phase 5: 2 parallel tasks (tests)
- Phase 6: 6 parallel tasks (validation)

**MVP Scope**: Phases 1-3 (25 tasks, ~2.5 hours)
**Full Feature**: All phases (48 tasks, ~3.5-4 hours)

---

## Validation Checklist

Before marking feature complete:

- [ ] All unit tests pass (13+ test cases)
- [ ] All integration tests pass (12+ test cases)
- [ ] Code coverage ≥80% for dateUtils.js and TodoCard.js
- [ ] No ESLint errors or warnings
- [ ] Visual indicators work in light and dark modes
- [ ] Accessibility: "Overdue" text announced by screen readers
- [ ] Keyboard navigation works for all interactive elements
- [ ] Cross-browser compatibility verified (Chrome, Firefox, Safari)
- [ ] All acceptance scenarios from spec.md pass
- [ ] Performance: overdue calculation <100ms
- [ ] Constitution principles verified (DRY, KISS, Single Responsibility, etc.)
- [ ] No console.log statements in production code
- [ ] Manual testing completed per quickstart.md scenarios

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Critical Path**: Phase 2 (Foundational) blocks everything - prioritize this
- **MVP First**: Stop after Phase 3 for quickest value delivery
- **Test-First Recommended**: Write tests before implementation (TDD)
- **Commit Strategy**: Commit after each task or logical group
- **Independent Stories**: Each user story should work standalone
- **Stop at Checkpoints**: Validate each story independently before moving to next

**Next Steps**: Begin with Phase 1 (Setup), then immediately move to Phase 2 (Foundational) as it blocks all user story work.
