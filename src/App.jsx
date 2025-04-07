import React, { useState, useEffect } from 'react';
import SchemaBuilder from './components/SchemaBuilder';
import FormBuilder from './components/FormBuilder';
import SchemaList from './components/SchemaList';
import { readSchemas, saveSchema, saveFormData } from './services/fileService';

const App = () => {
  const [schemas, setSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState(null);
  const [mode, setMode] = useState('list');

  useEffect(() => {
    const data = async ()=>{
      const loadedSchemas =await readSchemas();
      setSchemas(loadedSchemas);
    }
    data()
  }, []);

  const handleCreateSchema = (schema) => {
    const newSchemas = [...schemas, schema];
    setSchemas(newSchemas);
    saveSchema(schema);
    setMode('list');
  };

  const handleSelectSchema = (schema) => {
    setCurrentSchema(schema);
    setMode('fillForm');
  };

  const handleSaveFormData = (data) => {
    saveFormData(currentSchema.id, data);
    setMode('list');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Générateur de schémas et formulaires</h1>
      
      {mode === 'list' && (
        <div>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => setMode('createSchema')}
          >
            Créer un nouveau schéma
          </button>
          <SchemaList 
            schemas={schemas} 
            onSelectSchema={handleSelectSchema} 
          />
        </div>
      )}
      
      {mode === 'createSchema' && (
        <SchemaBuilder 
          onSave={handleCreateSchema} 
          onCancel={() => setMode('list')} 
          existingSchemas={schemas}
        />
      )}
      
      {mode === 'fillForm' && currentSchema && (
        <FormBuilder 
          schema={currentSchema}
          allSchemas={schemas}
          onSubmit={handleSaveFormData}
          onCancel={() => setMode('list')} 
        />
      )}
    </div>
  );
};

export default App;