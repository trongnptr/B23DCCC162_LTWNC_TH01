import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchInitialAssignments } from './store/assignmentsSlice';
import { useTaskFilters } from './hooks/useTaskFilters';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentCard } from './components/AssignmentCard';
import { FilterTabs } from './components/FilterTabs';

function App() {
  const dispatch = useAppDispatch();
  const { items, status, filter } = useAppSelector((state) => state.assignments);
  const { filteredAssignments } = useTaskFilters(items, filter); 
  
  // State quản lý việc mở/đóng hộp thoại (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInitialAssignments());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Nút mở hộp thoại */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight"> Deadline Tracker</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">Hệ thống quản lý bài tập cá nhân</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200 w-full sm:w-auto justify-center"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm bài mới
          </button>
        </header>

        {/* Khu vực 1: Thống kê */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-wide">Bài tập, bài kiểm tra</h2>
          <FilterTabs />
        </section>

        {/* Khu vực 2: Grid danh sách bài tập */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-wide">Danh sách lớp tín chỉ</h2>
          
          {status === 'loading' ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Không có bài tập nào ở trạng thái này 🎉</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map(task => (
                <AssignmentCard key={task.id} task={task}>
                  <AssignmentCard.Info />
                  <AssignmentCard.Actions />
                </AssignmentCard>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* MODAL (HỘP THOẠI) THÊM BÀI TẬP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền đen mờ (Click vào nền sẽ tự đóng) */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Nội dung Form */}
          <div className="relative z-10 w-full max-w-lg transform scale-100 transition-transform duration-300">
            <AssignmentForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}

export default App;