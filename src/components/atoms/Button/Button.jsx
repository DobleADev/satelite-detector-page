// 1. Clases de Estilo Base (siempre se aplican)
const baseClasses = 
  "font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

// 2. Mapeo de Clases por Variante (color y hover)
const variantClasses = {
  primary: 
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500/50",
  secondary: 
    "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400/50",
  // Puedes añadir más (ej. 'danger', 'success')
};

// 3. Mapeo de Clases por Tamaño (padding y texto)
const sizeClasses = {
  small: "text-sm py-1 px-3",
  medium: "text-base py-2 px-4", // Este será el predeterminado
  large: "text-lg py-3 px-6",
};

// El componente principal recibe todas las props
const Button = ({
  children,
  variant = 'primary', // Valor predeterminado
  size = 'medium',     // Valor predeterminado
  disabled = false,    // Valor predeterminado
  onClick,
  className = '',      // Clase opcional inyectada por el componente padre
  ...restProps         // Captura otras props nativas (como 'type' en un formulario)
}) => {
  
  // 4. Lógica para combinar todas las clases
  const appliedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className, // ¡Muy importante! Agrega las clases que vienen desde afuera
  ].join(' '); // Une todos los strings de clases en un solo string

  // 5. Retornar el JSX
  return (
    <button
      type="button" // Valor por defecto, se puede sobrescribir con ...restProps
      className={appliedClasses}
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;