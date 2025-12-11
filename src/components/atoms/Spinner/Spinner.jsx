// src/components/atoms/Spinner/Spinner.jsx

const Spinner = ({
  size = 'medium', // Opciones: 'small', 'medium', 'large'
  color = 'indigo', // Opciones: 'indigo', 'gray', etc.
  className = '',
  ...restProps
}) => {
  
  // 1. Mapeo para el tamaño (ancho y alto)
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-6', // border-6 no existe en tailwind por defecto, usamos border-4 o border-[6px]
  }[size] || 'w-8 h-8 border-4';

  // 2. Mapeo para el color del borde
  // Nota: El color principal debe ser visible, y la parte 'transparente' es la que simula el movimiento.
  const colorClasses = {
    indigo: 'border-indigo-500 border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
  }[color] || 'border-indigo-500 border-t-transparent';

  // 3. Clases base y combinación
  const baseClasses = 'rounded-full animate-spin';
  
  const appliedClasses = [
    baseClasses,
    sizeClasses,
    colorClasses,
    className,
  ].join(' ');

  return (
    <div
      className={appliedClasses}
      role="status" // Accesibilidad: indica que es un estado
      aria-live="polite" // Indica que el contenido puede cambiar
      {...restProps}
    >
      <span className="sr-only">Cargando...</span> {/* Texto oculto para lectores de pantalla */}
    </div>
  );
};

export default Spinner;