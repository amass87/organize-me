// src/components/planner/DraggableTask.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, Trash2 } from 'lucide-react';

export function DraggableTask({ task, onToggle, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const handleToggleClick = (e) => {
    e.stopPropagation();
    console.log('Toggle clicked for task:', task.id);
    onToggle(task.id);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    console.log('Remove clicked for task:', task.id);
    onRemove(task.id);
  };

  return (
    <div 
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      {...attributes}
      {...listeners}
      className={`
        flex items-center justify-between p-3 rounded-lg shadow-sm border cursor-move
        ${task.status === 'completed' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200 hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleToggleClick}
          className={`
            p-1 rounded-full transition-colors
            ${task.status === 'completed' 
              ? 'text-green-600 hover:text-green-700' 
              : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          <CheckCircle2 size={20} />
        </button>
        <span className={`
          ${task.status === 'completed' 
            ? 'line-through text-green-700' 
            : 'text-gray-900'} 
          font-medium
        `}>
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
        <span className="text-sm text-gray-600">{task.date}</span>
        <button 
          type="button"
          onClick={handleRemoveClick}
          className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors"
          title="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
