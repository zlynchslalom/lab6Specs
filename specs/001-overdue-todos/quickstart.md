# Quickstart Guide: Overdue Todo Items Feature

**Feature**: Overdue Todo Items
**Date**: January 29, 2026
**Phase**: 1 - Design & Contracts

## Overview

This guide provides step-by-step instructions for implementing the overdue todo items feature. Developers can follow this to add visual indicators (red styling + "Overdue" badge) for incomplete todos with past due dates.

## Prerequisites

- Node.js 16+ installed
- Repository cloned locally
- Dependencies installed (`npm install` from root)
- Familiarity with React, CSS, and Jest

## Implementation Checklist

- [ ] Phase 1: Create overdue calculation utility
- [ ] Phase 2: Add unit tests for utility function
- [ ] Phase 3: Update TodoCard component with overdue styling
- [ ] Phase 4: Add integration tests for TodoCard
- [ ] Phase 5: Update CSS styles for overdue visual indicators
- [ ] Phase 6: Test in browser and verify all acceptance criteria

## Phase 1: Create Overdue Calculation Utility

### Step 1.1: Create utility file

**File**: `packages/frontend/src/utils/dateUtils.js`

```javascript
/**
 * Date Utility Functions
 * Provides date-related calculations for todo items
 */

/**
 * Determines if a todo is overdue based on its due date and completion status
 * 
 * @param {string|null} dueDate - ISO 8601 date string (e.g., "2026-01-29T14:30:00.000Z")
 * @param {boolean|number} completed - Completion status (boolean or 0/1 from SQLite)
 * @returns {boolean} True if todo is overdue, false otherwise
 * 
 * Rules:
 * - No due date (null/undefined): Not overdue
 * - Completed todo: Not overdue (regardless of due date)
 * - Invalid date format: Not overdue (graceful degradation)
 * - Due timestamp before current timestamp: Overdue
 * 
 * Examples:
 *   isOverdue('2026-01-28T12:00:00Z', false) // true (past date, incomplete)
 *   isOverdue('2026-01-30T12:00:00Z', false) // false (future date)
 *   isOverdue('2026-01-28T12:00:00Z', true)  // false (completed)
 *   isOverdue(null, false)                   // false (no due date)
 */
export function isOverdue(dueDate, completed) {
  // Rule 1: No due date → never overdue
  if (!dueDate) {
    return false;
  }

  // Rule 2: Completed todo → never overdue
  if (completed) {
    return false;
  }

  // Rule 3: Parse due date and validate
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) {
    // Invalid date format - log warning and return false
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Invalid dueDate format: ${dueDate}`);
    }
    return false;
  }

  // Rule 4: Compare timestamps (uses browser's local timezone)
  const now = new Date();
  return due < now;
}
```

**Why this approach**:
- Pure function (no side effects, easy to test)
- Handles all edge cases gracefully
- Uses native Date API (no dependencies)
- Clear documentation for future maintainers

---

## Phase 2: Add Unit Tests for Utility Function

### Step 2.1: Create test file

**File**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

```javascript
import { isOverdue } from '../dateUtils';

