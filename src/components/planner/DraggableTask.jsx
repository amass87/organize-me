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

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(task.id);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  return (
    <div 
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className="relative flex items-center justify-between p-3 rounded-lg shadow-sm border bg-white"
    >
      {/* Handle for dragging */}
      <div className="absolute inset-0 cursor-move" {...attributes} {...listeners} />
      
      {/* Content - higher z-index to be clickable */}
      <div className="relative z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggleClick}
          className="p-1 rounded-full transition-colors hover:bg-gray-100"
        >
          <CheckCircle2 
            size={20} 
            className={task.status === 'completed' ? 'text-green-600' : 'text-gray-400'}
          />
        </button>
        <span className={task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}>
          {task.title}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <span className="text-sm text-gray-600">{task.date}</span>
        <button 
          type="button"
          onClick={handleRemoveClick}
          className="p-1 rounded-full transition-colors hover:bg-gray-100"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
