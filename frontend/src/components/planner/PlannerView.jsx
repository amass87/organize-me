import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { format } from 'date-fns';
import Calendar from './Calendar';
import TaskList from './TaskList';
import { Card } from '../common/Card';
import usePlannerStore from '../../store/plannerStore';

export default function PlannerView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { 
    tasks, 
    addTask, 
    updateTask,
    removeTask,
    reorderTasks,
    moveTaskToDate 
  } = usePlannerStore(state => ({
    tasks: state.tasks,
    addTask: state.addTask,
    updateTask: state.updateTask,
    removeTask: state.removeTask,
    reorderTasks: state.reorderTasks,
    moveTaskToDate: state.moveTaskToDate
  }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    // If dropping on a date in the calendar
    if (over.id.includes('-')) {
      const taskId = active.id;
      const date = over.id; // Format: yyyy-MM-dd
      moveTaskToDate(taskId, date);
    }
  };

  const filteredTasks = tasks.filter(
    task => task.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleAddTask = (title) => {
    addTask({
      title,
      date: format(selectedDate, 'yyyy-MM-dd'),
      priority: 'medium',
      status: 'active'
    });
  };

  const handleUpdatePriority = (taskId, priority) => {
    updateTask(taskId, { priority });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </Card>

        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            <TaskList
              tasks={filteredTasks}
              onToggleTask={(taskId) => {
                const task = tasks.find(t => t.id === taskId);
                updateTask(taskId, {
                  status: task.status === 'completed' ? 'active' : 'completed'
                });
              }}
              onRemoveTask={removeTask}
              onReorderTasks={reorderTasks}
              onUpdatePriority={handleUpdatePriority}
              onAddTask={handleAddTask}
            />
          </div>
        </Card>
      </div>

      {/* Mobile view - stack calendar and tasks vertically */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DndContext>
  );
}
