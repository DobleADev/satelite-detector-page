// src/components/organisms/AsteroidDataFetcher/AsteroidDataFetcher.jsx

import React from 'react';
import { useAsteroidData } from '../../../hooks/useAsteroidData'; // ¡Nuevo Hook!

// Importa los componentes de UI
import { Spinner } from '../../atoms/Spinner';
import { AlertMessage } from '../../atoms/AlertMessage';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { Table } from '../../molecules/Table';
import { Pagination } from '../../molecules/Pagination';

// ... (Las funciones formatNumber y las constantes ASTEROID_COLUMNS permanecen aquí)
const formatNumber = (num) => new Intl.NumberFormat('es-DO', { maximumFractionDigits: 0 }).format(num);
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
    // 1. Usar el Custom Hook: toda la lógica en una sola línea.
    const { 
        loading,
        error,
        paginatedData,
        totalPages,
        currentPage,
        searchTerm,
        filteredCount,
        setSearchTerm,
        handlePageChange,
    } = useAsteroidData();


    // 2. Renderizado Condicional de Estados (sin cambios)
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

    // 3. Estado de Éxito (solo renderizado)
    return (
        <div className="p-4">
            
            <h3 className="text-xl font-semibold mb-4">
                Asteroides Cercanos a la Tierra ({filteredCount} resultados)
            </h3>

            {/* Componente de Filtro */}
            <div className="mb-4 max-w-sm">
                <Input
                    type="text"
                    placeholder="Filtrar por nombre..."
                    value={searchTerm}
                    // La función de actualización viene directamente del hook
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* La Tabla */}
            <Table
                columns={ASTEROID_COLUMNS}
                data={paginatedData} 
            />

            {/* El Componente de Paginación */}
            {filteredCount > 0 && (
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