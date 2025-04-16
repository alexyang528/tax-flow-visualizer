import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TaxData, ExemptedTaxes, ExpandedState, ViewType, Employee } from '@/types/payroll-tax-types';
import TaxCard from './TaxCard';
import { getApplicableTaxes } from '@/utils/tax-utils';
import { taxData } from '@/data/tax-data';
import { workplaces } from '@/data/employee-data';

interface TaxListProps {
  activeJurisdiction: string;
  viewType: ViewType;
  exemptedTaxes: ExemptedTaxes;
  electedTaxes: ExemptedTaxes;
  expanded: ExpandedState;
  onToggleTaxExpansion: (taxName: string) => void;
  onToggleTaxExemption: (jurisdiction: string, taxName: string) => void;
  onAddTaxElection: (jurisdiction: string, taxName: string) => void;
  selectedEmployee?: string;
  selectedWorkplace?: string;
  employees: Employee[];
}

const TaxList = ({
  activeJurisdiction,
  viewType,
  exemptedTaxes,
  electedTaxes,
  expanded,
  onToggleTaxExpansion,
  onToggleTaxExemption,
  onAddTaxElection,
  selectedEmployee,
  selectedWorkplace,
  employees
}: TaxListProps) => {
  const jurisdictionKey = activeJurisdiction
    .replace(" (Residence)", "")
    .replace(" (Primary Workplace)", "")
    .replace(" (Residence, Primary Workplace)", "");
  
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
  
  const applicableTaxes = getApplicableTaxes(
    activeJurisdiction, 
    viewType,
    selectedEmployee,
    selectedWorkplace,
    employees
  );
  
  const activeTaxes = applicableTaxes.filter(taxName => !exemptedTaxes[jurisdictionKey].includes(taxName));
  const exemptedApplicableTaxes = exemptedTaxes[jurisdictionKey].filter(taxName => 
    applicableTaxes.includes(taxName)
  );

  const employee = selectedEmployee ? employees.find(emp => emp.id === selectedEmployee) : undefined;

  // Get all company workplace states
  const companyWorkplaceStates = new Set<string>();
  workplaces.forEach(wp => {
    switch (wp.id) {
      case 'hq':
        companyWorkplaceStates.add('New York');
        break;
      case 'branch-ca':
        companyWorkplaceStates.add('California');
        break;
      case 'remote-dc':
        companyWorkplaceStates.add('District of Columbia');
        break;
    }
  });

  // Separate optional taxes (residence-based taxes where company doesn't have a workplace)
  const optionalTaxes = activeTaxes.filter(taxName => {
    const taxConfig = taxData[jurisdictionKey][taxName];
    return taxConfig.drivenBy && 
           taxConfig.drivenBy.includes('residence') && 
           !companyWorkplaceStates.has(jurisdictionKey) &&
           !electedTaxes[jurisdictionKey].includes(taxName);
  });

  // Remove optional taxes from active taxes
  const requiredActiveTaxes = activeTaxes.filter(taxName => !optionalTaxes.includes(taxName));

  return (
    <div>
      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold">
            Applicable Taxes
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            These taxes are required to be withheld based on the employee's workplace, residence, or primary workplace.
          </p>
        </div>
        {requiredActiveTaxes.map(taxName => (
          <TaxCard
            key={taxName}
            taxName={taxName}
            taxConfig={taxData[jurisdictionKey][taxName]}
            isExempted={false}
            isExpanded={expanded[taxName] || false}
            onToggleExpand={() => onToggleTaxExpansion(taxName)}
            onToggleExemption={() => onToggleTaxExemption(jurisdictionKey, taxName)}
            viewType={viewType}
            employee={employee}
            selectedWorkplace={selectedWorkplace}
            jurisdictionKey={jurisdictionKey}
          />
        ))}
      </div>

      {optionalTaxes.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Courtesy Taxes
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            These taxes are not required to be withheld since the company does not have a workplace in this state, but you may choose to opt in as a courtesy to your employees.
          </p>
          <div className="space-y-4">
            {optionalTaxes.map(taxName => (
              <TaxCard
                key={taxName}
                taxName={taxName}
                taxConfig={taxData[jurisdictionKey][taxName]}
                isExempted={false}
                isExpanded={expanded[taxName] || false}
                onToggleExpand={() => onToggleTaxExpansion(taxName)}
                onAddTaxElection={() => onAddTaxElection(jurisdictionKey, taxName)}
                viewType={viewType}
                employee={employee}
                selectedWorkplace={selectedWorkplace}
                jurisdictionKey={jurisdictionKey}
                isOptional={true}
              />
            ))}
          </div>
        </div>
      )}

      {exemptedApplicableTaxes.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Exempted Taxes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              These taxes have been exempted and will not be withheld from the employee's paycheck.
            </p>
          </div>
          <div className="space-y-4">
            {exemptedApplicableTaxes.map(taxName => (
              <TaxCard
                key={taxName}
                taxName={taxName}
                taxConfig={taxData[jurisdictionKey][taxName]}
                isExempted={true}
                isExpanded={expanded[taxName] || false}
                onToggleExpand={() => onToggleTaxExpansion(taxName)}
                onToggleExemption={() => onToggleTaxExemption(jurisdictionKey, taxName)}
                viewType={viewType}
                employee={employee}
                selectedWorkplace={selectedWorkplace}
                jurisdictionKey={jurisdictionKey}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxList;
