import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, Trash2, Flag } from 'lucide-react';

const priorityStyles = {
  high: {
    indicator: 'bg-red-500',
    border: 'border-red-200',
    hover: 'hover:bg-red-50',
    text: 'text-red-700',
  },
  medium: {
    indicator: 'bg-yellow-500',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-50',
    text: 'text-yellow-700',
  },
  low: {
    indicator: 'bg-blue-500',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-50',
    text: 'text-blue-700',
  }
};

export function DraggableTask({ task, onToggle, onRemove, isHighlighted, onUpdatePriority }) {
  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const priorityStyle = priorityStyles[task.priority || 'medium'];

  return (
    <div 
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={`
        relative flex items-center justify-between p-3 rounded-lg shadow-sm border
        ${isHighlighted ? 'border-green-500 border-2' : 'border-gray-200'}
        ${task.status === 'completed' ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}
        transition-all duration-200
      `}
    >
      <div className="absolute inset-0 cursor-move" {...attributes} {...listeners} />
      
      <div className="relative z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="p-1 rounded-full transition-colors hover:bg-gray-100"
        >
          <CheckCircle2 
            size={20} 
            className={task.status === 'completed' ? 'text-green-600' : 'text-gray-400'}
          />
        </button>
        <div className={`w-2 h-2 rounded-full ${priorityStyle.indicator}`} />
        <span className={task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}>
          {task.title}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <span className="text-sm text-gray-600">{task.date}</span>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPriorityMenuOpen(!isPriorityMenuOpen);
            }}
            className="p-1 rounded-full transition-colors hover:bg-gray-100"
          >
            <Flag size={18} className={priorityStyle.text} />
          </button>
          {isPriorityMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPriorityMenuOpen(false);
                  }}
                />
                <div 
                  className="absolute right-0 mt-1 rounded-lg shadow-2xl py-1 z-50 w-32 transform -translate-x-8"
                  style={{
                    backgroundColor: '#FFFFFF',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  {Object.keys(priorityStyles).map((priority) => (
                    <button
                      key={priority}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePriority(task.id, priority);
                        setIsPriorityMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm capitalize hover:bg-gray-50 text-gray-900 flex items-center gap-2"
                      style={{
                        backgroundColor: '#FFFFFF',
                        position: 'relative',
                        zIndex: 51
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${priorityStyles[priority].indicator}`} />
                      <span>{priority}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(task.id);
          }}
          className="p-1 rounded-full transition-colors hover:bg-gray-100"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
