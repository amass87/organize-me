import React from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';

export function LoadingSpinner({ size = 'default', className = '' }) {
  const sizes = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`animate-spin ${sizes[size]} text-blue-500`} />
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center">
        <LoadingSpinner size="large" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

export function Alert({ 
  variant = 'info',
  message,
  title,
  onClose,
  className = ''
}) {
  const variants = {
    info: {
      containerClass: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900',
      iconClass: 'text-blue-500',
      Icon: Info,
      titleClass: 'text-blue-900 dark:text-blue-100'
    },
    success: {
      containerClass: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900',
      iconClass: 'text-green-500',
      Icon: CheckCircle2,
      titleClass: 'text-green-900 dark:text-green-100'
    },
    warning: {
      containerClass: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900',
      iconClass: 'text-yellow-500',
      Icon: AlertCircle,
      titleClass: 'text-yellow-900 dark:text-yellow-100'
    },
    error: {
      containerClass: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900',
      iconClass: 'text-red-500',
      Icon: XCircle,
      titleClass: 'text-red-900 dark:text-red-100'
    }
  };

  const { containerClass, iconClass, Icon, titleClass } = variants[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${containerClass} ${className}`}>
      <Icon className={`h-5 w-5 mt-0.5 ${iconClass}`} />
      <div className="flex-1">
        {title && (
          <h3 className={`font-medium mb-1 ${titleClass}`}>
            {title}
          </h3>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <XCircle className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
}

export function EmptyState({ 
  title,
  description,
  icon: Icon,
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800 mb-4">
          <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export function ProgressBar({ 
  value,
  max = 100,
  size = 'default',
  variant = 'primary',
  showValue = false,
  className = ''
}) {
  const percentage = Math.round((value / max) * 100);
  
  const sizes = {
    small: 'h-1',
    default: 'h-2',
    large: 'h-3'
  };

  const variants = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizes[size]}`}>
        <div
          className={`${sizes[size]} ${variants[variant]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {percentage}%
        </p>
      )}
    </div>
  );
}
