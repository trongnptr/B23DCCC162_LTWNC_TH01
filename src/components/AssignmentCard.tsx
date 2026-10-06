import React, { createContext, useContext, useState } from 'react';
import { Assignment, Priority } from '../types';
import { getRelativeTime } from '../utils/timeUtils';
import { useAppDispatch } from '../store/hooks';
import { toggleCompletion, deleteAssignment, updateAssignment } from '../store/assignmentsSlice';

const CardContext = createContext<{ task: Assignment, isEditing: boolean, setIsEditing: (v: boolean) => void } | null>(null);

export const AssignmentCard = ({ task, children }: { task: Assignment; children: React.ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isOverdue = new Date(task.dueDate).getTime() < Date.now() && !task.completed;
  
  const priorityEffects = {
    Cao: 'border-l-red-500 hover:shadow-red-500/20 shadow-red-500/10',
    'Trung bình': 'border-l-amber-400 hover:shadow-amber-400/20 shadow-amber-400/10',
    Thấp: 'border-l-emerald-500 hover:shadow-emerald-500/20 shadow-emerald-500/10'
  };

  const statusText = task.completed ? 'Đã xong' : isOverdue ? 'Quá hạn' : 'Sắp tới';
  const statusColor = task.completed ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500';

  return (
    <CardContext.Provider value={{ task, isEditing, setIsEditing }}>
      <div className={`relative p-5 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg border border-gray-100 border-l-[6px] ${
        task.completed ? 'bg-gray-50 opacity-70 border-l-gray-300' : `bg-white ${priorityEffects[task.priority]}`
      }`}>
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-xl ${statusColor}`}>
          {statusText}
        </div>
        
        {isEditing ? <AssignmentCard.EditForm /> : children}
      </div>
    </CardContext.Provider>
  );
};

AssignmentCard.Info = () => {
  const { task } = useContext(CardContext)!;
  const { text } = getRelativeTime(task.dueDate);

  return (
    <div className="mb-4 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{task.subject}</span>
      </div>
      <h3 className={`font-bold text-[1.1rem] leading-tight mb-2 ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          {task.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 px-2 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {task.dueDate}
        </div>
        <div className="bg-slate-50 px-2 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          Ưu tiên: {task.priority}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-500">Tiến trình:</span>
        <span className="font-semibold text-gray-800">{text}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div className={`h-1.5 rounded-full transition-all duration-500 ${task.completed ? 'bg-green-500 w-full' : 'bg-blue-600 w-1/3'}`}></div>
      </div>
    </div>
  );
};

AssignmentCard.Actions = () => {
  const { task, setIsEditing } = useContext(CardContext)!;
  const dispatch = useAppDispatch();

  return (
    <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2">
      <button onClick={() => dispatch(toggleCompletion(task.id))} className={`flex-1 py-2 text-sm rounded-lg font-bold transition-colors ${task.completed ? 'bg-gray-200 text-gray-700' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
        {task.completed ? 'Hoàn tác' : 'Nộp bài'}
      </button>
      <button onClick={() => setIsEditing(true)} className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold transition-colors">
        Sửa
      </button>
      <button onClick={() => dispatch(deleteAssignment(task.id))} className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-bold transition-colors">
        Xoá
      </button>
    </div>
  );
};

AssignmentCard.EditForm = () => {
  const { task, setIsEditing } = useContext(CardContext)!;
  const dispatch = useAppDispatch();
  const [editData, setEditData] = useState(task);

  const handleSave = () => {
    dispatch(updateAssignment(editData));
    setIsEditing(false); 
  };

  return (
    <div className="mt-4 flex flex-col h-full">
      <input className="w-full border border-gray-200 p-2 text-sm rounded-lg mb-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none" value={editData.subject} onChange={e => setEditData({...editData, subject: e.target.value})} />
      <input className="w-full border border-gray-200 p-2 text-sm rounded-lg mb-2 font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
      <textarea className="w-full border border-gray-200 p-2 text-sm rounded-lg mb-2 h-16 resize-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Chi tiết..." value={editData.description || ''} onChange={e => setEditData({...editData, description: e.target.value})} />
      
      <div className="flex gap-2 mb-4">
        <input type="date" className="w-1/2 border border-gray-200 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editData.dueDate} onChange={e => setEditData({...editData, dueDate: e.target.value})} />
        <select className="w-1/2 border border-gray-200 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editData.priority} onChange={e => setEditData({...editData, priority: e.target.value as Priority})}>
          <option value="Thấp">Thấp</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Cao">Cao</option>
        </select>
      </div>

      <div className="mt-auto flex gap-2">
        <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm">Lưu lại</button>
        <button onClick={() => setIsEditing(false)} className="px-4 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Huỷ</button>
      </div>
    </div>
  );
};