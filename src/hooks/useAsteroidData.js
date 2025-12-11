// src/hooks/useAsteroidData.js

import { useState, useEffect, useCallback } from 'react';
import { getAsteroidsByDate } from '../services/neoApi'; // Ajusta la ruta si es necesario

const ITEMS_PER_PAGE = 10;

// Función de utilidad para obtener la fecha de hoy (movida aquí)
const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useAsteroidData = () => {
    // ESTADOS (Data Bruta y UI)
    const [asteroids, setAsteroids] = useState([]); // Datos brutos de la API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ESTADOS DE FUNCIONALIDAD (Paginación y Filtrado)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // ** LÓGICA DE FETCH (Corre solo una vez al montar) **
    useEffect(() => {
        const fetchAsteroidData = async () => {
            setLoading(true);
            setError(null);
            const date = getTodayDate();

            try {
                const data = await getAsteroidsByDate(date);
                setAsteroids(data);
            } catch (err) {
                setError(err.message || "Ocurrió un error desconocido.");
            } finally {
                setLoading(false);
            }
        };

        fetchAsteroidData();
    }, []);

    // ** LÓGICA DE RESET DE PÁGINA (Corre cada vez que el filtro cambia) **
    useEffect(() => {
        // Al cambiar el filtro, volvemos a la página 1.
        setCurrentPage(1);
    }, [searchTerm]);


    // ************************************************************
    // ** LÓGICA DE PROCESAMIENTO DE DATOS (Filtrado -> Paginación) **
    // ************************************************************

    // 1. FILTRADO (Se aplica a los datos brutos)
    const filteredAsteroids = asteroids.filter(neo => {
        if (!searchTerm) return true; 
        return neo.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // 2. PAGINACIÓN (Se aplica a los datos FILTRADOS)
    
    // a) Calcular el total de páginas
    const totalPages = Math.ceil(filteredAsteroids.length / ITEMS_PER_PAGE);

    // b) Definir el slice
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // c) Aplicar el slice
    const paginatedData = filteredAsteroids.slice(startIndex, endIndex);

    // d) Función de navegación (Usamos useCallback para optimizar, aunque es opcional aquí)
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]); // totalPages es una dependencia importante

    // El hook retorna todas las propiedades y funciones que el componente necesita
    return {
        loading,
        error,
        paginatedData,
        totalPages,
        currentPage,
        searchTerm,
        filteredCount: filteredAsteroids.length, // Retornamos el conteo filtrado
        setSearchTerm, // Función para actualizar el input de búsqueda
        handlePageChange, // Función para navegar entre páginas
    };
};