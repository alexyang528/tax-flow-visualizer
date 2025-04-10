
import React from 'react';
import { TaxParameter as TaxParameterType } from '@/types/payroll-tax-types';

interface TaxParameterProps {
  parameter: TaxParameterType;
  isExempted?: boolean;
}

const TaxParameter = ({ parameter, isExempted = false }: TaxParameterProps) => {
  return (
    <div className="space-y-1">
      <label className={`block text-sm font-medium ${isExempted ? 'text-gray-500' : 'text-gray-700'}`}>
        {parameter.name}
        {parameter.readonly && <span className="ml-1 text-gray-400 text-xs">(Read-only)</span>}
      </label>
      
      {parameter.type === 'select' ? (
        <select 
          className={`w-full p-2 border border-gray-300 rounded-md ${isExempted ? 'bg-gray-100' : ''}`}
          disabled={parameter.readonly || isExempted}
        >
          <option value="">Select...</option>
          {parameter.options && parameter.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input 
          type={parameter.type === 'number' ? 'number' : 'text'} 
          className={`w-full p-2 border border-gray-300 rounded-md ${isExempted ? 'bg-gray-100' : ''}`}
          placeholder={parameter.type === 'currency' ? '$0.00' : ''}
          value={parameter.value || ''}
          readOnly={parameter.readonly || isExempted}
        />
      )}
    </div>
  );
};

export default TaxParameter;
