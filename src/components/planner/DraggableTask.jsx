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

  return (
    <div 
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className="flex items-center justify-between p-3 rounded-lg shadow-sm border bg-white"
    >
      {/* Draggable area */}
      <div 
        className="absolute inset-0 cursor-move" 
        {...attributes} 
        {...listeners}
      />

      {/* Content */}
      <div className="flex items-center gap-3 relative">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="p-1 rounded-full transition-colors hover:bg-gray-100 z-10"
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

      <div className="flex items-center gap-3 relative">
        <span className="text-sm text-gray-600">{task.date}</span>
        <button 
          type="button"
          onClick={() => onRemove(task.id)}
          className="p-1 rounded-full transition-colors hover:bg-gray-100 z-10"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
