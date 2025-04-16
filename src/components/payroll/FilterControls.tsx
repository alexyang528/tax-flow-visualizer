import React from 'react';
import { Employee, Workplace, ViewType } from '@/types/payroll-tax-types';

interface FilterControlsProps {
  selectedEmployee: string;
  selectedWorkplace: string;
  employees: Employee[];
  workplaces: Workplace[];
  onEmployeeChange: (employeeId: string) => void;
  onWorkplaceChange: (workplaceId: string) => void;
}

const FilterControls = ({
  selectedEmployee,
  selectedWorkplace,
  employees,
  workplaces,
  onEmployeeChange,
  onWorkplaceChange
}: FilterControlsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee:</label>
        <select 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedEmployee}
          onChange={(e) => onEmployeeChange(e.target.value)}
          required
        >
          <option value="" disabled>Select an employee</option>
          <option value="all">All Employees</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Employee Workplace:
        </label>
        <select 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedWorkplace}
          onChange={(e) => onWorkplaceChange(e.target.value)}
        >
          <option value="all">All Workplaces</option>
          {selectedEmployee && selectedEmployee !== 'all' ? 
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
