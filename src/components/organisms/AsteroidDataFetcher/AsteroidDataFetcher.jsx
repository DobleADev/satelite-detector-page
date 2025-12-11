// src/components/organisms/AsteroidDataFetcher/AsteroidDataFetcher.jsx

import React, { useState, useEffect } from 'react';
import { getAsteroidsByDate } from '../../../services/neoApi'; 

// Importa los componentes del Módulo 1
import { Spinner } from '../../atoms/Spinner';
import { AlertMessage } from '../../atoms/AlertMessage';
// Importaremos Table en el Módulo 3, por ahora solo mostramos texto
// import { Table } from '../Table'; 

// Función de utilidad para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDate = () => {
    const d = new Date();
    // Padding con '0' para asegurar el formato de dos dígitos
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AsteroidDataFetcher = () => {
    // 1. Estados necesarios:
    const [asteroids, setAsteroids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Lógica de Asincronía con useEffect
    useEffect(() => {
        // Definimos la función de fetch asíncrona dentro de useEffect
        const fetchAsteroidData = async () => {
            // 2.1. Resetear estados
            setLoading(true);
            setError(null);
            
            const date = getTodayDate();

            try {
                const data = await getAsteroidsByDate(date);
                setAsteroids(data);
                
            } catch (err) {
                // 2.2. Capturar y establecer el mensaje de error
                setError(err.message || "Ocurrió un error desconocido.");
            } finally {
                // 2.3. Siempre detener la carga al final, sin importar el resultado
                setLoading(false);
            }
        };

        fetchAsteroidData();
        
        // Dependencias vacías: solo se ejecuta una vez al montar el componente
    }, []); 

    // 3. Renderizado Condicional (Los 3 Estados)

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Spinner size="large" color="indigo" />
                <p className="ml-4 text-indigo-600">Cargando datos de la NASA...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10">
                <AlertMessage type="error">
                    <h4 className="font-bold">Error de Conexión</h4>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">Asegúrate de que tu clave de API sea correcta y esté en el archivo .env.</p>
                </AlertMessage>
            </div>
        );
    }

    // 4. Estado de Éxito (Muestra la data, que luego será la Tabla)
    return (
        <div className="p-4">
            <AlertMessage type="success" className="mb-4">
                Datos cargados con éxito para la fecha: {getTodayDate()}. Se encontraron {asteroids.length} asteroides.
            </AlertMessage>
            
            {/* Aquí es donde irá el Módulo 3 (La Tabla) */}
            <h3 className="text-lg font-semibold mt-6">Datos Recibidos (Muestra temporal):</h3>
            <pre className="bg-gray-800 text-white p-3 overflow-auto rounded-lg text-xs max-h-96">
                {JSON.stringify(asteroids.slice(0, 3), null, 2)} {/* Mostramos solo los primeros 3 */}
            </pre>
            
            {/* Si ya tuvieras el componente Table listo, sería así: 
            <Table data={asteroids} columns={...} /> 
            */}
        </div>
    );
};

export default AsteroidDataFetcher;