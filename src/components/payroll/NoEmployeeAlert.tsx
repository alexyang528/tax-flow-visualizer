
import React from 'react';
import { AlertCircle } from 'lucide-react';

const NoEmployeeAlert = () => {
  return (
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
  );
};

export default NoEmployeeAlert;
