import React, { useState, useEffect } from 'react';
import { readFormData } from '../services/fileService';

const RelationField = ({ relation, targetSchema, allSchemas, value, onChange, error }) => {
  const [availableItems, setAvailableItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  
  useEffect(() => {
    // Charger les données existantes pour le schéma cible
    const items = readFormData(targetSchema.id);
    setAvailableItems(items);
  }, [targetSchema.id]);

  const getDisplayValue = (item) => {
    // Trouver un champ "nom" ou utiliser le premier champ non-technique
    const displayField = targetSchema.fields.find(f => 
      f.name.toLowerCase().includes('nom') || f.name.toLowerCase().includes('name')
    ) || targetSchema.fields[0];
    
    return item.data[displayField.id] || 'Sans nom';
  };
  
  const handleItemSelect = (item) => {
    if (relation.relationType === 'oneToOne' || relation.relationType === 'manyToOne') {
      onChange(item.id);
    } else {
      // Pour les relations many, ajouter à la liste si pas déjà présent
      const newValue = Array.isArray(value) ? [...value] : [];
      if (!newValue.includes(item.id)) {
        newValue.push(item.id);
        onChange(newValue);
      }
    }
    setIsSelecting(false);
  };
  
  const handleRemoveItem = (itemId) => {
    if (relation.relationType === 'oneToOne' || relation.relationType === 'manyToOne') {
      onChange('');
    } else {
      const newValue = value.filter(id => id !== itemId);
      onChange(newValue);
    }
  };
  
  const filteredItems = availableItems.filter(item => {
    const displayText = getDisplayValue(item).toLowerCase();
    return displayText.includes(searchTerm.toLowerCase());
  });

  const renderSelectedItems = () => {
    if (relation.relationType === 'oneToOne' || relation.relationType === 'manyToOne') {
      // Pour les relations "one", afficher l'élément sélectionné
      if (!value) return null;
      
      const selectedItem = availableItems.find(item => item.id === value);
      if (!selectedItem) return null;
      
      return (
        <div className="bg-blue-100 p-2 rounded flex justify-between items-center mt-1">
          <span>{getDisplayValue(selectedItem)}</span>
          <button 
            type="button"
            onClick={() => handleRemoveItem(selectedItem.id)}
            className="text-red-500 ml-2"
          >
            ×
          </button>
        </div>
      );
    } else {
      // Pour les relations "many", afficher la liste des éléments sélectionnés
      if (!value || value.length === 0) return null;
      
      return (
        <div className="mt-1">
          {value.map(itemId => {
            const selectedItem = availableItems.find(item => item.id === itemId);
            if (!selectedItem) return null;
            
            return (
              <div key={itemId} className="bg-blue-100 p-2 rounded flex justify-between items-center mb-1">
                <span>{getDisplayValue(selectedItem)}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveItem(itemId)}
                  className="text-red-500 ml-2"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div>
      <label className="block mb-1">
        {relation.name}
        {relation.required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-gray-500 ml-2">
          {relation.relationType === 'oneToOne' && '(One to One)'}
          {relation.relationType === 'oneToMany' && '(One to Many)'}
          {relation.relationType === 'manyToOne' && '(Many to One)'}
          {relation.relationType === 'manyToMany' && '(Many to Many)'}
        </span>
      </label>
      
      <div className="relative">
        <div className="flex mb-1">
          <button
            type="button"
            onClick={() => setIsSelecting(!isSelecting)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            {isSelecting ? 'Annuler' : 'Sélectionner'} {targetSchema.name}
          </button>
          
          {relation.relationType.includes('Many') && value && value.length > 0 && (
            <span className="ml-2 bg-gray-100 px-2 py-1 rounded">
              {value.length} sélectionné(s)
            </span>
          )}
        </div>
        
        {renderSelectedItems()}
        
        {isSelecting && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg p-2">
            <input
              type="text"
              placeholder={`Rechercher un ${targetSchema.name}...`}
              className="w-full p-2 border rounded mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="max-h-48 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <p className="text-gray-500 text-center py-2">Aucun élément trouvé</p>
              ) : (
                filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleItemSelect(item)}
                  >
                    {getDisplayValue(item)}
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setIsSelecting(false)}
                className="text-blue-500"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default RelationField;