describe('dateUtils', () => {
  describe('isOverdue', () => {
    beforeEach(() => {
      // Mock current time to January 29, 2026, 12:00:00 UTC
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-29T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('should return false when', () => {
      test('due date is null', () => {
        expect(isOverdue(null, false)).toBe(false);
      });

      test('due date is undefined', () => {
        expect(isOverdue(undefined, false)).toBe(false);
      });

      test('todo is completed (even with past due date)', () => {
        expect(isOverdue('2026-01-28T12:00:00Z', true)).toBe(false);
      });

      test('due date is in the future', () => {
        expect(isOverdue('2026-01-30T12:00:00Z', false)).toBe(false);
      });

      test('due date is later today', () => {
        expect(isOverdue('2026-01-29T18:00:00Z', false)).toBe(false);
      });

      test('due date is exactly now (boundary case)', () => {
        expect(isOverdue('2026-01-29T12:00:00Z', false)).toBe(false);
      });

      test('due date format is invalid', () => {
        expect(isOverdue('invalid-date', false)).toBe(false);
      });

      test('completed status is 1 (integer from SQLite)', () => {
        expect(isOverdue('2026-01-28T12:00:00Z', 1)).toBe(false);
      });
    });

    describe('should return true when', () => {
      test('due date is in the past and todo is incomplete', () => {
        expect(isOverdue('2026-01-28T12:00:00Z', false)).toBe(true);
      });

      test('due date is one second in the past', () => {
        expect(isOverdue('2026-01-29T11:59:59Z', false)).toBe(true);
      });

      test('due date is many days in the past', () => {
        expect(isOverdue('2026-01-01T00:00:00Z', false)).toBe(true);
      });

      test('completed status is 0 (integer from SQLite)', () => {
        expect(isOverdue('2026-01-28T12:00:00Z', 0)).toBe(true);
      });
    });

    describe('edge cases', () => {
      test('handles empty string due date', () => {
        expect(isOverdue('', false)).toBe(false);
      });

      test('handles whitespace due date', () => {
        expect(isOverdue('   ', false)).toBe(false);
      });

      test('handles ISO date without time', () => {
        // Date-only format defaults to 00:00:00 UTC
        expect(isOverdue('2026-01-28', false)).toBe(true);
      });
    });
  });
});
```

### Step 2.2: Run tests

```bash
cd /workspaces/lab6Specs
npm test --workspace=frontend -- dateUtils.test.js
```

**Expected output**: All tests passing with 100% coverage for dateUtils.js.

---

## Phase 3: Update TodoCard Component

### Step 3.1: Import utility and add overdue logic

**File**: `packages/frontend/src/components/TodoCard.js`

**Add import at top of file**:
```javascript
import { isOverdue } from '../utils/dateUtils';
```

**Inside TodoCard function, before return statement**:
```javascript
function TodoCard({ todo, onComplete, onDelete, onEdit }) {
  // Calculate overdue status
  const overdue = isOverdue(todo.dueDate, todo.completed);

  // ... rest of existing logic

  return (
    <div className={`todo-card ${overdue ? 'overdue' : ''}`}>
      <div className="todo-card-checkbox">
        {/* existing checkbox code */}
      </div>

      <div className="todo-card-content">
        <div className="todo-card-title-row">
          <h3 className={`todo-card-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </h3>
          {overdue && <span className="overdue-badge">Overdue</span>}
        </div>

        {todo.dueDate && (
          <p className="todo-card-due-date">
            Due: {formatDate(todo.dueDate)}
          </p>
        )}
      </div>

      {/* existing actions code */}
    </div>
  );
}
```

**Key changes**:
1. Calculate `overdue` status using utility function
2. Add `overdue` class to card container conditionally
3. Render "Overdue" badge when overdue is true
4. Badge placed next to title for visibility

---

## Phase 4: Add Integration Tests for TodoCard

### Step 4.1: Update TodoCard tests

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

**Add these test cases**:

```javascript
describe('Overdue functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-29T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should display overdue badge for incomplete todo with past due date', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue task',
      dueDate: '2026-01-25T12:00:00Z', // Past date
      completed: false,
    };

    render(<TodoCard todo={overdueTodo} />);

    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Overdue task').closest('.todo-card')).toHaveClass('overdue');
  });

  test('should NOT display overdue badge for completed todo with past due date', () => {
    const completedTodo = {
      id: 2,
      title: 'Completed overdue task',
      dueDate: '2026-01-25T12:00:00Z', // Past date
      completed: true,
    };

    render(<TodoCard todo={completedTodo} />);

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    expect(screen.getByText('Completed overdue task').closest('.todo-card')).not.toHaveClass('overdue');
  });

  test('should NOT display overdue badge for incomplete todo with future due date', () => {
    const futureTodo = {
      id: 3,
      title: 'Future task',
      dueDate: '2026-02-01T12:00:00Z', // Future date
      completed: false,
    };

    render(<TodoCard todo={futureTodo} />);

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    expect(screen.getByText('Future task').closest('.todo-card')).not.toHaveClass('overdue');
  });

  test('should NOT display overdue badge for todo without due date', () => {
    const noDueDateTodo = {
      id: 4,
      title: 'No due date task',
      dueDate: null,
      completed: false,
    };

    render(<TodoCard todo={noDueDateTodo} />);

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  test('should remove overdue badge when todo is marked complete', () => {
    const overdueTodo = {
      id: 5,
      title: 'Task to complete',
      dueDate: '2026-01-25T12:00:00Z',
      completed: false,
    };

    const { rerender } = render(<TodoCard todo={overdueTodo} />);

    // Initially overdue
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    // Mark as complete
    const completedTodo = { ...overdueTodo, completed: true };
    rerender(<TodoCard todo={completedTodo} />);

    // No longer overdue
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  test('should add overdue badge when due date is edited to past date', () => {
    const futureTodo = {
      id: 6,
      title: 'Task to edit',
      dueDate: '2026-02-01T12:00:00Z', // Future
      completed: false,
    };

    const { rerender } = render(<TodoCard todo={futureTodo} />);

    // Initially not overdue
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

    // Edit due date to past
    const overdueTodo = { ...futureTodo, dueDate: '2026-01-25T12:00:00Z' };
    rerender(<TodoCard todo={overdueTodo} />);

    // Now overdue
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });
});
```

### Step 4.2: Run integration tests

```bash
npm test --workspace=frontend -- TodoCard.test.js
```

---

## Phase 5: Update CSS Styles

### Step 5.1: Add overdue styles to TodoCard.css

**File**: `packages/frontend/src/components/TodoCard.css` (create if doesn't exist)

```css
/* Overdue card styling */
.todo-card.overdue {
  border-left: 4px solid var(--danger-color, #c62828);
  background-color: var(--danger-bg-light, #ffebee);
}

/* Dark mode support */
[data-theme="dark"] .todo-card.overdue {
  background-color: var(--danger-bg-dark, #4a1a1a);
  border-left-color: var(--danger-color-dark, #ef5350);
}

/* Overdue badge */
.overdue-badge {
  display: inline-block;
  background-color: var(--danger-color, #c62828);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
  vertical-align: middle;
}

[data-theme="dark"] .overdue-badge {
  background-color: var(--danger-color-dark, #ef5350);
}

/* Title row to accommodate badge */
.todo-card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Accessibility: Ensure sufficient contrast */
.overdue-badge {
  /* Red on white: 4.5:1 contrast ratio (WCAG AA) */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Print styles: Show "Overdue" text even if colors are lost */
@media print {
  .overdue-badge {
    border: 1px solid #000;
    color: #000;
    background-color: #fff;
  }
  
  .overdue-badge::before {
    content: '⚠ '; /* Warning symbol for clarity */
  }
}
```

### Step 5.2: Add CSS variables to theme.css

**File**: `packages/frontend/src/styles/theme.css`

**Add to :root (light mode)**:
```css
:root {
  /* Existing variables... */
  
  /* Overdue/Danger colors */
  --danger-color: #c62828;
  --danger-bg-light: #ffebee;
  --success-color: #2e7d32;
}
```

**Add to [data-theme="dark"] (dark mode)**:
```css
[data-theme="dark"] {
  /* Existing variables... */
  
  /* Overdue/Danger colors */
  --danger-color-dark: #ef5350;
  --danger-bg-dark: #4a1a1a;
  --success-color-dark: #66bb6a;
}
```

---

## Phase 6: Browser Testing

### Step 6.1: Start development servers

```bash
# From project root
npm run start
```

This starts both frontend (port 3000) and backend (port 3030).

### Step 6.2: Manual test scenarios

#### Test 1: View Overdue Todo
1. Open http://localhost:3000
2. Create a todo with yesterday's date
3. ✅ Verify red left border appears on card
4. ✅ Verify "Overdue" badge displays next to title
5. ✅ Verify styling works in both light and dark modes

#### Test 2: Complete Overdue Todo
1. Click checkbox on overdue todo
2. ✅ Verify overdue badge disappears immediately
3. ✅ Verify red border disappears immediately
4. ✅ Verify todo shows completed styling (strikethrough)

#### Test 3: Create New Overdue Todo
1. Add new todo with past due date
2. ✅ Verify overdue indicators appear on newly created todo immediately

#### Test 4: Edit Due Date
1. Edit overdue todo and change due date to future
2. ✅ Verify overdue indicators disappear immediately
3. Edit future todo and change due date to past
4. ✅ Verify overdue indicators appear immediately

#### Test 5: No Due Date
1. Create todo without due date
2. ✅ Verify no overdue indicators (even if uncompleted)

#### Test 6: Accessibility
1. Use keyboard only (Tab, Enter, Space) to navigate
2. ✅ Verify all interactive elements are focusable
3. Use screen reader (VoiceOver, NVDA, JAWS)
4. ✅ Verify "Overdue" text is announced

---

## Verification Checklist

### Code Quality
- [ ] All imports organized (external → internal → styles)
- [ ] Functions use camelCase, components use PascalCase
- [ ] No ESLint errors or warnings
- [ ] Code comments explain "why," not "what"
- [ ] No console.log statements left in code

### Testing
- [ ] All unit tests passing (dateUtils.test.js)
- [ ] All integration tests passing (TodoCard.test.js)
- [ ] Code coverage ≥80% for new/modified files
- [ ] Tests use descriptive names
- [ ] Tests are independent and isolated

### Functionality
- [ ] Overdue badge displays for incomplete todos with past due dates
- [ ] Overdue badge does NOT display for completed todos
- [ ] Overdue badge does NOT display for todos without due dates
- [ ] Overdue badge does NOT display for future due dates
- [ ] Completing overdue todo removes badge immediately
- [ ] Editing due date updates overdue status immediately

### Design/Accessibility
- [ ] Red color (#c62828) used for overdue indicators
- [ ] "Overdue" text badge visible alongside color
- [ ] Styling works in both light and dark modes
- [ ] Contrast ratio meets WCAG AA (4.5:1)
- [ ] Screen readers announce "Overdue" text
- [ ] Visual indicators clear and noticeable

### Constitution Compliance
- [ ] Follows 2-space indentation
- [ ] DRY: overdue logic in shared utility
- [ ] Single responsibility: isOverdue() does one thing
- [ ] KISS: Simple date comparison, no over-engineering
- [ ] Error handling: graceful degradation for invalid dates
- [ ] Tests written for all new code

---

## Troubleshooting

### Issue: Overdue badge doesn't appear

**Possible causes**:
1. Due date is in UTC, current time in local → Check timezone conversion
2. Todo is marked as completed → Verify `completed` field is false/0
3. CSS not loaded → Check import of TodoCard.css
4. isOverdue() not imported → Verify import statement

**Debug steps**:
```javascript
// Add temporary logging in TodoCard
console.log({
  dueDate: todo.dueDate,
  completed: todo.completed,
  overdue: isOverdue(todo.dueDate, todo.completed),
  now: new Date().toISOString()
});
```

### Issue: Tests failing with "Invalid Date"

**Cause**: Jest's fake timers not set up correctly

**Solution**:
```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-01-29T12:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Issue: Overdue styling not visible

**Possible causes**:
1. CSS specificity conflict → Use browser DevTools to inspect
2. Theme variables not defined → Check theme.css
3. Class not applied → Verify className conditional logic

**Debug steps**:
```javascript
// Check computed styles in browser console
const card = document.querySelector('.todo-card.overdue');
console.log(getComputedStyle(card).borderLeftColor);
```

---

## Performance Notes

- **Overdue calculation**: O(1), <0.001ms per todo
- **Re-renders**: Only when todo data changes (React optimization)
- **Bundle size impact**: ~0.5KB (utility + styles)
- **No API calls added**: Zero network overhead

---

## Next Steps After Implementation

1. **Create pull request** with branch `001-overdue-todos`
2. **Request code review** from team
3. **Run full test suite**: `npm test`
4. **Verify no linting errors**: `npm run lint` (if configured)
5. **Merge to main** after approval
6. **Document in changelog** (if applicable)

---

## References

- [Feature Spec](../spec.md)
- [Data Model](../data-model.md)
- [API Contract](../contracts/api-contract.md)
- [Research Doc](../research.md)
- [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Jest: Timer Mocks](https://jestjs.io/docs/timer-mocks)
- [WCAG 2.1: Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
