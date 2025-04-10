
import React from 'react';
import { Employee, Workplace, ViewType } from '@/types/payroll-tax-types';

interface FilterControlsProps {
  viewType: ViewType;
  selectedEmployee: string;
  selectedWorkplace: string;
  employees: Employee[];
  workplaces: Workplace[];
  onEmployeeChange: (employeeId: string) => void;
  onWorkplaceChange: (workplaceId: string) => void;
}

const FilterControls = ({
  viewType,
  selectedEmployee,
  selectedWorkplace,
  employees,
  workplaces,
  onEmployeeChange,
  onWorkplaceChange
}: FilterControlsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {viewType === 'employee' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee:</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedEmployee}
            onChange={(e) => onEmployeeChange(e.target.value)}
            required
          >
            <option value="" disabled>Select an employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {viewType === 'company' ? 'Filter by Workplace:' : 'Filter by Employee Workplace:'}
        </label>
        <select 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedWorkplace}
          onChange={(e) => onWorkplaceChange(e.target.value)}
        >
          <option value="all">All Workplaces</option>
          {viewType === 'employee' && selectedEmployee ? 
            employees.find(emp => emp.id === selectedEmployee)?.workplaces.map(wpId => {
              const workplace = workplaces.find(wp => wp.id === wpId);
              return workplace ? (
                <option key={workplace.id} value={workplace.id}>{workplace.name}</option>
              ) : null;
            })
            :
            workplaces.filter(wp => wp.id !== 'all').map(workplace => (
              <option key={workplace.id} value={workplace.id}>{workplace.name}</option>
            ))
          }
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
