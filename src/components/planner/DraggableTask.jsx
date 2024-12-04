// src/components/planner/DraggableTask.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function DraggableTask({ task, onToggle, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <input 
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggle(task.id)}
          className="rounded border-gray-300"
        />
        <span className={`${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'} font-medium`}>
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{task.date}</span>
        <button 
          onClick={() => onRemove(task.id)}
          className="text-red-500 hover:text-red-700 font-bold px-2"
        >
          ×
        </button>
      </div>
    </div>
  );
}