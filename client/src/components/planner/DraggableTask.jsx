//src/components/planner/DraggableTask.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, Trash2 } from 'lucide-react';

export function DraggableTask({ task, onToggle, onRemove, isHighlighted }) {
  const { colors } = useThemeStore(state => state.getTheme());
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
      className={`
        relative flex items-center justify-between p-3 rounded-lg shadow-sm
        ${colors.card} ${colors.text} ${colors.border} ${colors.hover}
        ${isHighlighted ? 'ring-2 ring-blue-500' : 'border'}
        ${task.status === 'completed' ? 'opacity-75' : ''}
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
            className={task.status === 'completed' ? 'text-green-500' : 'text-gray-400'}
          />
        </button>
        <span className={task.status === 'completed' ? 'line-through text-gray-500' : colors.text}>
          {task.title}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <span className={colors.textSecondary}>{task.date}</span>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(task.id);
          }}
          className="p-1 rounded-full transition-colors hover:bg-red-100"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}
