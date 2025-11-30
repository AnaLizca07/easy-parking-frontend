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
        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5" style={{color: 'var(--color-text-secondary)'}} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field w-full ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm" style={{color: 'var(--color-error-600)'}}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;