# Data Model: Overdue Todo Items Feature

**Feature**: Overdue Todo Items
**Date**: January 29, 2026
**Phase**: 1 - Design & Contracts

## Overview

This document describes the data model for the overdue todo items feature. The existing Todo entity requires no schema changes; overdue status is a **derived property** calculated client-side from existing fields.

## Entities

### Todo Item (Existing - No Changes)

**Storage**: SQLite database (`todos` table)
**Location**: `packages/backend/src/services/todoService.js`

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique identifier for todo |
| `title` | TEXT | NOT NULL, max 255 chars | Todo description |
| `dueDate` | TEXT | NULLABLE, ISO 8601 format | Due date and time (e.g., "2026-01-29T14:30:00.000Z") |
| `completed` | INTEGER | NOT NULL, 0 or 1 | Completion status (0 = incomplete, 1 = complete) |
| `createdAt` | TEXT | NOT NULL, ISO 8601 format | Creation timestamp |

**Note**: SQLite stores all values as TEXT, INTEGER, REAL, or BLOB. Dates are stored as TEXT in ISO 8601 format for portability and easy parsing.

#### Existing Validation Rules

- `title`: Required, non-empty after trimming, max 255 characters
- `dueDate`: Optional, must be valid ISO 8601 string if provided
- `completed`: Boolean (0 or 1)
- `createdAt`: Auto-generated on creation

### Overdue Status (Derived Property - New)

**Type**: Boolean (calculated, not stored)
**Calculation Location**: Frontend (`packages/frontend/src/utils/dateUtils.js`)
**Recalculation Trigger**: Every component render

#### Derivation Logic

```javascript
/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - ISO 8601 date string
 * @param {boolean} completed - Completion status
 * @returns {boolean} True if todo is overdue, false otherwise
 */
function isOverdue(dueDate, completed) {
  // Rule 1: No due date → never overdue (FR-004)
  if (!dueDate) return false;
  
  // Rule 2: Completed todo → never overdue (FR-003)
  if (completed) return false;
  
  // Rule 3: Invalid date → not overdue (graceful degradation)
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) {
    console.warn(`Invalid dueDate format: ${dueDate}`);
    return false;
  }
  
  // Rule 4: Due timestamp before current timestamp → overdue (FR-001, FR-007)
  const now = new Date();
  return due < now;
}
```

#### Dependencies

| Input | Source | Type |
|-------|--------|------|
| `dueDate` | Todo.dueDate | string (ISO 8601) or null |
| `completed` | Todo.completed | boolean (or integer 0/1 from SQLite) |
| `currentTime` | `new Date()` | Date (browser local time per FR-009) |

#### Truth Table

| dueDate | completed | due < now | Result | Rationale |
|---------|-----------|-----------|--------|-----------|
| null | false | N/A | false | No due date (FR-004) |
| null | true | N/A | false | No due date (FR-004) |
| valid | true | false | false | Completed (FR-003) |
| valid | true | true | false | Completed (FR-003) |
| valid | false | false | false | Future date (FR-007) |
| valid | false | true | **true** | Past date, incomplete (FR-001) |
| invalid | false | N/A | false | Graceful degradation (FR-006) |

## State Transitions

### Overdue Status Changes

The overdue status is **ephemeral** (not persisted) and changes based on:

1. **Time Passing**: As current time advances, todos with future due dates become overdue
   - **Trigger**: Page refresh or component remount
   - **Frequency**: No auto-refresh; user must reload page (per clarification)

2. **Completion Toggle**: Marking todo complete removes overdue status
   - **Trigger**: User clicks checkbox
   - **Effect**: Immediate UI update (FR-005)
   - **Transition**: `overdue: true` → `overdue: false`

3. **Due Date Edit**: Changing due date can add or remove overdue status
   - **Trigger**: User edits todo and saves
   - **Effect**: Immediate UI update (FR-005)
   - **Transitions**:
     - Past date → Future date: `overdue: true` → `overdue: false`
     - Future date → Past date: `overdue: false` → `overdue: true`
     - Past date → null: `overdue: true` → `overdue: false`

4. **Completion Undo**: Unmarking completed todo can restore overdue status
   - **Trigger**: User unchecks checkbox
   - **Effect**: Immediate UI update (FR-005)
   - **Transition**: `overdue: false` → `overdue: true` (if dueDate < now)

### State Diagram

