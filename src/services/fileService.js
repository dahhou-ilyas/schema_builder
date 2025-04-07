const fileService = {
  // Dans une application web, ces fonctions seraient remplacées par des appels API vers un serveur
  // Ce code simule la persistance en utilisant localStorage
  
  readSchemas: () => {
    try {
      const schemas = localStorage.getItem('schemas');
      return schemas ? JSON.parse(schemas) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des schémas:', error);
      return [];
    }
  },
  
  saveSchema: (schema) => {
    try {
      const schemas = fileService.readSchemas();
      // Vérifier si le schéma existe déjà (mise à jour)
      const existingIndex = schemas.findIndex(s => s.id === schema.id);
      
      if (existingIndex >= 0) {
        schemas[existingIndex] = schema;
      } else {
        schemas.push(schema);
      }
      
      localStorage.setItem('schemas', JSON.stringify(schemas));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du schéma:', error);
      return false;
    }
  },
  
  readFormData: (schemaId) => {
    try {
      const key = `formData_${schemaId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des données du formulaire:', error);
      return [];
    }
  },
  
  saveFormData: (schemaId, formData) => {
    try {
      // Générer un ID pour le formulaire s'il n'en a pas
      if (!formData.id) {
        formData.id = Math.random().toString(36).substring(2, 15);
      }
      
      const key = `formData_${schemaId}`;
      const existingData = fileService.readFormData(schemaId);
      
      // Vérifier si le formulaire existe déjà (mise à jour)
      const existingIndex = existingData.findIndex(d => d.id === formData.id);
      
      if (existingIndex >= 0) {
        existingData[existingIndex] = formData;
      } else {
        existingData.push(formData);
      }
      
      localStorage.setItem(key, JSON.stringify(existingData));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données du formulaire:', error);
      return false;
    }
  },
  
  // Nouvelle fonction pour obtenir les détails d'une relation
  getRelatedData: (schemaId, relationId, itemId) => {
    try {
      // Charger le schéma pour obtenir les informations de relation
      const schemas = fileService.readSchemas();
      const schema = schemas.find(s => s.id === schemaId);
      
      if (!schema) return null;
      
      const relation = schema.relations.find(r => r.id === relationId);
      if (!relation) return null;
      
      // Charger les données cibles
      const targetData = fileService.readFormData(relation.targetSchema);
      return targetData.find(item => item.id === itemId);
    } catch (error) {
      console.error('Erreur lors de la récupération des données liées:', error);
      return null;
    }
  }
};

export const {
  readSchemas,
  saveSchema,
  readFormData,
  saveFormData,
  getRelatedData
} = fileService;