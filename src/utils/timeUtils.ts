export const getRelativeTime = (dueDate: string): { text: string; isOverdue: boolean } => {
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999); // Tính đến cuối ngày hạn nộp
  const now = new Date();
  
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `Quá hạn ${Math.abs(diffDays)} ngày`, isOverdue: true };
  if (diffDays === 0) return { text: `Hết hạn hôm nay`, isOverdue: false };
  return { text: `Còn ${diffDays} ngày`, isOverdue: false };
};