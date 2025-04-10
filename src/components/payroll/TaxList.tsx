
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TaxData, ExemptedTaxes, ExpandedState, ViewType } from '@/types/payroll-tax-types';
import TaxCard from './TaxCard';
import { getApplicableTaxes } from '@/utils/tax-utils';
import { taxData } from '@/data/tax-data';

interface TaxListProps {
  activeJurisdiction: string;
  viewType: ViewType;
  exemptedTaxes: ExemptedTaxes;
  expanded: ExpandedState;
  onToggleTaxExpansion: (taxName: string) => void;
  onToggleTaxExemption: (jurisdiction: string, taxName: string) => void;
}

const TaxList = ({
  activeJurisdiction,
  viewType,
  exemptedTaxes,
  expanded,
  onToggleTaxExpansion,
  onToggleTaxExemption
}: TaxListProps) => {
  const jurisdictionKey = activeJurisdiction
    .replace(" (Residence)", "")
    .replace(" (Primary)", "")
    .replace(" (Residence, Primary)", "");
  
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
  
  const applicableTaxes = getApplicableTaxes(activeJurisdiction, viewType);
  const activeTaxes = applicableTaxes.filter(taxName => !exemptedTaxes[jurisdictionKey].includes(taxName));
  const exemptedApplicableTaxes = exemptedTaxes[jurisdictionKey].filter(taxName => 
    applicableTaxes.includes(taxName)
  );

  return (
    <div>
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold">
          Active Taxes
        </h3>
        {activeTaxes.map(taxName => (
          <TaxCard
            key={taxName}
            taxName={taxName}
            taxConfig={taxData[jurisdictionKey][taxName]}
            isExempted={false}
            isExpanded={expanded[taxName] || false}
            onToggleExpand={() => onToggleTaxExpansion(taxName)}
            onToggleExemption={() => onToggleTaxExemption(jurisdictionKey, taxName)}
          />
        ))}
      </div>

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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxList;
