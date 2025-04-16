import React, { useState, useMemo } from 'react';
import { employees as initialEmployees, workplaces } from '@/data/employee-data';
import { taxData } from '@/data/tax-data';
import { getFilteredJurisdictions } from '@/utils/tax-utils';
import { ExemptedTaxes, ExpandedState, ViewType, Employee } from '@/types/payroll-tax-types';

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
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
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
  const [electedTaxes, setElectedTaxes] = useState<ExemptedTaxes>({
    Federal: [],
    "New York": [],
    California: [],
    "District of Columbia": [],
    "New Jersey": [],
    "Virginia": [],
    "Connecticut": [],
    "Maryland": []
  });

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

  const handleAddTaxElection = (jurisdiction: string, taxName: string): void => {
    setElectedTaxes(prev => {
      const updatedElections = { ...prev };
      
      if (!updatedElections[jurisdiction].includes(taxName)) {
        updatedElections[jurisdiction] = [...updatedElections[jurisdiction], taxName];
      } else {
        updatedElections[jurisdiction] = updatedElections[jurisdiction].filter(tax => tax !== taxName);
      }
      
      return updatedElections;
    });
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee): void => {
    setEmployees(prev => prev.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
  };

  const handleWorkplaceChange = (workplaceId: string): void => {
    setSelectedWorkplace(workplaceId);
  };

  const filteredJurisdictions = useMemo(() => 
    getFilteredJurisdictions('employee', selectedWorkplace, selectedEmployee, employees.find(emp => emp.id === selectedEmployee)),
    [selectedWorkplace, selectedEmployee, employees]
  );

  const isValidJurisdiction = filteredJurisdictions.includes(activeJurisdiction);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Payroll Tax Dashboard</h1>
      
      <div className="mb-6">
        {selectedEmployee && selectedEmployee !== 'all' && (
          <EmployeeInfo 
            employee={employees.find(emp => emp.id === selectedEmployee)} 
            workplaces={workplaces} 
            onSave={handleEmployeeUpdate}
          />
        )}
        
        <FilterControls
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
          viewType="employee"
          exemptedTaxes={exemptedTaxes}
          electedTaxes={electedTaxes}
          expanded={expanded}
          onToggleTaxExpansion={toggleTaxExpansion}
          onToggleTaxExemption={toggleTaxExemption}
          onAddTaxElection={handleAddTaxElection}
          selectedEmployee={selectedEmployee}
          selectedWorkplace={selectedWorkplace}
          employees={employees}
        />
      )}
      
      {!isValidJurisdiction && (
        <NoJurisdictionAlert
          selectedEmployee={selectedEmployee}
          employees={employees}
        />
      )}
      
      {!selectedEmployee && (
        <NoEmployeeAlert />
      )}
    </div>
  );
};

export default PayrollTaxDashboard;
