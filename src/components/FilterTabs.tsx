import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilter } from '../store/assignmentsSlice';
import { FilterStatus } from '../types';

// Định nghĩa các SVG Icons
const icons = {
  All: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Completed: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Incomplete: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Overdue: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
};

export const FilterTabs = () => {
  const dispatch = useAppDispatch();
  const { items, filter: currentFilter } = useAppSelector((state) => state.assignments);

  const stats = {
    All: items.length,
    Completed: items.filter(i => i.completed).length,
    Incomplete: items.filter(i => !i.completed && new Date(i.dueDate).getTime() >= Date.now()).length,
    Overdue: items.filter(i => !i.completed && new Date(i.dueDate).getTime() < Date.now()).length,
  };

  const tabs = [
    { label: 'Tổng số', value: 'All', count: stats.All, bg: 'bg-red-50', text: 'text-red-600', icon: icons.All },
    { label: 'Đã hoàn thành', value: 'Completed', count: stats.Completed, bg: 'bg-green-50', text: 'text-green-600', icon: icons.Completed },
    { label: 'Đang diễn ra', value: 'Incomplete', count: stats.Incomplete, bg: 'bg-blue-50', text: 'text-blue-600', icon: icons.Incomplete },
    { label: 'Quá hạn nộp', value: 'Overdue', count: stats.Overdue, bg: 'bg-gray-100', text: 'text-gray-700', icon: icons.Overdue },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tabs.map(tab => (
        <div
          key={tab.value}
          onClick={() => dispatch(setFilter(tab.value as FilterStatus))}
          className={`cursor-pointer p-4 rounded-xl flex items-center justify-between transition-all duration-200 border ${
            currentFilter === tab.value ? `ring-2 ring-blue-400 shadow-md ${tab.bg}` : `hover:shadow-sm bg-white border-gray-100 opacity-90 hover:opacity-100`
          }`}
        >
          <div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${tab.bg} ${tab.text} bg-opacity-50`}>
              {tab.icon}
            </div>
            <p className="text-sm font-semibold text-gray-600">{tab.label}</p>
          </div>
          <p className={`text-4xl font-bold ${tab.text}`}>{tab.count}</p>
        </div>
      ))}
    </div>
  );
};