import { useState } from 'react';
import { ListBulletIcon, PlusIcon, CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { DraggableTask } from '../components/planner/DraggableTask';
import Calendar from '../components/planner/Calendar';
import usePlannerStore from '../store/plannerStore';

export default function Dashboard() {
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const tasks = usePlannerStore(state => state.tasks);
  const addTask = usePlannerStore(state => state.addTask);
  const toggleTask = usePlannerStore(state => state.toggleTask);
  const removeTask = usePlannerStore(state => state.removeTask);
  const updateTask = usePlannerStore(state => state.updateTask);
  const reorderTasks = usePlannerStore(state => state.reorderTasks);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    addTask({
      title: newTask,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: 'pending'
    });
    setNewTask('');
    setIsDatePickerOpen(false); // Close the date picker after adding task
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      if (over.id in tasks.map(t => t.id)) {
        const oldIndex = tasks.findIndex(task => task.id === active.id);
        const newIndex = tasks.findIndex(task => task.id === over.id);
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        reorderTasks(newTasks);
      } else {
        updateTask(active.id, { date: over.id });
      }
    }
  };

  const handleClickOutside = (e) => {
    if (isDatePickerOpen && !e.target.closest('.date-picker-container')) {
      setIsDatePickerOpen(false);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <ListBulletIcon className="w-5 h-5" />
          </div>

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
                <Calendar onDateSelect={handleDateSelect} />
              </div>
            )}
          </form>

          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tasks.map(task => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onRemove={removeTask}
                />
              ))}
            </div>
          </SortableContext>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        </div>
      </div>
    </DndContext>
  );
}
