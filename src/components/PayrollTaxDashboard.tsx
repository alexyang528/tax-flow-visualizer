import React, { useState, useMemo } from 'react';
import { employees as initialEmployees, workplaces } from '@/data/employee-data';
import { taxData } from '@/data/tax-data';
import { getFilteredJurisdictions } from '@/utils/tax-utils';
import { ExemptedTaxes, ExpandedState, ViewType, Employee } from '@/types/payroll-tax-types';

import ViewTypeToggle from './payroll/ViewTypeToggle';
import EmployeeInfo from './payroll/EmployeeInfo';
import FilterControls from './payroll/FilterControls';
import JurisdictionTabs from './payroll/JurisdictionTabs';
import TaxList from './payroll/TaxList';
import NoJurisdictionAlert from './payroll/NoJurisdictionAlert';
import NoEmployeeAlert from './payroll/NoEmployeeAlert';

const PayrollTaxDashboard = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activeJurisdiction, setActiveJurisdiction] = useState<string>('Federal');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [viewType, setViewType] = useState<ViewType>('company');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [exemptedTaxes, setExemptedTaxes] = useState<ExemptedTaxes>({
    Federal: [],
    "New York": [],
    California: [],
    "District of Columbia": [],
    "New Jersey": [],
    "Virginia": [],
    "Connecticut": [],
    "Maryland": []
  });

  const handleViewTypeToggle = (type: ViewType): void => {
    setViewType(type);
    setSelectedWorkplace('all');
    
    if (type === 'company') {
      setSelectedEmployee('');
    } else {
      // Auto-select the first employee when switching to employee view
      setSelectedEmployee(employees[0].id);
    }
  };

  const handleEmployeeChange = (employeeId: string): void => {
    setSelectedEmployee(employeeId);
    setSelectedWorkplace('all');
  };

  const toggleTaxExemption = (jurisdiction: string, taxName: string): void => {
    setExemptedTaxes(prev => {
      const updatedExemptions = { ...prev };
      
      if (!updatedExemptions[jurisdiction].includes(taxName)) {
        updatedExemptions[jurisdiction] = [...updatedExemptions[jurisdiction], taxName];
      } else {
        updatedExemptions[jurisdiction] = updatedExemptions[jurisdiction].filter(tax => tax !== taxName);
      }
      
      return updatedExemptions;
    });
  };

  const toggleTaxExpansion = (taxName: string): void => {
    setExpanded(prev => ({
      ...prev,
      [taxName]: !prev[taxName]
    }));
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => {
      const newEmployees = prev.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      
      // Update the selected employee if it's the one being edited
      if (selectedEmployee === updatedEmployee.id) {
        setSelectedEmployee(updatedEmployee.id);
        
        // If residence changed, update the active jurisdiction
        const oldEmployee = prev.find(emp => emp.id === updatedEmployee.id);
        if (oldEmployee && oldEmployee.residence.state !== updatedEmployee.residence.state) {
          // Set active jurisdiction to the new residence state
          setActiveJurisdiction(`${updatedEmployee.residence.state} (Residence)`);
        }
      }
      
      return newEmployees;
    });
  };

  const selectedEmployeeData = useMemo(() => 
    employees.find(emp => emp.id === selectedEmployee),
    [employees, selectedEmployee]
  );

  const filteredJurisdictions = useMemo(() => 
    getFilteredJurisdictions(
      viewType,
      selectedWorkplace,
      selectedEmployee,
      selectedEmployeeData
    ),
    [viewType, selectedWorkplace, selectedEmployee, selectedEmployeeData]
  );

  const handleWorkplaceChange = (workplaceId: string) => {
    setSelectedWorkplace(workplaceId);
  };

  const isValidJurisdiction = filteredJurisdictions.includes(activeJurisdiction) || 
                              activeJurisdiction.includes(" (Residence)") || 
                              activeJurisdiction.includes(" (Primary Workplace)") ||
                              activeJurisdiction.includes(" (Residence, Primary Workplace)");

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Payroll Tax Dashboard</h1>
      
      <div className="mb-6">
        <ViewTypeToggle viewType={viewType} onToggle={handleViewTypeToggle} />
        
        {viewType === 'employee' && selectedEmployee && (
          <EmployeeInfo 
            employee={employees.find(emp => emp.id === selectedEmployee)} 
            workplaces={workplaces} 
            onSave={handleEmployeeUpdate}
          />
        )}
        
        <FilterControls
          viewType={viewType}
          selectedEmployee={selectedEmployee}
          selectedWorkplace={selectedWorkplace}
          employees={employees}
          workplaces={workplaces}
          onEmployeeChange={handleEmployeeChange}
          onWorkplaceChange={handleWorkplaceChange}
        />
      </div>
      
      <JurisdictionTabs
        jurisdictions={filteredJurisdictions}
        activeJurisdiction={activeJurisdiction}
        onJurisdictionChange={setActiveJurisdiction}
      />
      
      {isValidJurisdiction && (
        <TaxList
          activeJurisdiction={activeJurisdiction}
          viewType={viewType}
          exemptedTaxes={exemptedTaxes}
          expanded={expanded}
          onToggleTaxExpansion={toggleTaxExpansion}
          onToggleTaxExemption={toggleTaxExemption}
          selectedEmployee={selectedEmployee}
          selectedWorkplace={selectedWorkplace}
        />
      )}
      
      {!isValidJurisdiction && (
        <NoJurisdictionAlert
          viewType={viewType}
          selectedEmployee={selectedEmployee}
          employees={employees}
        />
      )}
      
      {viewType === 'employee' && !selectedEmployee && (
        <NoEmployeeAlert />
      )}
    </div>
  );
};

export default PayrollTaxDashboard;
