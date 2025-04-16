import React from 'react';
import { Alert } from 'antd';
import { ViewType, Employee } from '@/types/payroll-tax-types';

interface NoJurisdictionAlertProps {
  viewType: ViewType;
  selectedEmployee: string;
  employees: Employee[];
}

const NoJurisdictionAlert: React.FC<NoJurisdictionAlertProps> = ({
  viewType,
  selectedEmployee,
  employees,
}) => {
  const employee = employees.find(emp => emp.id === selectedEmployee);
  
  return (
    <Alert
      message="No Applicable Jurisdictions"
      description={
        viewType === 'employee' && employee
          ? `No jurisdictions are applicable for ${employee.name} based on their workplace and residence.`
          : 'No jurisdictions are applicable for the selected filters.'
      }
      type="info"
      showIcon
    />
  );
};

export default NoJurisdictionAlert;
