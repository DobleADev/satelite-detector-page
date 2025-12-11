// src/components/organisms/AsteroidDataFetcher/AsteroidDataFetcher.jsx

import React, { useState, useEffect } from 'react';
import { getAsteroidsByDate } from '../../../services/neoApi';

// Importa los componentes del Módulo 1
import { Spinner } from '../../atoms/Spinner';
import { AlertMessage } from '../../atoms/AlertMessage';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
// Importaremos Table en el Módulo 3, por ahora solo mostramos texto
import { Table } from '../../molecules/Table';
import { Pagination } from '../../molecules/Pagination';

const ITEMS_PER_PAGE = 10;

// Función de utilidad para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDate = () => {
    const d = new Date();
    // Padding con '0' para asegurar el formato de dos dígitos
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Dentro de AsteroidDataFetcher.jsx (Antes del componente funcional)

// Helper para formatear números largos
const formatNumber = (num) => new Intl.NumberFormat('es-DO', {
    maximumFractionDigits: 0
}).format(num);

// Definición de las columnas de la tabla
const ASTEROID_COLUMNS = [
    {
        header: 'Nombre',
        accessor: 'name',
        // Usamos el componente Badge que creamos para resaltar el nombre
        formatter: (name, item) => (
            <span className="font-semibold text-indigo-700">{name}</span>
        )
    },
    {
        header: 'Diámetro (m)',
        accessor: 'diameterMeters',
        formatter: (value) => value ? `${formatNumber(value)} m` : 'N/A'
    },
    {
        header: 'Velocidad (km/h)',
        accessor: 'velocity',
        formatter: (value) => value ? `${formatNumber(parseFloat(value))} km/h` : 'N/A'
    },
    {
        header: 'Peligro Potencial',
        accessor: 'isPotentiallyHazardous',
        // Usamos el Badge para visualizar el riesgo
        formatter: (isHazardous) => (
            <Badge color={isHazardous ? 'red' : 'green'}>
                {isHazardous ? 'ALTO' : 'Bajo'}
            </Badge>
        )
    },
    {
        header: 'Fecha de Aproximación',
        accessor: 'closeApproachDate',
        formatter: (date) => date || 'N/A'
    },
];

const AsteroidDataFetcher = () => {
    // 1. Estados necesarios:
    const [asteroids, setAsteroids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    // ************************************************************
    // ** PASO 1: APLICAR FILTRADO (El PRIMER procesamiento)**
    // ************************************************************
    const filteredAsteroids = asteroids.filter(neo => {
        if (!searchTerm) return true;
        return neo.name.toLowerCase().includes(searchTerm.toLowerCase());
    });


    // ************************************************************
    // ** PASO 2: APLICAR PAGINACIÓN sobre los datos FILTRADOS **
    // ************************************************************

    // 1. Calcular el total de páginas (USANDO filteredAsteroids.length)
    const totalPages = Math.ceil(filteredAsteroids.length / ITEMS_PER_PAGE);

    // 2. Definir los índices de inicio y fin para el slice
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // 3. Aplicar el slice (USANDO filteredAsteroids)
    const paginatedData = filteredAsteroids.slice(startIndex, endIndex);


    // ** NOTA: La función handlePageChange usa ahora la variable totalPages calculada arriba **
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 4. Estado de Éxito
    return (
        <div className="p-4">
            {/* Encabezado y Contador de Resultados */}
            <h3 className="text-xl font-semibold mb-4">Asteroides Cercanos a la Tierra ({filteredAsteroids.length} resultados)</h3>

            {/* Componente de Filtro (Átomo Input) */}
            <div className="mb-4 max-w-sm">
                <Input
                    type="text"
                    placeholder="Filtrar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 1. La Tabla (Ahora usa los datos paginados) */}
            <Table
                columns={ASTEROID_COLUMNS}
                data={paginatedData} // <-- ¡Usamos los datos paginados!
            />

            {/* 2. El Componente de Paginación */}
            {filteredAsteroids.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default AsteroidDataFetcher;