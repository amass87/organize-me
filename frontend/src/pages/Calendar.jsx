// src/pages/Calendar.jsx
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import usePlannerStore from '../store/plannerStore';
import Calendar from '../components/planner/Calendar';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = usePlannerStore(state => state.tasks);

  const dailyTasks = tasks.filter(task => 
    task.date === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Calendar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <Calendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Tasks for Selected Date */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <div className="space-y-2">
            {dailyTasks.length > 0 ? (
              dailyTasks.map(task => (
                <div 
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className={`${
                      task.status === 'completed' 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}>
                      {task.title}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks for this day</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
