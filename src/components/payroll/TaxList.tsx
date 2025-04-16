import React from 'react';
import { List, Collapse, Switch, Button, Space, Typography } from 'antd';
import { AlertCircle } from 'lucide-react';
import { TaxData, ExemptedTaxes, ExpandedState, ViewType, Employee } from '@/types/payroll-tax-types';
import TaxCard from './TaxCard';
import { getApplicableTaxes } from '@/utils/tax-utils';
import { taxData } from '@/data/tax-data';
import { workplaces } from '@/data/employee-data';

const { Text } = Typography;
const { Panel } = Collapse;

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

  const getTaxesForJurisdiction = () => {
    // Your existing tax filtering logic here
    return [];
  };

  const taxes = getTaxesForJurisdiction();

  return (
    <List
      dataSource={taxes}
      renderItem={(tax) => (
        <List.Item>
          <Collapse
            activeKey={expanded[tax.name] ? tax.name : undefined}
            onChange={() => onToggleTaxExpansion(tax.name)}
            style={{ width: '100%' }}
          >
            <Panel
              header={
                <Space>
                  <Text strong>{tax.name}</Text>
                  <Switch
                    checked={!exemptedTaxes[activeJurisdiction]?.includes(tax.name)}
                    onChange={() => onToggleTaxExemption(activeJurisdiction, tax.name)}
                  />
                </Space>
              }
              key={tax.name}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>{tax.description}</Text>
                {!electedTaxes[activeJurisdiction]?.includes(tax.name) && (
                  <Button
                    type="primary"
                    onClick={() => onAddTaxElection(activeJurisdiction, tax.name)}
                  >
                    Add Tax Election
                  </Button>
                )}
              </Space>
            </Panel>
          </Collapse>
        </List.Item>
      )}
    />
  );
};

export default TaxList;
