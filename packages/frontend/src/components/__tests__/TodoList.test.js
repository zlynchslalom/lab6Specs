import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  describe('Overdue consistency across multiple todos', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-29T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should maintain overdue indicators when performing actions on other todos', () => {
      const todosWithOverdue = [
        {
          id: 1,
          title: 'Overdue Todo 1',
          dueDate: '2026-01-20T12:00:00Z',
          completed: 0,
          createdAt: '2026-01-15T00:00:00Z'
        },
        {
          id: 2,
          title: 'Future Todo',
          dueDate: '2026-02-05T12:00:00Z',
          completed: 0,
          createdAt: '2026-01-16T00:00:00Z'
        },
        {
          id: 3,
          title: 'Overdue Todo 2',
          dueDate: '2026-01-25T12:00:00Z',
          completed: 0,
          createdAt: '2026-01-17T00:00:00Z'
        }
      ];

      const { container } = render(
        <TodoList todos={todosWithOverdue} {...mockHandlers} isLoading={false} />
      );

      // Verify two overdue badges are present
      const overdueBadges = screen.getAllByText('Overdue');
      expect(overdueBadges).toHaveLength(2);

      // Verify correct todos have overdue class
      const cards = container.querySelectorAll('.todo-card');
      expect(cards[0]).toHaveClass('overdue'); // Overdue Todo 1
      expect(cards[1]).not.toHaveClass('overdue'); // Future Todo
      expect(cards[2]).toHaveClass('overdue'); // Overdue Todo 2
    });
  });
});
