// src/components/molecules/Table/Table.jsx

const Table = ({ columns, data, className = '' }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 italic p-4">No hay datos para mostrar.</p>;
  }

  // 1. Clases base y responsividad clave
  // overflow-x-auto: Permite el scroll horizontal en contenedores pequeños
  const containerClasses = `overflow-x-auto rounded-lg shadow-md ${className}`;
  
  // Tailwind: Estilo de tabla fija y borde
  const tableClasses = 'min-w-full divide-y divide-gray-200 border border-gray-200';

  return (
    <div className={containerClasses}>
      <table className={tableClasses}>
        
        {/* ENCABEZADOS (thead) */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* CUERPO DE LA TABLA (tbody) */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            // Uso de zebra stripes: odd:bg-gray-50 aplica el fondo gris a filas impares
            <tr key={item.id || rowIndex} className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition duration-150">
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {/* Accedemos al valor del objeto usando la clave definida en 'accessor' */}
                  {/* Si hay un renderizador personalizado (formatter), lo usamos */}
                  {column.formatter 
                    ? column.formatter(item[column.accessor], item)
                    : item[column.accessor]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;