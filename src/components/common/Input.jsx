// src/components/common/Input.jsx
import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-dark mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-secondary" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-10' : ''} 
            border rounded-lg
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-success-quindio'}
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;