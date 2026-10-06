// 1. Core Interfaces
export type Priority = 'Thấp' | 'Trung bình' | 'Cao';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // ISO String
  priority: Priority;
  completed: boolean;
  description?: string; // Thêm trường chi tiết bài tập
}

// 2. Utility Types: Dùng Omit để tạo type cho Form (loại bỏ id và completed)
export type AssignmentFormData = Omit<Assignment, 'id' | 'completed'>;

// 3. Generic: Định nghĩa cấu trúc chuẩn cho mọi API Response
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 4. Type Guard: Hàm kiểm tra runtime xem một object có chuẩn form Assignment không
export const isAssignment = (obj: any): obj is Assignment => {
  return obj !== null && typeof obj === 'object' && 'title' in obj && 'dueDate' in obj;
};


export type FilterStatus = 'All' | 'Incomplete' | 'Overdue' | 'Completed';