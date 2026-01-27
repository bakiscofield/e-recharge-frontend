'use client';

import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown } from 'lucide-react';

interface Bookmaker {
  id: string;
  name: string;
  logo?: string;
}

interface BookmakerSelectProps {
  bookmakers: Bookmaker[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function BookmakerSelect({
  bookmakers,
  value,
  onChange,
  placeholder = 'Sélectionner un bookmaker...',
  disabled = false,
  className = '',
}: BookmakerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedBookmaker = bookmakers.find((bm) => bm.id === value);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (bookmakerId: string) => {
    onChange(bookmakerId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl bg-white text-sm sm:text-base font-medium text-left transition-all flex items-center justify-between gap-3 ${
          disabled
            ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
            : isOpen
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedBookmaker ? (
            <>
              {selectedBookmaker.logo ? (
                <img
                  src={selectedBookmaker.logo}
                  alt={selectedBookmaker.name}
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain flex-shrink-0"
                />
              ) : (
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate">{selectedBookmaker.name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Liste déroulante */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {/* Option vide */}
          <button
            type="button"
            onClick={() => handleSelect('')}
            className="w-full px-4 py-3 text-left text-sm sm:text-base text-gray-500 hover:bg-gray-50 transition"
          >
            {placeholder}
          </button>

          {/* Liste des bookmakers */}
          {bookmakers.map((bm) => (
            <button
              key={bm.id}
              type="button"
              onClick={() => handleSelect(bm.id)}
              className={`w-full px-4 py-3 text-left text-sm sm:text-base flex items-center gap-3 transition ${
                value === bm.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-gray-50'
              }`}
            >
              {bm.logo ? (
                <img
                  src={bm.logo}
                  alt={bm.name}
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain flex-shrink-0"
                />
              ) : (
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate">{bm.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
