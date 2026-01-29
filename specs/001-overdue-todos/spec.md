# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: January 29, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

Users can immediately see which of their incomplete todos are past their due date through visual indicators. When viewing their todo list, any incomplete todo with a due date earlier than today is visually distinguished from other todos.

**Why this priority**: This is the core value proposition of the feature. Without visual identification, users cannot achieve the primary goal of quickly spotting overdue items, making this the minimum viable functionality.

**Independent Test**: Can be fully tested by creating todos with past due dates and verifying they are visually distinct. Delivers immediate value by allowing users to identify overdue items at a glance without manual date checking.

**Acceptance Scenarios**:

1. **Given** a todo list with multiple todos, **When** viewing the list and a todo has a due date in the past and is not completed, **Then** the todo is displayed with a clear visual indicator (such as distinct color, icon, or text label) that distinguishes it from non-overdue todos
2. **Given** a todo is marked as overdue, **When** the user completes the todo, **Then** the overdue visual indicator is removed immediately
3. **Given** a todo has a due date of today, **When** viewing the todo list, **Then** the todo is not marked as overdue (only items with due dates before today are overdue)

---

### User Story 2 - Persistent Overdue Status Through Date Changes (Priority: P2)

The overdue status of todos automatically updates as dates change. When a new day begins, todos that become overdue automatically display the overdue visual indicator without requiring page refresh or manual action.

**Why this priority**: This ensures data accuracy and reduces user confusion, but the feature still works if users need to refresh the page to see updated statuses. This is important for user experience but not critical for basic functionality.

**Independent Test**: Can be tested by creating a todo with tomorrow's date, then simulating a day passing (or adjusting system time), and verifying the todo becomes marked as overdue. Delivers value by maintaining accurate overdue status without user intervention.

**Acceptance Scenarios**:

1. **Given** a todo with a due date of tomorrow, **When** the date changes to the next day (the todo's due date passes), **Then** the todo automatically displays the overdue visual indicator
2. **Given** an overdue todo, **When** the user edits the todo to extend the due date to a future date, **Then** the overdue visual indicator is removed immediately
3. **Given** multiple todos with different due dates, **When** viewing the list over multiple days, **Then** each todo's overdue status reflects its current relationship to today's date

---

### User Story 3 - Consistent Overdue Indication Across Actions (Priority: P3)

The overdue visual indicator remains consistent and visible throughout all todo interactions, including when creating, editing, and viewing todos in different contexts.

**Why this priority**: This enhances usability and prevents confusion, but the core feature works even if there are minor inconsistencies in how overdue status is displayed in different contexts.

**Independent Test**: Can be tested by verifying overdue indicators display correctly in the todo form when editing, after creating a new overdue todo, and in all views of the todo list. Delivers polish and consistency to the feature.

**Acceptance Scenarios**:

1. **Given** a user is creating a new todo, **When** they set a due date in the past and save the todo, **Then** the newly created todo immediately displays with the overdue visual indicator
2. **Given** a user is editing an overdue todo, **When** the edit form is displayed, **Then** the overdue status is clearly visible in the form
3. **Given** multiple overdue todos in the list, **When** performing any action (delete, complete, edit), **Then** the overdue visual indicators on other todos remain visible and consistent

---

### Edge Cases

- What happens when a todo has no due date? (The todo should never be marked as overdue since there is no date to compare against)
- What happens when the system date/time is incorrect? (The overdue status will be determined based on the system's current date, which may be incorrect)
- What happens when viewing todos at exactly midnight? (Todos with today's date should not be overdue; only dates before today should be overdue)
- What happens when a user edits a todo's due date from future to past? (The overdue indicator should appear immediately upon saving)
- What happens when a completed todo becomes overdue (due to date passing after completion)? (Completed todos should never show overdue indicators, regardless of their due date)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compare each incomplete todo's due date against the current date to determine overdue status
- **FR-002**: System MUST apply a distinct visual indicator to todos that are overdue (due date is before today's date and todo is not completed)
- **FR-003**: System MUST exclude completed todos from overdue visual indicators, regardless of their due date
- **FR-004**: System MUST exclude todos without due dates from overdue visual indicators
- **FR-005**: System MUST update overdue status immediately when a todo's completion status changes (from incomplete to complete or vice versa)
- **FR-006**: System MUST update overdue status immediately when a todo's due date is modified
- **FR-007**: System MUST treat todos with today's date as not overdue (only past dates are overdue)
- **FR-008**: System MUST display overdue indicators consistently across all views where todos are displayed
- **FR-009**: System MUST determine "today's date" based on the user's local date/time
- **FR-010**: System MUST maintain visual distinction that is clear and easily noticeable for users to identify overdue items quickly

### Key Entities

- **Todo Item**: Existing entity with attributes including title, due date (optional), completion status, and created date. The overdue status is a derived property based on the relationship between the due date and current date, combined with completion status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify which todos are overdue within 2 seconds of viewing their todo list
- **SC-002**: 95% of users correctly identify overdue todos on first glance without reading dates manually
- **SC-003**: Overdue status updates reflect immediately (within 100ms) when users complete a todo or change its due date
- **SC-004**: Zero completed todos display overdue indicators, ensuring accuracy of overdue identification
- **SC-005**: Users report improved task prioritization and reduced time spent manually checking due dates (qualitative feedback)
