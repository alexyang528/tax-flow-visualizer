import React, { useState, useEffect } from 'react';
import { Employee, Workplace } from '@/types/payroll-tax-types';

interface EmployeeInfoProps {
  employee: Employee | undefined;
  workplaces: Workplace[];
  onSave: (updatedEmployee: Employee) => void;
}

const EmployeeInfo = ({ employee, workplaces, onSave }: EmployeeInfoProps) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | undefined>(employee);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when employee prop changes
  useEffect(() => {
    setEditedEmployee(employee);
  }, [employee]);

  if (!editedEmployee) return null;

  const handleResidenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedEmployee(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        residence: {
          ...prev.residence,
          state: e.target.value,
          address: `${prev.residence.address.split(',')[0]}, ${e.target.value}`
        }
      };
    });
  };

  const handlePrimaryWorkplaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPrimaryWorkplace = e.target.value;
    setEditedEmployee(prev => {
      if (!prev) return prev;
      
      // Ensure primary workplace is in workplaces list
      const workplaces = prev.workplaces.includes(newPrimaryWorkplace)
        ? prev.workplaces
        : [...prev.workplaces, newPrimaryWorkplace];
      
      return {
        ...prev,
        primaryWorkplace: newPrimaryWorkplace,
        workplaces
      };
    });
  };

  const handleWorkplaceToggle = (workplaceId: string) => {
    setEditedEmployee(prev => {
      if (!prev) return prev;
      
      // Don't allow removing primary workplace
      if (workplaceId === prev.primaryWorkplace) return prev;
      
      const newWorkplaces = prev.workplaces.includes(workplaceId)
        ? prev.workplaces.filter(id => id !== workplaceId)
        : [...prev.workplaces, workplaceId];
      
      return {
        ...prev,
        workplaces: newWorkplaces
      };
    });
  };

  const handleSave = () => {
    if (editedEmployee) {
      onSave(editedEmployee);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-blue-800">Employee Information</h3>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      <div className="mt-2 space-y-3">
        <div>
          <span className="font-medium text-sm text-blue-700">Name:</span>
          <span className="ml-2 text-sm text-blue-700">{editedEmployee.name}</span>
        </div>

        <div>
          <span className="font-medium text-sm text-blue-700">Residence:</span>
          {isEditing ? (
            <select
              value={editedEmployee.residence.state}
              onChange={handleResidenceChange}
              className="ml-2 p-1 border border-gray-300 rounded text-sm"
            >
              <option value="New York">New York</option>
              <option value="California">California</option>
              <option value="District of Columbia">District of Columbia</option>
              <option value="New Jersey">New Jersey</option>
              <option value="Virginia">Virginia</option>
              <option value="Connecticut">Connecticut</option>
              <option value="Maryland">Maryland</option>
            </select>
          ) : (
            <span className="ml-2 text-sm text-blue-700">{editedEmployee.residence.address}</span>
          )}
        </div>

        <div>
          <span className="font-medium text-sm text-blue-700">Primary Workplace:</span>
          {isEditing ? (
            <select
              value={editedEmployee.primaryWorkplace}
              onChange={handlePrimaryWorkplaceChange}
              className="ml-2 p-1 border border-gray-300 rounded text-sm"
            >
              {workplaces.filter(wp => wp.id !== 'all').map(workplace => (
                <option key={workplace.id} value={workplace.id}>
                  {workplace.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="ml-2 text-sm text-blue-700">
              {workplaces.find(wp => wp.id === editedEmployee.primaryWorkplace)?.name || 'Not assigned'}
            </span>
          )}
        </div>

        <div>
          <span className="font-medium text-sm text-blue-700">Workplaces:</span>
          {isEditing ? (
            <div className="ml-2 mt-1 space-y-1">
              {workplaces.filter(wp => wp.id !== 'all').map(workplace => (
                <label key={workplace.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedEmployee.workplaces.includes(workplace.id)}
                    onChange={() => handleWorkplaceToggle(workplace.id)}
                    disabled={workplace.id === editedEmployee.primaryWorkplace}
                    className="mr-2"
                  />
                  <span className="text-sm text-blue-700">{workplace.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <span className="ml-2 text-sm text-blue-700">
              {editedEmployee.workplaces
                .map(wpId => workplaces.find(wp => wp.id === wpId)?.name)
                .filter(Boolean)
                .join(', ')}
            </span>
          )}
        </div>

        {isEditing && (
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfo;
