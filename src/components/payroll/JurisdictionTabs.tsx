import React from 'react';
import { Tabs } from 'antd';

interface JurisdictionTabsProps {
  jurisdictions: string[];
  activeJurisdiction: string;
  onJurisdictionChange: (jurisdiction: string) => void;
}

const JurisdictionTabs: React.FC<JurisdictionTabsProps> = ({
  jurisdictions,
  activeJurisdiction,
  onJurisdictionChange,
}) => {
  return (
    <Tabs
      activeKey={activeJurisdiction}
      onChange={onJurisdictionChange}
      items={jurisdictions.map((jurisdiction) => ({
        key: jurisdiction,
        label: jurisdiction,
      }))}
    />
  );
};

export default JurisdictionTabs;
