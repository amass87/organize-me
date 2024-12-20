// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { ListBulletIcon, PlusIcon, CalendarIcon } from '@radix-ui/react-icons';
import { format, parseISO } from 'date-fns';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { DraggableTask } from '../components/planner/DraggableTask';
import Calendar from '../components/planner/Calendar';
import usePlannerStore from '../store/plannerStore';
import usePreferencesStore from '../store/preferencesStore';

export default function Dashboard() {
  const [sortDirection, setSortDirection] = useState('asc');
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const tasks = usePlannerStore(state => state.tasks);
  const addTask = usePlannerStore(state => state.addTask);
  const toggleTask = usePlannerStore(state => state.toggleTask);
  const removeTask = usePlannerStore(state => state.removeTask);
  const updateTask = usePlannerStore(state => state.updateTask);
  const reorderTasks = usePlannerStore(state => state.reorderTasks);
  const fetchTasks = usePlannerStore(state => state.fetchTasks);
  const loading = usePlannerStore(state => state.loading);
  const error = usePlannerStore(state => state.error);

  const showCompletedTasks = usePreferencesStore(state => state.showCompletedTasks);
  const groupByDate = usePreferencesStore(state => state.groupByDate);

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
    setIsDatePickerOpen(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || !tasks) return;  // Add tasks check

    if (active.id !== over.id) {
      const taskIds = Array.isArray(tasks) ? tasks.map(t => t.id) : [];  // Safe mapping
      if (over.id in taskIds) {
        const oldIndex = tasks.findIndex(task => task.id === active.id);
        const newIndex = tasks.findIndex(task => task.id === over.id);
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        reorderTasks(newTasks);
      } else {
        updateTask(active.id, { date: over.id });
      }
    }
  };

  // Initialize with empty arrays if tasks is not iterable
  const sortedTasks = Array.isArray(tasks) ? [...tasks].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return sortDirection === 'asc' 
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  }) : [];

  const filteredTasks = Array.isArray(sortedTasks) ? sortedTasks.filter(task =>
    showCompletedTasks ? true : task.status !== 'completed'
  ) : [];

  const groupedTasks = groupByDate && Array.isArray(filteredTasks)
    ? filteredTasks.reduce((groups, task) => {
        const date = task.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(task);
        return groups;
      }, {})
    : {};

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border"
                title={`Sort by date ${sortDirection === 'asc' ? 'oldest first' : 'newest first'}`}
              >
                <span>Sort by Date</span>
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center p-4">
              <div className="text-gray-500">Loading tasks...</div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center p-4">
              <div className="text-red-500">Error: {error}</div>
            </div>
          )}

          <form onSubmit={handleAddTask} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Add new task..."
              />
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                title="Select date"
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
              <button 
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <PlusIcon />
              </button>
            </div>
            {isDatePickerOpen && (
              <div className="absolute mt-2 bg-white border rounded-lg shadow-lg z-50">
                <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>
            )}
          </form>

          {!groupByDate ? (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onRemove={removeTask}
                  isHighlighted={task.date === format(selectedDate, 'yyyy-MM-dd')}
                />
              ))}
            </div>
          ) : (
            Object.entries(groupedTasks || {}).map(([date, tasks]) => (
              <div key={date} className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {format(parseISO(date), 'MMMM d, yyyy')}
                </h3>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onRemove={removeTask}
                      isHighlighted={task.date === format(selectedDate, 'yyyy-MM-dd')}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        </div>
      </div>
    </DndContext>
  );
}
