import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface TaxParameter {
  id: string;
  name: string;
  type: 'select' | 'number' | 'currency' | 'percentage';
  options?: string[];
  value?: string;
  readonly?: boolean;
}

interface TaxConfig {
  parameters: TaxParameter[];
}

interface JurisdictionTaxes {
  [taxName: string]: TaxConfig;
}

interface TaxData {
  [jurisdiction: string]: JurisdictionTaxes;
}

interface Workplace {
  id: string;
  name: string;
}

interface EmployeeResidence {
  state: string;
  address: string;
}

interface Employee {
  id: string;
  name: string;
  workplaces: string[];
  primaryWorkplace: string;
  residence: EmployeeResidence;
}

interface ExemptedTaxes {
  [jurisdiction: string]: string[];
}

interface ExpandedState {
  [taxName: string]: boolean;
}

const PayrollTaxDashboard = () => {
  // Sample data structure for jurisdictions, taxes, and parameters
  const taxData: TaxData = {
    "Federal": {
      "Federal Income Tax": {
        parameters: [
          { id: 'w4Filing', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
          { id: 'w4Dependents', name: 'Number of Dependents', type: 'number' },
          { id: 'w4OtherIncome', name: 'Other Income', type: 'currency' },
          { id: 'w4Deductions', name: 'Deductions', type: 'currency' },
          { id: 'w4ExtraWithholding', name: 'Extra Withholding', type: 'currency' }
        ]
      },
      "FICA - Social Security": {
        parameters: [
          { id: 'ficaSSWage', name: 'YTD Social Security Wages', type: 'currency', readonly: true },
          { id: 'ficaSSRate', name: 'Current Rate', type: 'percentage', value: '6.2%', readonly: true },
          { id: 'ficaSSCap', name: 'Annual Cap', type: 'currency', value: '$160,200', readonly: true }
        ]
      },
      "FICA - Medicare": {
        parameters: [
          { id: 'ficaMedWage', name: 'YTD Medicare Wages', type: 'currency', readonly: true },
          { id: 'ficaMedRate', name: 'Base Rate', type: 'percentage', value: '1.45%', readonly: true },
          { id: 'ficaMedAddlRate', name: 'Additional Rate', type: 'percentage', value: '0.9%', readonly: true },
          { id: 'ficaMedAddlThreshold', name: 'Additional Rate Threshold', type: 'currency', value: '$200,000', readonly: true }
        ]
      },
      "FUTA": {
        parameters: [
          { id: 'futaWage', name: 'YTD FUTA Wages', type: 'currency', readonly: true },
          { id: 'futaRate', name: 'Rate', type: 'percentage', value: '0.6%', readonly: true },
          { id: 'futaCap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
        ]
      }
    },
    "California": {
      "CA Income Tax": {
        parameters: [
          { id: 'caFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married', 'Head of Household'] },
          { id: 'caAllowances', name: 'Allowances', type: 'number' },
          { id: 'caAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      },
      "CA SDI": {
        parameters: [
          { id: 'caSDIWage', name: 'YTD SDI Wages', type: 'currency', readonly: true },
          { id: 'caSDIRate', name: 'Rate', type: 'percentage', value: '1.1%', readonly: true },
          { id: 'caSDICap', name: 'Annual Cap', type: 'currency', value: '$153,164', readonly: true }
        ]
      },
      "CA SUI": {
        parameters: [
          { id: 'caSUIWage', name: 'YTD SUI Wages', type: 'currency', readonly: true },
          { id: 'caSUIRate', name: 'Rate', type: 'percentage', value: '3.4%', readonly: true },
          { id: 'caSUICap', name: 'Annual Cap', type: 'currency', value: '$7,000', readonly: true }
        ]
      }
    },
    "New York": {
      "NY Income Tax": {
        parameters: [
          { id: 'nyFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
          { id: 'nyAllowances', name: 'Allowances', type: 'number' },
          { id: 'nyAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      },
      "NY SDI": {
        parameters: [
          { id: 'nySDIRate', name: 'Weekly Rate', type: 'currency', value: '$0.50', readonly: true },
          { id: 'nySDICap', name: 'Annual Cap', type: 'currency', value: '$26.00', readonly: true }
        ]
      },
      "NY Paid Family Leave": {
        parameters: [
          { id: 'nyPFLWage', name: 'YTD PFL Wages', type: 'currency', readonly: true },
          { id: 'nyPFLRate', name: 'Rate', type: 'percentage', value: '0.455%', readonly: true },
          { id: 'nyPFLCap', name: 'Annual Cap', type: 'currency', value: '$82,654', readonly: true }
        ]
      }
    },
    "District of Columbia": {
      "DC Income Tax": {
        parameters: [
          { id: 'dcFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married/Domestic Partner Filing Jointly', 'Head of Household'] },
          { id: 'dcAllowances', name: 'Allowances', type: 'number' },
          { id: 'dcAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      },
      "DC Paid Family Leave": {
        parameters: [
          { id: 'dcPFLWage', name: 'YTD PFL Wages', type: 'currency', readonly: true },
          { id: 'dcPFLRate', name: 'Rate', type: 'percentage', value: '0.62%', readonly: true }
        ]
      }
    },
    "New Jersey": {
      "NJ Income Tax": {
        parameters: [
          { id: 'njFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married/Civil Union Filing Jointly', 'Head of Household'] },
          { id: 'njAllowances', name: 'Allowances', type: 'number' },
          { id: 'njAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      },
      "NJ Unemployment Insurance": {
        parameters: [
          { id: 'njUIWage', name: 'YTD UI Wages', type: 'currency', readonly: true },
          { id: 'njUIRate', name: 'Rate', type: 'percentage', value: '0.3825%', readonly: true },
          { id: 'njUICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
        ]
      },
      "NJ Disability Insurance": {
        parameters: [
          { id: 'njDIWage', name: 'YTD DI Wages', type: 'currency', readonly: true },
          { id: 'njDIRate', name: 'Rate', type: 'percentage', value: '0.16%', readonly: true },
          { id: 'njDICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
        ]
      },
      "NJ Family Leave Insurance": {
        parameters: [
          { id: 'njFLIWage', name: 'YTD FLI Wages', type: 'currency', readonly: true },
          { id: 'njFLIRate', name: 'Rate', type: 'percentage', value: '0.14%', readonly: true },
          { id: 'njFLICap', name: 'Annual Cap', type: 'currency', value: '$41,100', readonly: true }
        ]
      }
    },
    "Virginia": {
      "VA Income Tax": {
        parameters: [
          { id: 'vaFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
          { id: 'vaExemptions', name: 'Exemptions', type: 'number' },
          { id: 'vaAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      }
    },
    "Connecticut": {
      "CT Income Tax": {
        parameters: [
          { id: 'ctFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
          { id: 'ctWithholdingCode', name: 'Withholding Code', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F'] },
          { id: 'ctAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      }
    },
    "Maryland": {
      "MD Income Tax": {
        parameters: [
          { id: 'mdFilingStatus', name: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Head of Household'] },
          { id: 'mdExemptions', name: 'Exemptions', type: 'number' },
          { id: 'mdAddlWithholding', name: 'Additional Withholding', type: 'currency' }
        ]
      }
    }
  };

  // Workplaces for filtering
  const workplaces = [
    { id: 'all', name: 'All Workplaces' },
    { id: 'hq', name: 'Headquarters - New York' },
    { id: 'branch-ca', name: 'Branch Office - California' },
    { id: 'remote-dc', name: 'Remote Office - DC' }
  ];

  // Sample employee data
  const employees = [
    { id: 'emp1', name: 'John Smith', workplaces: ['hq', 'remote-dc'], primaryWorkplace: 'hq', residence: { state: 'New Jersey', address: '123 Maple St, Jersey City, NJ 07302' } },
    { id: 'emp2', name: 'Sarah Johnson', workplaces: ['branch-ca'], primaryWorkplace: 'branch-ca', residence: { state: 'California', address: '456 Palm Ave, San Francisco, CA 94107' } },
    { id: 'emp3', name: 'Michael Brown', workplaces: ['remote-dc'], primaryWorkplace: 'remote-dc', residence: { state: 'Virginia', address: '789 Oak Rd, Arlington, VA 22201' } },
    { id: 'emp4', name: 'Emily Davis', workplaces: ['hq', 'branch-ca'], primaryWorkplace: 'hq', residence: { state: 'New York', address: '101 Broadway, New York, NY 10003' } },
    { id: 'emp5', name: 'David Wilson', workplaces: ['hq', 'remote-dc'], primaryWorkplace: 'remote-dc', residence: { state: 'Connecticut', address: '202 Elm St, Stamford, CT 06901' } },
    { id: 'emp6', name: 'Lisa Garcia', workplaces: ['branch-ca', 'remote-dc'], primaryWorkplace: 'branch-ca', residence: { state: 'Maryland', address: '303 Pine Ln, Bethesda, MD 20814' } }
  ];

  // State variables for managing the UI
  const [activeJurisdiction, setActiveJurisdiction] = useState<string>('Federal');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [viewType, setViewType] = useState<'company' | 'employee'>('company');
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
  
  // Handle mode toggle
  const handleViewTypeToggle = (type: 'company' | 'employee'): void => {
    setViewType(type);
    setSelectedWorkplace('all');
    
    if (type === 'company') {
      setSelectedEmployee('');
    }
  };
  
  // Reset workplace selection when employee changes
  const handleEmployeeChange = (employeeId: string): void => {
    setSelectedEmployee(employeeId);
    setSelectedWorkplace('all');
  };
  
  // Toggle tax exemption status
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

  // Get filtered jurisdictions and map residence jurisdictions to actual tax data keys
  const getFilteredJurisdictions = () => {
    // Entire Company view with workplace filter
    if (viewType === 'company') {
      if (selectedWorkplace === 'all') {
        // Ensure Federal is first
        const jurisdictions = Object.keys(taxData);
        return ['Federal', ...jurisdictions.filter(j => j !== 'Federal')];
      }
      
      switch (selectedWorkplace) {
        case 'hq':
          return ['Federal', 'New York'];
        case 'branch-ca':
          return ['Federal', 'California'];
        case 'remote-dc':
          return ['Federal', 'District of Columbia'];
        default:
          return Object.keys(taxData);
      }
    }
    
    // By Employee view
    else {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (!employee) return [];
      
      const applicableWorkplaces: string[] = [];
      
      if (employee.workplaces) {
        employee.workplaces.forEach(wp => {
          if (selectedWorkplace === 'all' || selectedWorkplace === wp) {
            applicableWorkplaces.push(wp);
          }
        });
      }
      
      // Create separate arrays for different jurisdiction types to control order
      let federalJurisdiction: string[] = ['Federal'];
      let residenceJurisdiction: string[] = [];
      let primaryJurisdictions: string[] = [];
      let otherJurisdictions: string[] = [];
      
      // Add residence jurisdiction if it exists in tax data
      if (employee.residence && taxData[employee.residence.state]) {
        residenceJurisdiction.push(`${employee.residence.state} (Residence)`);
      }
      
      // Keep track of state jurisdictions already added to avoid duplicates
      const stateJurisdictions = new Set<string>();
      
      // First, handle primary workplace to identify primary jurisdictions
      const primaryWorkplace = employee.primaryWorkplace;
      if (applicableWorkplaces.includes(primaryWorkplace)) {
        switch (primaryWorkplace) {
          case 'hq':
            primaryJurisdictions.push('New York (Primary)');
            stateJurisdictions.add('New York');
            break;
          case 'branch-ca':
            primaryJurisdictions.push('California (Primary)');
            stateJurisdictions.add('California');
            break;
          case 'remote-dc':
            primaryJurisdictions.push('District of Columbia (Primary)');
            stateJurisdictions.add('District of Columbia');
            break;
        }
      }
      
      // Then handle other workplaces
      applicableWorkplaces.forEach(wp => {
        // Skip primary workplace, already handled
        if (wp === primaryWorkplace) return;
        
        switch (wp) {
          case 'hq':
            if (!stateJurisdictions.has('New York')) {
              otherJurisdictions.push('New York');
              stateJurisdictions.add('New York');
            }
            break;
          case 'branch-ca':
            if (!stateJurisdictions.has('California')) {
              otherJurisdictions.push('California');
              stateJurisdictions.add('California');
            }
            break;
          case 'remote-dc':
            if (!stateJurisdictions.has('District of Columbia')) {
              otherJurisdictions.push('District of Columbia');
              stateJurisdictions.add('District of Columbia');
            }
            break;
        }
      });
      
      // Combine all jurisdictions in the desired order
      return [
        ...federalJurisdiction,
        ...residenceJurisdiction,
        ...primaryJurisdictions,
        ...otherJurisdictions
      ];
    }
  };

  const filteredJurisdictions = getFilteredJurisdictions();

  // Toggle tax section expansion
  const toggleTaxExpansion = (taxName: string): void => {
    setExpanded(prev => ({
      ...prev,
      [taxName]: !prev[taxName]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Payroll Tax Dashboard</h1>
      
      {/* View Type Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              viewType === 'company' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleViewTypeToggle('company')}
          >
            Entire Company
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              viewType === 'employee' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleViewTypeToggle('employee')}
          >
            By Employee
          </button>
        </div>
        
        {/* Show Employee Details when in Employee View */}
        {viewType === 'employee' && selectedEmployee && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800">Employee Information</h3>
            {(() => {
              const employee = employees.find(emp => emp.id === selectedEmployee);
              if (!employee) return null;
              
              return (
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
              );
            })()}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee Filter - Only visible in By Employee view */}
          {viewType === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee:</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                required
              >
                <option value="" disabled>Select an employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Workplace Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {viewType === 'company' ? 'Filter by Workplace:' : 'Filter by Employee Workplace:'}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
            >
              <option value="all">All Workplaces</option>
              {viewType === 'employee' && selectedEmployee ? 
                // In By Employee view, only show workplaces the employee is assigned to
                employees.find(emp => emp.id === selectedEmployee)?.workplaces.map(wpId => {
                  const workplace = workplaces.find(wp => wp.id === wpId);
                  return workplace ? (
                    <option key={workplace.id} value={workplace.id}>{workplace.name}</option>
                  ) : null;
                })
                :
                // In Entire Company view or if no employee selected, show all workplaces
                workplaces.filter(wp => wp.id !== 'all').map(workplace => (
                  <option key={workplace.id} value={workplace.id}>{workplace.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
      
      {/* Jurisdiction Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          {filteredJurisdictions.map(jurisdiction => (
            <button
              key={jurisdiction}
              className={`mr-2 py-2 px-4 font-medium text-sm rounded-t-lg ${
                activeJurisdiction === jurisdiction 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveJurisdiction(jurisdiction)}
            >
              {jurisdiction}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tax Content */}
      {(filteredJurisdictions.includes(activeJurisdiction) || 
        activeJurisdiction.includes(" (Residence)") || 
        activeJurisdiction.includes(" (Primary)")) && (
        <div>
          {/* Active Taxes */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold">
              Active Taxes
            </h3>
            {(() => {
              // Get the actual jurisdiction key for the tax data
              const jurisdictionKey = activeJurisdiction
                .replace(" (Residence)", "")
                .replace(" (Primary)", "");
              
              // Check if the jurisdiction exists in tax data
              if (!taxData[jurisdictionKey]) {
                return (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          No tax data available for {jurisdictionKey}.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return Object.keys(taxData[jurisdictionKey])
                .filter(taxName => !exemptedTaxes[jurisdictionKey].includes(taxName))
                .map(taxName => (
                  <div key={taxName} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <h3 
                        className="text-lg font-medium cursor-pointer flex-grow"
                        onClick={() => toggleTaxExpansion(taxName)}
                      >
                        {taxName}
                      </h3>
                      <div className="flex items-center">
                        <button
                          className="ml-4 text-sm text-gray-600 hover:text-red-600 focus:outline-none"
                          onClick={() => toggleTaxExemption(jurisdictionKey, taxName)}
                          title="Exempt this tax"
                        >
                          Exempt
                        </button>
                        <span className="ml-4 cursor-pointer" onClick={() => toggleTaxExpansion(taxName)}>
                          {expanded[taxName] ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {expanded[taxName] && (
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {taxData[jurisdictionKey][taxName].parameters.map(param => (
                            <div key={param.id} className="space-y-1">
                              <label className="block text-sm font-medium text-gray-700">
                                {param.name}
                                {param.readonly && <span className="ml-1 text-gray-400 text-xs">(Read-only)</span>}
                              </label>
                              
                              {param.type === 'select' ? (
                                <select 
                                  className="w-full p-2 border border-gray-300 rounded-md" 
                                  disabled={param.readonly}
                                >
                                  <option value="">Select...</option>
                                  {param.options && param.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <input 
                                  type={param.type === 'number' ? 'number' : 'text'} 
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  placeholder={param.type === 'currency' ? '$0.00' : ''}
                                  value={param.value || ''}
                                  readOnly={param.readonly}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ));
            })()}
          </div>

          {/* Exempted Taxes Section */}
          {(() => {
            const jurisdictionKey = activeJurisdiction
              .replace(" (Residence)", "")
              .replace(" (Primary)", "");
            
            if (!taxData[jurisdictionKey]) {
              return null;
            }
            
            if (exemptedTaxes[jurisdictionKey] && exemptedTaxes[jurisdictionKey].length > 0) {
              return (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-600">
                    Exempted Taxes
                  </h3>
                  <div className="space-y-4">
                    {exemptedTaxes[jurisdictionKey].map(taxName => (
                      <div key={taxName} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <div className="px-4 py-3 flex justify-between items-center">
                          <h3 
                            className="text-lg font-medium cursor-pointer flex-grow text-gray-500"
                            onClick={() => toggleTaxExpansion(taxName)}
                          >
                            {taxName}
                          </h3>
                          <div className="flex items-center">
                            <button
                              className="ml-4 text-sm text-gray-600 hover:text-green-600 focus:outline-none"
                              onClick={() => toggleTaxExemption(jurisdictionKey, taxName)}
                              title="Reinstate this tax"
                            >
                              Reinstate
                            </button>
                            <span className="ml-4 cursor-pointer text-gray-500" onClick={() => toggleTaxExpansion(taxName)}>
                              {expanded[taxName] ? '−' : '+'}
                            </span>
                          </div>
                        </div>
                        
                        {expanded[taxName] && (
                          <div className="p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {taxData[jurisdictionKey][taxName].parameters.map(param => (
                                <div key={param.id} className="space-y-1">
                                  <label className="block text-sm font-medium text-gray-500">
                                    {param.name}
                                    {param.readonly && <span className="ml-1 text-gray-400 text-xs">(Read-only)</span>}
                                  </label>
                                  
                                  {param.type === 'select' ? (
                                    <select 
                                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" 
                                      disabled={true}
                                    >
                                      <option value="">Select...</option>
                                      {param.options && param.options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input 
                                      type={param.type === 'number' ? 'number' : 'text'} 
                                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                      placeholder={param.type === 'currency' ? '$0.00' : ''}
                                      value={param.value || ''}
                                      readOnly={true}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
      
      {/* Alert for empty jurisdiction or missing employee selection */}
      {!filteredJurisdictions.includes(activeJurisdiction) && 
       !activeJurisdiction.includes(" (Residence)") &&
       !activeJurisdiction.includes(" (Primary)") && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {viewType === 'employee' 
                  ? `No tax data available for this jurisdiction based on ${employees.find(emp => emp.id === selectedEmployee)?.name}'s workplace assignments.`
                  : 'No tax data available for this jurisdiction with the selected workplace filter.'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* By Employee view with no employee selected */}
      {viewType === 'employee' && !selectedEmployee && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Please select an employee to view their applicable tax jurisdictions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollTaxDashboard;
