import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import RelationField from './RelationField';
import { readFormData } from '../services/fileService';

const FormBuilder = ({ schema, allSchemas, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [relationsData, setRelationsData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
    
    // Effacer l'erreur si le champ est rempli
    if (errors[fieldId] && value) {
      const newErrors = {...errors};
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const handleRelationChange = (relationId, value) => {
    setRelationsData({
      ...relationsData,
      [relationId]: value
    });
    
    if (errors[relationId] && value) {
      const newErrors = {...errors};
      delete newErrors[relationId];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Valider les champs standards
    schema.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'Ce champ est obligatoire';
        isValid = false;
      }
    });
    
    // Valider les relations
    if (schema.relations) {
      schema.relations.forEach(relation => {
        if (relation.required && !relationsData[relation.id]) {
          newErrors[relation.id] = 'Cette relation est obligatoire';
          isValid = false;
        }
      });
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const data = {
        schemaId: schema.id,
        schemaName: schema.name,
        data: formData,
        relations: relationsData,
        createdAt: new Date().toISOString()
      };
      
      onSubmit(data);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-bold mb-4">
        Formulaire: {schema.name}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Champs standards */}
        {schema.fields.map(field => (
          <div key={field.id} className="mb-4">
            <FormField
              field={field}
              value={formData[field.id] || ''}
              onChange={(value) => handleChange(field.id, value)}
              error={errors[field.id]}
            />
          </div>
        ))}
        
        {/* Champs de relation */}
        {schema.relations && schema.relations.length > 0 && (
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-semibold mb-3">Relations</h3>
            
            {schema.relations.map(relation => {
              const targetSchema = allSchemas.find(s => s.id === relation.targetSchema);
              return targetSchema ? (
                <div key={relation.id} className="mb-4">
                  <RelationField
                    relation={relation}
                    targetSchema={targetSchema}
                    allSchemas={allSchemas}
                    value={relationsData[relation.id] || (relation.relationType.includes('Many') ? [] : '')}
                    onChange={(value) => handleRelationChange(relation.id, value)}
                    error={errors[relation.id]}
                  />
                </div>
              ) : null;
            })}
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;