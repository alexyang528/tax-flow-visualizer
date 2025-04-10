
import React from 'react';
import { Employee, Workplace } from '@/types/payroll-tax-types';

interface EmployeeInfoProps {
  employee: Employee | undefined;
  workplaces: Workplace[];
}

const EmployeeInfo = ({ employee, workplaces }: EmployeeInfoProps) => {
  if (!employee) return null;

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium text-blue-800">Employee Information</h3>
      <div className="mt-2">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Name:</span> {employee.name}
        </p>
        <p className="text-sm text-blue-700">
          <span className="font-medium">Residence:</span> {employee.residence.address}
        </p>
        <p className="text-sm text-blue-700">
          <span className="font-medium">Primary Workplace:</span> {(() => {
            const primaryWorkplace = workplaces.find(wp => wp.id === employee.primaryWorkplace);
            return primaryWorkplace ? primaryWorkplace.name : 'Not assigned';
          })()}
        </p>
        {employee.workplaces.length > 1 && (
          <p className="text-sm text-blue-700">
            <span className="font-medium">Additional Workplaces:</span> {
              employee.workplaces
                .filter(wp => wp !== employee.primaryWorkplace)
                .map(wpId => {
                  const workplace = workplaces.find(wp => wp.id === wpId);
                  return workplace ? workplace.name : null;
                })
                .filter(Boolean)
                .join(', ')
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfo;
