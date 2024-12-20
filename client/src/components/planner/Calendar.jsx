//src/components/planner/Calendar.jsx
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { useDroppable } from '@dnd-kit/core';
import usePlannerStore from '../../store/plannerStore';

function DroppableDay({ day, tasks = [], onDateSelect, isSelected }) {
  const { setNodeRef, isOver } = useDroppable({
    id: format(day, 'yyyy-MM-dd'),
  });

  const formattedDate = format(day, 'yyyy-MM-dd');
  const dayTasks = Array.isArray(tasks) ? tasks.filter(task => task.date === formattedDate) : [];

  return (
    <div
      ref={setNodeRef}
      onClick={() => onDateSelect?.(day)}
      className={`
        p-2 border rounded min-h-[80px] cursor-pointer
        ${isToday(day) ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isOver ? 'bg-blue-100' : ''}
      `}
    >
      <div className="text-right text-sm font-medium text-gray-700 mb-1">
        {format(day, 'd')}
      </div>
      <div className="space-y-1">
        {dayTasks.map(task => (
          <div
            key={task.id}
            className={`
              text-xs p-1 rounded border text-gray-900
              ${task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
            `}
            title={task.title}
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Calendar({ onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = usePlannerStore(state => state.tasks) || [];
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 hover:bg-gray-100 rounded text-gray-600"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2 text-gray-600">
            {day}
          </div>
        ))}
        
        {days.map(day => (
          <DroppableDay
            key={day.toString()}
            day={day}
            tasks={tasks}
            onDateSelect={onDateSelect}
            isSelected={selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
          />
        ))}
      </div>
    </div>
  );
}
