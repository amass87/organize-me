// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { DraggableTask } from '../components/planner/DraggableTask';
import Calendar from '../components/planner/Calendar';
import usePlannerStore from '../store/plannerStore';
import useThemeStore from '../store/themeStore';

export default function Dashboard() {
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  
  const theme = useThemeStore(state => state.getTheme());
  const tasks = usePlannerStore(state => state.tasks);
  const addTask = usePlannerStore(state => state.addTask);
  const toggleTask = usePlannerStore(state => state.toggleTask);
  const removeTask = usePlannerStore(state => state.removeTask);
  const updateTask = usePlannerStore(state => state.updateTask);
  const reorderTasks = usePlannerStore(state => state.reorderTasks);
  const fetchTasks = usePlannerStore(state => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    addTask({
      title: newTask,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: 'pending'
    });
    setNewTask('');
  };

  const sortedTasks = [...(tasks || [])].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return sortDirection === 'asc' 
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  return (
    <div className={`h-full ${theme.colors.background}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Column */}
          <div className="space-y-4">
            <div className={`${theme.colors.card} rounded-lg shadow-sm p-6`}>
              {/* Add Task Input */}
              <form onSubmit={handleAddTask} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.input} ${theme.colors.text} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Sort Button */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className={`px-3 py-1.5 rounded-lg border ${theme.colors.border} ${theme.colors.hover} transition-colors`}
                >
                  Sort by Date {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* Tasks List */}
              <DndContext collisionDetection={closestCenter}>
                <SortableContext
                  items={sortedTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sortedTasks.map(task => (
                      <DraggableTask
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onRemove={removeTask}
                        isHighlighted={task.date === format(selectedDate, 'yyyy-MM-dd')}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Calendar Column */}
          <div className={`${theme.colors.card} rounded-lg shadow-sm p-6`}>
            <Calendar 
              onDateSelect={setSelectedDate} 
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
