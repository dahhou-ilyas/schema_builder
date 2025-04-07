const SchemaList = ({ schemas, onSelectSchema }) => {
  if (schemas.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 rounded">
        <p>Aucun schéma n'a été créé. Créez votre premier schéma !</p>
      </div>
    );
  }

  // Fonction pour déterminer les relations d'un schéma
  const getRelationsInfo = (schema) => {
    if (!schema.relations || schema.relations.length === 0) {
      return "Aucune relation";
    }
    
    return `${schema.relations.length} relation(s)`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Schémas disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemas.map(schema => (
          <div 
            key={schema.id} 
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50"
            onClick={() => onSelectSchema(schema)}
          >
            <h3 className="font-bold text-lg">{schema.name}</h3>
            <p className="text-gray-500">{schema.fields.length} champ(s)</p>
            <p className="text-gray-500">{getRelationsInfo(schema)}</p>
            <p className="text-gray-400 text-sm mt-2">
              Créé le {new Date(schema.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaList;