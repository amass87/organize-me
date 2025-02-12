import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableTask } from './DraggableTask';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Search, Plus } from 'lucide-react';

const FILTER_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export default function TaskList({ 
  tasks, 
  onToggleTask, 
  onRemoveTask, 
  onReorderTasks,
  onUpdatePriority,
  onAddTask 
}) {
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = tasks
    .filter(task => {
      if (filter === FILTER_OPTIONS.ACTIVE) return task.status !== 'completed';
      if (filter === FILTER_OPTIONS.COMPLETED) return task.status === 'completed';
      return true;
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      onReorderTasks(oldIndex, newIndex);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    onAddTask(newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {Object.values(FILTER_OPTIONS).map(option => (
            <Button
              key={option}
              variant={filter === option ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Add new task */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!newTaskTitle.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>

      {/* Task list */}
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map(task => (
              <DraggableTask
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onRemove={onRemoveTask}
                onUpdatePriority={onUpdatePriority}
              />
            ))}
          </SortableContext>
        </DndContext>

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? 'No tasks match your search'
              : filter === FILTER_OPTIONS.COMPLETED
              ? 'No completed tasks'
              : filter === FILTER_OPTIONS.ACTIVE
              ? 'No active tasks'
              : 'No tasks yet'}
          </div>
        )}
      </div>
    </div>
  );
}
