// src/components/atoms/Input/Input.jsx

// Clases de Estilo Base
const baseClasses = 
  "block w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight transition duration-150 ease-in-out focus:outline-none focus:ring-2";

// El componente recibe todas las props necesarias para un input HTML normal
// más nuestra prop personalizada `error`.
const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = false, // Nuestra prop personalizada para manejar el estado de error
  className = '',
  ...restProps // Para capturar props nativas como 'id', 'name', 'required', etc.
}) => {
  
  // Lógica condicional para el estilo del borde
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-300" 
    : "border-gray-300 focus:ring-indigo-300";
  
  // Combinamos todas las clases
  const appliedClasses = [
    baseClasses,
    errorClasses,
    className,
  ].join(' ');

  // Retornamos el elemento <input>
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={appliedClasses}
      // Esparce el resto de props para hacerlo muy flexible
      {...restProps} 
    />
  );
};

export default Input;