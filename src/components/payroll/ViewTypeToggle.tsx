import React from 'react';
import { ViewType } from '@/types/payroll-tax-types';

interface ViewTypeToggleProps {
  viewType: ViewType;
  onToggle: (type: ViewType) => void;
}

const ViewTypeToggle = ({ viewType, onToggle }: ViewTypeToggleProps) => {
  return null;
};

export default ViewTypeToggle;
