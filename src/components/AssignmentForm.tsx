import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addAssignment } from '../store/assignmentsSlice';
import { Priority, AssignmentFormData } from '../types';

interface Props {
  onClose: () => void; // Prop để đóng Modal
}

export const AssignmentForm = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<AssignmentFormData>({ 
    subject: '', title: '', description: '', dueDate: '', priority: 'Trung bình' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    dispatch(addAssignment(formData));
    setFormData({ subject: '', title: '', description: '', dueDate: '', priority: 'Trung bình' });
    onClose(); // Đóng hộp thoại sau khi thêm thành công
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full">
      {/* Nút X đóng hộp thoại ở góc phải */}
      <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-bold text-gray-800 text-xl">Thêm bài tập mới</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input required placeholder="Môn học (VD: LTWNC)" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
        <input required placeholder="Tên bài tập" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>

      <textarea placeholder="Chi tiết yêu cầu bài tập (tùy chọn)..." className="w-full border border-gray-200 p-3.5 rounded-xl text-sm mb-4 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input required type="date" className="w-full border border-gray-200 p-3.5 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
        <select className="w-full border border-gray-200 p-3.5 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition" 
          value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})}>
          <option value="Thấp">Ưu tiên Thấp</option>
          <option value="Trung bình">Ưu tiên Trung bình</option>
          <option value="Cao">Ưu tiên Cao</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl hover:bg-gray-200 font-bold text-sm transition">
          Hủy bỏ
        </button>
        <button type="submit" className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 font-bold text-sm transition shadow-lg shadow-blue-200">
          Tạo Deadline
        </button>
      </div>
    </form>
  );
};