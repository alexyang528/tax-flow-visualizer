import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Employee } from '@/types/payroll-tax-types';

interface NoJurisdictionAlertProps {
  selectedEmployee: string;
  employees: Employee[];
}

const NoJurisdictionAlert = ({ selectedEmployee, employees }: NoJurisdictionAlertProps) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {selectedEmployee === 'all'
              ? 'No tax data available for this jurisdiction across all employees.'
              : `No tax data available for this jurisdiction based on ${employees.find(emp => emp.id === selectedEmployee)?.name}'s workplace assignments.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoJurisdictionAlert;
