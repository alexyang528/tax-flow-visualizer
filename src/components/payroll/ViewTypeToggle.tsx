
import React from 'react';
import { ViewType } from '@/types/payroll-tax-types';

interface ViewTypeToggleProps {
  viewType: ViewType;
  onToggle: (type: ViewType) => void;
}

const ViewTypeToggle = ({ viewType, onToggle }: ViewTypeToggleProps) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        className={`px-4 py-2 rounded-lg font-medium ${
          viewType === 'company' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => onToggle('company')}
      >
        Entire Company
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-medium ${
          viewType === 'employee' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => onToggle('employee')}
      >
        By Employee
      </button>
    </div>
  );
};

export default ViewTypeToggle;
