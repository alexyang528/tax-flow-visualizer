import React from 'react';
import { Radio } from 'antd';
import { ViewType } from '@/types/payroll-tax-types';

interface ViewTypeToggleProps {
  viewType: ViewType;
  onToggle: (type: ViewType) => void;
}

const ViewTypeToggle: React.FC<ViewTypeToggleProps> = ({ viewType, onToggle }) => {
  return (
    <Radio.Group
      value={viewType}
      onChange={(e) => onToggle(e.target.value)}
      optionType="button"
      buttonStyle="solid"
    >
      <Radio.Button value="company">Company View</Radio.Button>
      <Radio.Button value="employee">Employee View</Radio.Button>
    </Radio.Group>
  );
};

export default ViewTypeToggle;
