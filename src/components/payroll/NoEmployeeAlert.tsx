import React from 'react';
import { Alert } from 'antd';

const NoEmployeeAlert: React.FC = () => {
  return (
    <Alert
      message="No Employee Selected"
      description="Please select an employee to view their tax information."
      type="warning"
      showIcon
    />
  );
};

export default NoEmployeeAlert;
