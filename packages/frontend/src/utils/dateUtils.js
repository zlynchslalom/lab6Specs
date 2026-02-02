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
