// src/services/neoApi.js

// 1. Acceso seguro a la Variable de Entorno (Vite)
const API_KEY = import.meta.env.VITE_NASA_API_KEY; 
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

/**
 * Normaliza los datos complejos de la API de la NASA a un array plano y usable.
 * @param {object} rawData - El objeto JSON crudo de la API.
 * @returns {Array} Un array de objetos de asteroides limpios.
 */
const normalizeAsteroidData = (rawData) => {
    // La API devuelve un objeto donde las claves son las fechas.
    const nearEarthObjects = rawData.near_earth_objects; 
    
    let normalizedList = [];

    // Iteramos sobre cada fecha que la API nos da
    for (const date in nearEarthObjects) {
        // Concatenamos todos los asteroides de esa fecha
        normalizedList = normalizedList.concat(
            nearEarthObjects[date].map(neo => ({
                id: neo.id,
                name: neo.name,
                // Usamos la velocidad más reciente (km/h)
                velocity: neo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour,
                // Usamos el diámetro estimado promedio
                diameterMeters: (neo.estimated_diameter.meters.estimated_diameter_min + neo.estimated_diameter.meters.estimated_diameter_max) / 2,
                // Campo clave para el filtrado: si es potencialmente peligroso
                isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
                closeApproachDate: neo.close_approach_data[0]?.close_approach_date,
            }))
        );
    }
    
    return normalizedList;
};

/**
 * Obtiene los datos de asteroides para un rango de fechas de un solo día.
 * @param {string} date - La fecha en formato 'YYYY-MM-DD'.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de asteroides normalizados.
 */
export const getAsteroidsByDate = async (date) => {
    if (!API_KEY) {
        throw new Error("Clave de API no definida. Agrega VITE_NASA_API_KEY al archivo .env");
    }

    const url = `${BASE_URL}?start_date=${date}&end_date=${date}&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Manejo de errores HTTP (ej. 403 Forbidden, 404 Not Found)
            const errorData = await response.json();
            throw new Error(errorData.error_message || `Error HTTP: ${response.status}`);
        }

        const rawData = await response.json();
        
        // Retornamos los datos limpios y listos para usar
        return normalizeAsteroidData(rawData);

    } catch (error) {
        console.error("Error al obtener datos de la NASA:", error);
        // Relanzamos el error para que el componente lo capture
        throw new Error(`Fallo en la llamada a la API: ${error.message}`);
    }
};