```
┌─────────────────────────────────────────────────┐
│ Todo Created with Past Due Date                 │
│ State: overdue = true                           │
└─────────────────────────────────────────────────┘
                    │
                    ├─[User marks complete]────────────►┌───────────────────────┐
                    │                                   │ State: overdue = false │
                    │                                   │ (FR-003: completed)    │
                    │                                   └───────────────────────┘
                    │                                             │
                    │                                   ┌─[User unchecks]─────┘
                    │                                   │
                    ▼                                   ▼
┌─────────────────────────────────────────────────┐
│ State: overdue = true                           │
│ (if dueDate still < now)                        │
└─────────────────────────────────────────────────┘
                    │
                    ├─[User edits dueDate to future]───►┌───────────────────────┐
                    │                                   │ State: overdue = false │
                    │                                   │ (FR-007: future date)  │
                    │                                   └───────────────────────┘
                    │                                             │
                    │                                   ┌─[Time passes]──────────┘
                    │                                   │
                    ▼                                   ▼
┌─────────────────────────────────────────────────┐
│ State: overdue = true                           │
│ (after page refresh, FR-002)                    │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Read Flow (Display Overdue Status)

```
┌─────────────┐      ┌─────────────┐      ┌──────────────────┐      ┌──────────────┐
│ TodoService │─────►│ API Response│─────►│ React Component  │─────►│ isOverdue()  │
│ (Backend)   │      │ (JSON)      │      │ (TodoCard)       │      │ (Utility)    │
└─────────────┘      └─────────────┘      └──────────────────┘      └──────────────┘
                                                                             │
                                                                             ▼
                                                                    ┌──────────────────┐
                                                                    │ Boolean result   │
                                                                    │ (true/false)     │
                                                                    └──────────────────┘
                                                                             │
                                                                             ▼
                                                                    ┌──────────────────┐
                                                                    │ CSS class added  │
                                                                    │ Badge rendered   │
                                                                    └──────────────────┘
```

### Update Flow (Status Changes on User Action)

```
┌──────────────────┐      ┌─────────────────┐      ┌──────────────────┐
│ User Action      │─────►│ Optimistic UI   │─────►│ API Call         │
│ (complete/edit)  │      │ Update (instant)│      │ (persist change) │
└──────────────────┘      └─────────────────┘      └──────────────────┘
                                   │                         │
                                   ▼                         ▼
                          ┌──────────────────┐     ┌──────────────────┐
                          │ isOverdue()      │     │ Backend updates  │
                          │ recalculated     │     │ todo (completed/ │
                          │ (immediate)      │     │ dueDate changed) │
                          └──────────────────┘     └──────────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │ Visual update    │
                          │ (<100ms per      │
                          │  FR-003)         │
                          └──────────────────┘
```

## API Contract (No Changes Required)

The existing API endpoints already provide all necessary data. No backend modifications needed.

### GET /api/todos

**Response** (existing, no changes):
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "dueDate": "2026-01-25T17:00:00.000Z",
    "completed": 0,
    "createdAt": "2026-01-20T09:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Review pull request",
    "dueDate": null,
    "completed": 1,
    "createdAt": "2026-01-28T14:30:00.000Z"
  }
]
```

**Frontend Calculation** (new logic):
```javascript
// For todo id=1 (incomplete, past due date)
const overdue = isOverdue("2026-01-25T17:00:00.000Z", false); // true

// For todo id=2 (completed)
const overdue = isOverdue(null, true); // false
```

## Relationships

**No new relationships introduced.**

The overdue status is a function of:
- Single Todo entity's `dueDate` field
- Single Todo entity's `completed` field
- Current time (external to data model)

No joins, foreign keys, or cross-entity dependencies.

## Migration Strategy

**No database migration required.**

This feature is purely client-side calculation. Existing schema supports the feature without modifications.

### Rollback Plan

If feature needs to be rolled back:
1. Remove `dateUtils.js` utility
2. Remove overdue CSS classes from components
3. Remove conditional rendering of overdue badge
4. No database changes to revert

## Performance Considerations

### Calculation Cost

- **Per Todo**: O(1) date comparison (~0.0001ms)
- **Per Render**: Single `isOverdue()` call per TodoCard
- **Memory**: No additional storage (derived value)

### Optimization Rationale

No caching or memoization needed because:
- Calculation is faster than cache lookup
- TodoCard renders only when todo data changes (React's diffing)
- Premature optimization would add complexity without benefit

### Scalability

- **10 todos**: ~0.001ms total calculation time
- **100 todos**: ~0.01ms total calculation time
- **1000 todos**: ~0.1ms total calculation time

All well under the 100ms performance goal (FR-003 in plan context).

## Testing Strategy

### Unit Tests (dateUtils.test.js)

- ✅ No due date → not overdue
- ✅ Completed todo → not overdue
- ✅ Past due date, incomplete → overdue
- ✅ Future due date → not overdue
- ✅ Invalid date string → not overdue (graceful)
- ✅ Exact current time → not overdue (boundary)
- ✅ Midnight boundary case

### Integration Tests (TodoCard.test.js)

- ✅ Overdue todo displays overdue badge
- ✅ Overdue todo has overdue CSS class
- ✅ Completed todo doesn't show overdue badge
- ✅ Future todo doesn't show overdue badge
- ✅ Completing overdue todo removes badge
- ✅ Editing due date to future removes badge

## Future Enhancements (Out of Scope)

- **Relative time display**: "2 days overdue"
- **Grace period**: Configurable delay before marking overdue
- **Urgency levels**: "Slightly overdue" vs "Very overdue"
- **Server-side filtering**: API endpoint to fetch only overdue todos
- **Notifications**: Alert users about overdue items

These are explicitly out of scope for this feature per the spec.
