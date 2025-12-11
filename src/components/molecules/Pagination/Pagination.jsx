// src/components/molecules/Pagination/Pagination.jsx

import React from 'react';
import { Button } from '../../atoms/Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Array de números de página (ej. [1, 2, 3, 4, 5])
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Botón Anterior */}
      <Button
        variant="secondary"
        size="small"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>

      {/* Botones Numéricos */}
      {/* Muestra solo un rango de botones para no saturar la pantalla */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onPageChange(page)}
          // Aseguramos que el botón actual no pueda ser deshabilitado
          className={page === currentPage ? 'pointer-events-none' : ''}
        >
          {page}
        </Button>
      ))}

      {/* Botón Siguiente */}
      <Button
        variant="secondary"
        size="small"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
};

export default Pagination;