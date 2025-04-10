
import React from 'react';

interface JurisdictionTabsProps {
  jurisdictions: string[];
  activeJurisdiction: string;
  onJurisdictionChange: (jurisdiction: string) => void;
}

const JurisdictionTabs = ({ 
  jurisdictions, 
  activeJurisdiction, 
  onJurisdictionChange 
}: JurisdictionTabsProps) => {
  // Function to format jurisdiction label
  const formatJurisdictionLabel = (jurisdiction: string): string => {
    return jurisdiction
      .replace(" (Primary)", " (Primary Workplace)")
      .replace(" (Residence, Primary)", " (Residence, Primary Workplace)")
      .replace(" (Primary Workplace, Residence)", " (Residence, Primary Workplace)");
  };

  return (
    <div className="mb-4 border-b border-gray-200">
      <div className="flex flex-wrap -mb-px">
        {jurisdictions.map(jurisdiction => (
          <button
            key={jurisdiction}
            className={`mr-2 py-2 px-4 font-medium text-sm rounded-t-lg ${
              activeJurisdiction === jurisdiction 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onJurisdictionChange(jurisdiction)}
          >
            {formatJurisdictionLabel(jurisdiction)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JurisdictionTabs;
