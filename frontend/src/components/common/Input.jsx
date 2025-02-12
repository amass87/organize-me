import React from 'react';

const Input = React.forwardRef(({
  type = 'text',
  placeholder,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm
          placeholder:text-gray-500
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950
          disabled:cursor-not-allowed disabled:opacity-50
          dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-400
          dark:focus-visible:ring-gray-300
          ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          ${className}
        `}
        ref={ref}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <span className="mt-1 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
});

const InputLabel = ({
  children,
  htmlFor,
  required,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
};

const InputGroup = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`space-y-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Input.displayName = 'Input';
InputLabel.displayName = 'InputLabel';
InputGroup.displayName = 'InputGroup';

export { Input, InputLabel, InputGroup };
