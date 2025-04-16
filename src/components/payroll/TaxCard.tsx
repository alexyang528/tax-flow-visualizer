import React, { useState } from 'react';
import { TaxConfig, Employee } from '@/types/payroll-tax-types';
import TaxParameter from './TaxParameter';
import { getActualDrivenBy } from '@/utils/tax-utils';
import { workplaces } from '@/data/employee-data';

interface TaxCardProps {
  taxName: string;
  taxConfig: TaxConfig;
  isExempted: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleExemption?: () => void;
  onAddTaxElection?: () => void;
  viewType: 'company' | 'employee';
  employee?: Employee;
  selectedWorkplace?: string;
  jurisdictionKey: string;
  isOptional?: boolean;
  employees: Employee[];
}

const TaxCard = ({
  taxName,
  taxConfig,
  isExempted,
  isExpanded,
  onToggleExpand,
  onToggleExemption,
  onAddTaxElection,
  viewType,
  employee,
  selectedWorkplace,
  jurisdictionKey,
  isOptional = false,
  employees
}: TaxCardProps) => {
  const [showDrivers, setShowDrivers] = useState(false);
  const [showWorkplaceDrivers, setShowWorkplaceDrivers] = useState(false);
  const [showResidenceDrivers, setShowResidenceDrivers] = useState(false);
  const [showPrimaryWorkplaceDrivers, setShowPrimaryWorkplaceDrivers] = useState(false);
  const drivenBy = taxConfig.drivenBy === null
    ? ''
    : viewType === 'employee' && employee
      ? getActualDrivenBy(taxConfig, employee, selectedWorkplace || 'all', jurisdictionKey)
      : taxConfig.drivenBy;

  const getApplicableDrivers = () => {
    if (!taxConfig.drivenBy) return { workplaces: [], residences: [], primaryWorkplaces: [] };

    const drivers = {
      workplaces: [] as string[],
      residences: [] as string[],
      primaryWorkplaces: [] as string[]
    };
    const drivenByFactors = taxConfig.drivenBy.split(', ');

    // Clean the jurisdiction key by removing any suffixes
    const cleanJurisdictionKey = jurisdictionKey
      .replace(" (Residence)", "")
      .replace(" (Primary Workplace)", "")
      .replace(" (Residence, Primary Workplace)", "");

    if (viewType === 'employee') {
      if (!employee) return drivers;

      // Check residence
      if (drivenByFactors.includes('residence') && employee.residence.state === cleanJurisdictionKey) {
        drivers.residences.push(`Residence: ${employee.name} → ${employee.residence.state}`);
      }

      // Check primary workplace
      if (drivenByFactors.includes('primary workplace')) {
        const primaryWorkplace = workplaces.find(wp => wp.id === employee.primaryWorkplace);
        if (primaryWorkplace) {
          const isInJurisdiction = (() => {
            switch (primaryWorkplace.id) {
              case 'hq':
                return cleanJurisdictionKey === 'New York';
              case 'branch-ca':
                return cleanJurisdictionKey === 'California';
              case 'remote-dc':
                return cleanJurisdictionKey === 'District of Columbia';
              default:
                return false;
            }
          })();
          
          if (isInJurisdiction) {
            drivers.primaryWorkplaces.push(`Primary Workplace: ${employee.name} → ${primaryWorkplace.name}`);
          }
        }
      }

      // Check other workplaces
      if (drivenByFactors.includes('workplace')) {
        const applicableWorkplaces = employee.workplaces
          .filter(wp => wp !== employee.primaryWorkplace)
          .map(wpId => workplaces.find(wp => wp.id === wpId))
          .filter((wp): wp is NonNullable<typeof wp> => wp !== undefined)
          .filter(wp => {
            switch (wp.id) {
              case 'hq':
                return cleanJurisdictionKey === 'New York';
              case 'branch-ca':
                return cleanJurisdictionKey === 'California';
              case 'remote-dc':
                return cleanJurisdictionKey === 'District of Columbia';
              default:
                return false;
            }
          })
          .map(wp => `Workplace: ${employee.name} → ${wp.name}`);

        if (applicableWorkplaces.length > 0) {
          drivers.workplaces.push(...applicableWorkplaces);
        }
      }
    } else {
      // Company view
      if (drivenByFactors.includes('residence')) {
        const residentEmployees = employees
          .filter(emp => emp.residence.state === cleanJurisdictionKey)
          .map(emp => `Residence: ${emp.name} → ${emp.residence.state}`);
        drivers.residences.push(...residentEmployees);
      }

      if (drivenByFactors.includes('primary workplace')) {
        const primaryWorkplaces = workplaces
          .filter(wp => {
            switch (wp.id) {
              case 'hq':
                return cleanJurisdictionKey === 'New York';
              case 'branch-ca':
                return cleanJurisdictionKey === 'California';
              case 'remote-dc':
                return cleanJurisdictionKey === 'District of Columbia';
              default:
                return false;
            }
          })
          .map(wp => {
            const employeesWithPrimary = employees.filter(emp => emp.primaryWorkplace === wp.id);
            return employeesWithPrimary.map(emp => `Primary Workplace: ${emp.name} → ${wp.name}`);
          })
          .flat();
        drivers.primaryWorkplaces.push(...primaryWorkplaces);
      }

      if (drivenByFactors.includes('workplace')) {
        const applicableWorkplaces = workplaces
          .filter(wp => {
            switch (wp.id) {
              case 'hq':
                return cleanJurisdictionKey === 'New York';
              case 'branch-ca':
                return cleanJurisdictionKey === 'California';
              case 'remote-dc':
                return cleanJurisdictionKey === 'District of Columbia';
              default:
                return false;
            }
          })
          .map(wp => {
            const employeesWithWorkplace = employees.filter(emp => 
              emp.workplaces.includes(wp.id) && emp.primaryWorkplace !== wp.id
            );
            return employeesWithWorkplace.map(emp => `Workplace: ${emp.name} → ${wp.name}`);
          })
          .flat();
        drivers.workplaces.push(...applicableWorkplaces);
      }
    }

    return drivers;
  };

  const applicableDrivers = getApplicableDrivers();
  const hasAnyDrivers = applicableDrivers.workplaces.length > 0 || 
                       applicableDrivers.residences.length > 0 || 
                       applicableDrivers.primaryWorkplaces.length > 0;

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${isExempted ? 'bg-gray-50' : ''}`}>
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <h3 
          className={`text-lg font-medium cursor-pointer flex-grow ${isExempted ? 'text-gray-500' : ''}`}
          onClick={onToggleExpand}
        >
          {taxName}
          {drivenBy && (
            <span className="ml-2 text-xs text-gray-500">
              ({drivenBy})
            </span>
          )}
        </h3>
        <div className="flex items-center">
          {isOptional ? (
            <button
              className="ml-4 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={onAddTaxElection}
              title="Add tax election"
            >
              Add Tax Election
            </button>
          ) : (
            <button
              className={`ml-4 text-sm text-gray-600 hover:${isExempted ? 'text-green-600' : 'text-red-600'} focus:outline-none`}
              onClick={onToggleExemption}
              title={isExempted ? "Reinstate this tax" : "Exempt this tax"}
            >
              {isExempted ? 'Reinstate' : 'Exempt'}
            </button>
          )}
          <span className={`ml-4 cursor-pointer ${isExempted ? 'text-gray-500' : ''}`} onClick={onToggleExpand}>
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className={`p-4 ${isExempted ? 'bg-gray-50' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taxConfig.parameters.map(param => (
              <TaxParameter key={param.id} parameter={param} isExempted={isExempted} />
            ))}
          </div>

          {hasAnyDrivers && (
            <div className="mt-4 border-t pt-4 space-y-4">
              {applicableDrivers.workplaces.length > 0 && (
                <div>
                  <button
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => setShowWorkplaceDrivers(!showWorkplaceDrivers)}
                  >
                    <span>Workplaces</span>
                    <span className="ml-2">{showWorkplaceDrivers ? '−' : '+'}</span>
                  </button>
                  
                  {showWorkplaceDrivers && (
                    <div className="mt-2 space-y-1">
                      {applicableDrivers.workplaces.map((driver, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {driver}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {applicableDrivers.residences.length > 0 && (
                <div>
                  <button
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => setShowResidenceDrivers(!showResidenceDrivers)}
                  >
                    <span>Employee Residences</span>
                    <span className="ml-2">{showResidenceDrivers ? '−' : '+'}</span>
                  </button>
                  
                  {showResidenceDrivers && (
                    <div className="mt-2 space-y-1">
                      {applicableDrivers.residences.map((driver, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {driver}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {applicableDrivers.primaryWorkplaces.length > 0 && (
                <div>
                  <button
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => setShowPrimaryWorkplaceDrivers(!showPrimaryWorkplaceDrivers)}
                  >
                    <span>Primary Workplaces</span>
                    <span className="ml-2">{showPrimaryWorkplaceDrivers ? '−' : '+'}</span>
                  </button>
                  
                  {showPrimaryWorkplaceDrivers && (
                    <div className="mt-2 space-y-1">
                      {applicableDrivers.primaryWorkplaces.map((driver, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {driver}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaxCard;
