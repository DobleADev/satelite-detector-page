// src/components/atoms/Badge/Badge.jsx

// Clases de Estilo Base (forma, tamaño de texto y padding)
const baseClasses = 
  "inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full";

// Mapeo de Clases por Color (variación de estilo)
const colorClasses = {
  blue: "bg-blue-100 text-blue-800",
  red: "bg-red-100 text-red-800",
  green: "bg-green-100 text-green-800",
  gray: "bg-gray-100 text-gray-800",
  // Puedes añadir más
};

const Badge = ({
  children,
  color = 'blue', // Color predeterminado
  className = '',
  ...restProps
}) => {
  
  // Buscamos las clases de color
  const selectedColorClass = colorClasses[color] || colorClasses.blue; // Fallback
  
  // Combinamos todas las clases
  const appliedClasses = [
    baseClasses,
    selectedColorClass,
    className,
  ].join(' ');

  // Retornamos el elemento <span>
  return (
    <span
      className={appliedClasses}
      {...restProps} 
    >
      {children}
    </span>
  );
};

export default Badge;