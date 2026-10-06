import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from './assignmentsSlice';

export const store = configureStore({
  reducer: { 
    assignments: assignmentsReducer 
  },
});

// Tự động lưu dữ liệu xuống trình duyệt mỗi khi state thay đổi
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('student_deadlines', JSON.stringify(state.assignments.items));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;