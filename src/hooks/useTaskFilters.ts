import { useMemo } from 'react';
import { Assignment, FilterStatus } from '../types';

export const useTaskFilters = (assignments: Assignment[], filter: FilterStatus) => {
  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];
    return assignments.filter((item) => {
      const isOverdue = new Date(item.dueDate).getTime() < new Date().getTime() && !item.completed;
      switch (filter) {
        case 'Completed': return item.completed;
        case 'Incomplete': return !item.completed && !isOverdue;
        case 'Overdue': return isOverdue;
        default: return true;
      }
    });
  }, [assignments, filter]);

  return { filteredAssignments };
};