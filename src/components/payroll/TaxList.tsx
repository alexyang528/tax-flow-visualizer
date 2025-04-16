import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TaxData, ExemptedTaxes, ExpandedState, ViewType } from '@/types/payroll-tax-types';
import TaxCard from './TaxCard';
import { getApplicableTaxes } from '@/utils/tax-utils';
import { taxData } from '@/data/tax-data';
import { employees, workplaces } from '@/data/employee-data';

interface TaxListProps {
  activeJurisdiction: string;
  viewType: ViewType;
  exemptedTaxes: ExemptedTaxes;
  expanded: ExpandedState;
  onToggleTaxExpansion: (taxName: string) => void;
  onToggleTaxExemption: (jurisdiction: string, taxName: string) => void;
  selectedEmployee?: string;
  selectedWorkplace?: string;
}

const TaxList = ({
  activeJurisdiction,
  viewType,
  exemptedTaxes,
  expanded,
  onToggleTaxExpansion,
  onToggleTaxExemption,
  selectedEmployee,
  selectedWorkplace
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
    selectedWorkplace
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
           !companyWorkplaceStates.has(jurisdictionKey);
  });

  // Remove optional taxes from active taxes
  const requiredActiveTaxes = activeTaxes.filter(taxName => !optionalTaxes.includes(taxName));

  return (
    <div>
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold">
          Active Taxes
        </h3>
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
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Optional Taxes
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            These taxes are not required to be withheld since the company does not have a workplace in this state, but you may choose to opt in.
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

      {exemptedApplicableTaxes.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-600">
            Exempted Taxes
          </h3>
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
