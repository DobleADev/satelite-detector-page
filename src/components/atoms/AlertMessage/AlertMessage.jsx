// src/components/atoms/AlertMessage/AlertMessage.jsx

// 1. Mapeo de Clases por Tipo
const typeClasses = {
  error: 'bg-red-100 border-red-400 text-red-700',
  success: 'bg-green-100 border-green-400 text-green-700',
  info: 'bg-blue-100 border-blue-400 text-blue-700',
};

const AlertMessage = ({
  children, // El contenido del mensaje
  type = 'info', // Opciones: 'error', 'success', 'info'
  className = '',
  ...restProps
}) => {
  
  // 2. Clases base (padding, borde, sombra)
  const baseClasses = 
    'border px-4 py-3 rounded relative shadow-sm';

  // 3. Clases de tipo
  const selectedTypeClass = typeClasses[type] || typeClasses.info; 
  
  // 4. Combinación
  const appliedClasses = [
    baseClasses,
    selectedTypeClass,
    className,
  ].join(' ');

  return (
    <div
      className={appliedClasses}
      role="alert" // Accesibilidad: indica que el contenido es importante
      {...restProps}
    >
      {/* El children puede ser un string o JSX complejo */}
      {children}
    </div>
  );
};

export default AlertMessage;