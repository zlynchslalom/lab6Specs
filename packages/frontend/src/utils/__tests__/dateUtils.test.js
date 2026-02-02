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
