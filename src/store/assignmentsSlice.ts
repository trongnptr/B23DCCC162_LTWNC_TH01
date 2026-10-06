// src/store/assignmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Assignment, ApiResponse, AssignmentFormData, FilterStatus } from '../types';

// Giả lập API call
const fetchMockAssignments = (): Promise<ApiResponse<Assignment[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        message: 'Success',
        data: [
          { id: '1', subject: 'LTWNC', title: 'Bài thực hành 01', dueDate: '2026-10-10', priority: 'Cao', completed: false },
          { id: '2', subject: 'Hệ điều hành', title: 'Báo cáo BTL', dueDate: '2026-10-01', priority: 'Trung bình', completed: false },
        ]
      });
    }, 1000); // Delay 1s
  });
};

export const fetchInitialAssignments = createAsyncThunk(
  'assignments/fetchInitial',
  async () => {
    // Ưu tiên lấy dữ liệu đã lưu
    const savedData = localStorage.getItem('student_deadlines');
    if (savedData && savedData !== '[]') {
      return JSON.parse(savedData);
    }
    
    // Nếu chưa có, mới gọi API mẫu
    const response = await fetchMockAssignments();
    return response.data;
  }
);

interface State {
  items: Assignment[];
  status: 'idle' | 'loading' | 'failed'; // Sửa thành status để khớp với App.tsx
  filter: FilterStatus; // Bổ sung state filter
}

const initialState: State = { 
  items: [], 
  status: 'idle', 
  filter: 'All' // Đặt giá trị mặc định cho filter
};

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<AssignmentFormData>) => {
      const newAssignment: Assignment = {
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
      };
      state.items.push(newAssignment);
    },
    toggleCompletion: (state, action: PayloadAction<string>) => {
      const assignment = state.items.find(a => a.id === action.payload);
      if (assignment) assignment.completed = !assignment.completed;
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload; // Ghi đè dữ liệu mới
      }
    },
    // Bổ sung reducer setFilter
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialAssignments.pending, (state) => { 
        state.status = 'loading'; 
      })
      .addCase(fetchInitialAssignments.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      });
  }
});

export const { addAssignment, toggleCompletion, deleteAssignment, updateAssignment, setFilter } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;