
import React from 'react';
import { TaxConfig } from '@/types/payroll-tax-types';
import TaxParameter from './TaxParameter';

interface TaxCardProps {
  taxName: string;
  taxConfig: TaxConfig;
  isExempted: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleExemption: () => void;
}

const TaxCard = ({
  taxName,
  taxConfig,
  isExempted,
  isExpanded,
  onToggleExpand,
  onToggleExemption
}: TaxCardProps) => {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${isExempted ? 'bg-gray-50' : ''}`}>
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <h3 
          className={`text-lg font-medium cursor-pointer flex-grow ${isExempted ? 'text-gray-500' : ''}`}
          onClick={onToggleExpand}
        >
          {taxName}
          <span className="ml-2 text-xs text-gray-500">
            ({taxConfig.drivenBy})
          </span>
        </h3>
        <div className="flex items-center">
          <button
            className={`ml-4 text-sm text-gray-600 hover:${isExempted ? 'text-green-600' : 'text-red-600'} focus:outline-none`}
            onClick={onToggleExemption}
            title={isExempted ? "Reinstate this tax" : "Exempt this tax"}
          >
            {isExempted ? 'Reinstate' : 'Exempt'}
          </button>
          <span className={`ml-4 cursor-pointer ${isExempted ? 'text-gray-500' : ''}`} onClick={onToggleExpand}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className={`p-4 ${isExempted ? 'bg-gray-50' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taxConfig.parameters.map(param => (
              <TaxParameter key={param.id} parameter={param} isExempted={isExempted} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCard;
