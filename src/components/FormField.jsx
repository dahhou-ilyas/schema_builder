import React from 'react';


const FormField = ({ field, value, onChange, error }) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <div>
            <label className="block mb-1">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
        );
      
      case 'textarea':
        return (
          <div>
            <label className="block mb-1">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
        );
      
      case 'select':
        return (
          <div>
            <label className="block mb-1">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Sélectionnez...</option>
              {field.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
        );
      
      case 'radio':
        return (
          <div>
            <label className="block mb-1">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-1">
              {field.options.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={field.id}
                    checked={value === option}
                    onChange={() => onChange(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) => onChange(e.target.checked)}
                className="mr-2"
              />
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
        );
      
        default:
            return null;
    }
};
  
export default FormField;