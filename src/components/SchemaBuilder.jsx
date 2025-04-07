import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SchemaBuilder = ({ onSave, onCancel, existingSchemas = [] }) => {
  const [schemaName, setSchemaName] = useState('');
  const [fields, setFields] = useState([]);
  const [error,setError]=useState("");
  const [relations, setRelations] = useState([]);
  const [currentField, setCurrentField] = useState({
    name: '',
    type: 'text',
    required: false,
    options: []
  });
  const [currentRelation, setCurrentRelation] = useState({
    name: '',
    targetSchema: '',
    relationType: 'oneToOne',
    required: false
  });

  const fieldTypes = [
    'text', 'number', 'date', 'email', 'select', 
    'checkbox', 'textarea', 'radio'
  ];

  const relationTypes = [
    { id: 'oneToOne', label: 'One to One (1:1)' },
    { id: 'oneToMany', label: 'One to Many (1:N)' },
    { id: 'manyToOne', label: 'Many to One (N:1)' },
    { id: 'manyToMany', label: 'Many to Many (N:N)' }
  ];

  const addField = () => {
    const trimmedName = currentField.name.trim();
    if (trimmedName === '') return;

    // Vérifie si un champ avec le même nom existe déjà
    const nameExists = fields.some(field => field.name.trim().toLowerCase() === trimmedName.toLowerCase());
    if (nameExists) {
      setError("duplication field");
      return
    };

    setFields([...fields, { ...currentField, id: uuidv4() }]);
    setCurrentField({
      name: '',
      type: 'text',
      required: false,
      options: []
    });
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const addRelation = () => {
    if (currentRelation.name.trim() === '' || currentRelation.targetSchema === '') return;
    
    setRelations([...relations, { ...currentRelation, id: uuidv4() }]);
    setCurrentRelation({
      name: '',
      targetSchema: '',
      relationType: 'oneToOne',
      required: false
    });
  };

  const removeRelation = (id) => {
    setRelations(relations.filter(relation => relation.id !== id));
  };

  const handleSaveSchema = () => {
    if (schemaName.trim() === '') return;
    
    const schema = {
      id: uuidv4(),
      name: schemaName,
      fields: fields,
      relations: relations,
      createdAt: new Date().toISOString()
    };
    
    onSave(schema);
  };

  const addOption = () => {
    const option = prompt('Entrez une option:');
    if (option) {
      setCurrentField({
        ...currentField,
        options: [...currentField.options, option]
      });
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Créer un nouveau schéma</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Nom du schéma:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
        />
      </div>
      
      {/* Section des champs */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Champs</h3>
        
        {fields.map(field => (
          <div key={field.id} className="bg-white p-2 mb-2 rounded flex justify-between items-center">
            <div>
              <strong>{field.name}</strong> ({field.type})
              {field.required && <span className="text-red-500 ml-2">*</span>}
              {(field.type === 'select' || field.type === 'radio') && field.options.length > 0 && (
                <span className="ml-2">Options: {field.options.join(', ')}</span>
              )}
            </div>
            <button onClick={() => removeField(field.id)} className="text-red-500">
              Supprimer
            </button>
          </div>
        ))}
        
        <div className="bg-white p-3 rounded">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block mb-1">Nom du champ:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentField.name}
                onChange={(e) => setCurrentField({...currentField, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1">Type:</label>
              <select
                className="w-full p-2 border rounded"
                value={currentField.type}
                onChange={(e) => setCurrentField({...currentField, type: e.target.value})}
              >
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentField.required}
                onChange={(e) => setCurrentField({...currentField, required: e.target.checked})}
                className="mr-2"
              />
              Obligatoire
            </label>
          </div>
          
          {(currentField.type === 'select' || currentField.type === 'radio') && (
            <div className="mb-2">
              <div className="flex items-center">
                <div className="flex-grow">
                  {currentField.options.length === 0 ? (
                    <span className="text-gray-500">Aucune option définie</span>
                  ) : (
                    <span>Options: {currentField.options.join(', ')}</span>
                  )}
                </div>
                <button 
                  onClick={addOption}
                  className="bg-gray-200 px-2 py-1 rounded ml-2"
                >
                  + Ajouter une option
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={addField}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Ajouter le champ
          </button>
          {error && (
            <div className='text-red-500'>{error}</div>
          )}
        </div>
      </div>
      
      {/* Nouvelle section pour les relations */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Relations</h3>
        
        {relations.map(relation => (
          <div key={relation.id} className="bg-white p-2 mb-2 rounded flex justify-between items-center">
            <div>
              <strong>{relation.name}</strong> - 
              {relation.relationType === 'oneToOne' && '1:1'}
              {relation.relationType === 'oneToMany' && '1:N'}
              {relation.relationType === 'manyToOne' && 'N:1'}
              {relation.relationType === 'manyToMany' && 'N:N'}
              <span className="ml-2">→ {
                existingSchemas.find(s => s.id === relation.targetSchema)?.name || relation.targetSchema
              }</span>
              {relation.required && <span className="text-red-500 ml-2">*</span>}
            </div>
            <button onClick={() => removeRelation(relation.id)} className="text-red-500">
              Supprimer
            </button>
          </div>
        ))}
        
        <div className="bg-white p-3 rounded">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block mb-1">Nom de la relation:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentRelation.name}
                onChange={(e) => setCurrentRelation({...currentRelation, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1">Schéma cible:</label>
              <select
                className="w-full p-2 border rounded"
                value={currentRelation.targetSchema}
                onChange={(e) => setCurrentRelation({...currentRelation, targetSchema: e.target.value})}
              >
                <option value="">Sélectionnez un schéma...</option>
                {existingSchemas.map(schema => (
                  <option key={schema.id} value={schema.id}>{schema.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block mb-1">Type de relation:</label>
              <select
                className="w-full p-2 border rounded"
                value={currentRelation.relationType}
                onChange={(e) => setCurrentRelation({...currentRelation, relationType: e.target.value})}
              >
                {relationTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentRelation.required}
                  onChange={(e) => setCurrentRelation({...currentRelation, required: e.target.checked})}
                  className="mr-2"
                />
                Obligatoire
              </label>
            </div>
          </div>
          
          <button
            onClick={addRelation}
            className="bg-green-500 text-white px-3 py-1 rounded"
            disabled={existingSchemas.length === 0}
          >
            Ajouter la relation
          </button>
          {existingSchemas.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Créez d'abord d'autres schémas pour pouvoir définir des relations.
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Annuler
        </button>
        <button
          onClick={handleSaveSchema}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={schemaName.trim() === ''}
        >
          Enregistrer le schéma
        </button>
      </div>
    </div>
  );
};

export default SchemaBuilder;