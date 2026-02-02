import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('Overdue functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-29T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should display overdue badge for incomplete todo with past due date', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2026-01-25T12:00:00Z',
        completed: 0,
      };

      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText('Overdue')).toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });

    it('should NOT display overdue badge for completed todo with past due date', () => {
      const completedTodo = {
        ...mockTodo,
        dueDate: '2026-01-25T12:00:00Z',
        completed: 1,
      };

      const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should NOT display overdue badge for incomplete todo with future due date', () => {
      const futureTodo = {
        ...mockTodo,
        dueDate: '2026-02-01T12:00:00Z',
        completed: 0,
      };

      const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should NOT display overdue badge for todo without due date', () => {
      const noDueDateTodo = {
        ...mockTodo,
        dueDate: null,
        completed: 0,
      };

      render(<TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should remove overdue badge when todo is marked complete', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2026-01-25T12:00:00Z',
        completed: 0,
      };

      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      // Initially overdue
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      // Mark as complete
      const completedTodo = { ...overdueTodo, completed: 1 };
      rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);

      // No longer overdue
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should add overdue badge when due date is edited to past date', () => {
      const futureTodo = {
        ...mockTodo,
        dueDate: '2026-02-01T12:00:00Z',
        completed: 0,
      };

      const { rerender, container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      // Initially not overdue
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      // Edit due date to past
      const overdueTodo = { ...futureTodo, dueDate: '2026-01-25T12:00:00Z' };
      rerender(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      // Now overdue
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });

    // User Story 2 Tests: Persistent Overdue Status Through Date Changes
    it('should show overdue when future todo becomes past due after date change', () => {
      const futureTodo = {
        ...mockTodo,
        dueDate: '2026-01-30T12:00:00Z',
        completed: 0,
      };

      const { rerender, container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      // Initially not overdue
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      // Simulate time passing (advance to Feb 1)
      jest.setSystemTime(new Date('2026-02-01T12:00:00Z'));
      rerender(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      // Now overdue
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });

    it('should remove overdue indicator when editing todo to future date', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2026-01-25T12:00:00Z',
        completed: 0,
      };

      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      // Initially overdue
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      // Edit to future date
      const futureTodo = { ...overdueTodo, dueDate: '2026-02-15T12:00:00Z' };
      rerender(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      // No longer overdue
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should show correct overdue status for multiple todos with different due dates', () => {
      const todos = [
        { ...mockTodo, id: 1, dueDate: '2026-01-20T12:00:00Z', completed: 0 }, // Overdue
        { ...mockTodo, id: 2, dueDate: '2026-02-05T12:00:00Z', completed: 0 }, // Not overdue
        { ...mockTodo, id: 3, dueDate: '2026-01-15T12:00:00Z', completed: 1 }, // Completed (not overdue)
      ];

      const { container } = render(
        <>
          <TodoCard todo={todos[0]} {...mockHandlers} isLoading={false} />
          <TodoCard todo={todos[1]} {...mockHandlers} isLoading={false} />
          <TodoCard todo={todos[2]} {...mockHandlers} isLoading={false} />
        </>
      );

      const overdueBadges = screen.getAllByText('Overdue');
      expect(overdueBadges).toHaveLength(1);
    });

    // User Story 3 Tests: Consistent Overdue Indication Across Actions
    it('should immediately show overdue indicator for newly created todo with past due date', () => {
      const newOverdueTodo = {
        ...mockTodo,
        dueDate: '2026-01-20T12:00:00Z',
        completed: 0,
      };

      const { container } = render(<TodoCard todo={newOverdueTodo} {...mockHandlers} isLoading={false} />);

      // Immediately overdue
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });
  });
});
