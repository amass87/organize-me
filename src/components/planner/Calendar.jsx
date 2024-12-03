// src/components/planner/Calendar.jsx
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { useDroppable } from '@dnd-kit/core';
import usePlannerStore from '../../store/plannerStore';

function DroppableDay({ day, tasks }) {
  const { setNodeRef, isOver } = useDroppable({
    id: format(day, 'yyyy-MM-dd'),
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-2 border rounded min-h-[80px]
        ${isToday(day) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
        ${isOver ? 'bg-blue-100' : ''}
      `}
    >
      <div className="text-right text-sm mb-1">
        {format(day, 'd')}
      </div>
      <div className="space-y-1">
        {tasks.map(task => (
          <div
            key={task.id}
            className="text-xs p-1 bg-white rounded border truncate"
            title={task.title}
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, updateTask } = usePlannerStore();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="p-2 hover:bg-gray-100 rounded"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayTasks = tasks.filter(task => task.date === format(day, 'yyyy-MM-dd'));
          return (
            <DroppableDay
              key={day.toString()}
              day={day}
              tasks={dayTasks}
            />
          );
        })}
      </div>
    </div>
  );
}
