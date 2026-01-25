'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, User } from 'lucide-react';

interface Agent {
  id: string;
  address?: string;
  employee: {
    firstName: string;
    lastName: string;
    isOnline?: boolean;
  };
  frais?: number;
}

interface AgentSelectProps {
  agents: Agent[];
  value: string;
  onChange: (value: string, agent: Agent | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showFrais?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function AgentSelect({
  agents,
  value,
  onChange,
  placeholder = 'Sélectionner un agent...',
  disabled = false,
  className = '',
  showFrais = false,
  variant = 'secondary',
}: AgentSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedAgent = agents.find((agent) => agent.id === value);

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

  const handleSelect = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId) || null;
    onChange(agentId, agent);
    setIsOpen(false);
  };

  const getAgentDisplayInfo = (agent: Agent) => {
    return {
      name: `${agent.employee.firstName} ${agent.employee.lastName}`,
      location: agent.address || '',
      isOnline: agent.employee.isOnline,
      frais: agent.frais,
    };
  };

  // Classes de couleur selon le variant
  const isPrimary = variant === 'primary';

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
            ? isPrimary
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-secondary ring-2 ring-secondary/20'
            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedAgent ? (
            <>
              <div className="relative flex-shrink-0">
                <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                  isPrimary ? 'bg-primary/10' : 'bg-secondary/10'
                }`}>
                  <User className={`h-4 w-4 sm:h-5 sm:w-5 ${isPrimary ? 'text-primary' : 'text-secondary'}`} />
                </div>
                {selectedAgent.employee.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {getAgentDisplayInfo(selectedAgent).name}
                </div>
                {getAgentDisplayInfo(selectedAgent).location && (
                  <div className="text-xs text-gray-500 truncate">
                    {getAgentDisplayInfo(selectedAgent).location}
                  </div>
                )}
              </div>
              {showFrais && selectedAgent.frais !== undefined && (
                <div className="text-xs text-gray-600 flex-shrink-0">
                  Frais: {selectedAgent.frais} FCFA
                </div>
              )}
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">{placeholder}</span>
            </>
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

          {/* Liste des agents */}
          {agents.map((agent) => {
            const info = getAgentDisplayInfo(agent);
            const isSelected = value === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelect(agent.id)}
                className={`w-full px-4 py-3 text-left text-sm sm:text-base flex items-center gap-3 transition ${
                  isSelected
                    ? isPrimary
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary/10 text-secondary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isSelected
                      ? isPrimary
                        ? 'bg-primary/20'
                        : 'bg-secondary/20'
                      : 'bg-gray-100'
                  }`}>
                    <User className={`h-4 w-4 ${
                      isSelected
                        ? isPrimary
                          ? 'text-primary'
                          : 'text-secondary'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  {info.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{info.name}</div>
                  {info.location && (
                    <div className="text-xs text-gray-500 truncate">{info.location}</div>
                  )}
                </div>
                {showFrais && info.frais !== undefined && (
                  <div className="text-xs text-gray-600 flex-shrink-0">
                    {info.frais} FCFA
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
