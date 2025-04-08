import React from 'react';


///////
// j'ai besoin de fixer les nom de champe dans le json (dans les realtion c'est à dire les field de relation ) et aussi faire l'unicité
//{schemaId: "311be5b3-904a-4103-ab8b-74ebed31bd64", schemaName: "sss", data: {def: "sasses"}, relations: {e08d75b4-bf10-4742-942e-8afc502cf3df: ["0i3fki3jsmta", "8k2xxjs7hri", "3qfmev29j78"]}, createdAt: "2025-04-08T09:54:10.957Z"}
/////// il y a d'baord just unicité et aprée je doit ajouté regex

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