import React from 'react';
import { Form, Select, Space } from 'antd';
import { ViewType, Employee } from '@/types/payroll-tax-types';

interface FilterControlsProps {
  viewType: ViewType;
  selectedEmployee: string;
  selectedWorkplace: string;
  employees: Employee[];
  workplaces: { id: string; name: string }[];
  onEmployeeChange: (employeeId: string) => void;
  onWorkplaceChange: (workplaceId: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  viewType,
  selectedEmployee,
  selectedWorkplace,
  employees,
  workplaces,
  onEmployeeChange,
  onWorkplaceChange,
}) => {
  return (
    <Form layout="vertical">
      <Space direction="horizontal" size="middle">
        {viewType === 'employee' && (
          <Form.Item label="Select Employee">
            <Select
              value={selectedEmployee}
              onChange={onEmployeeChange}
              style={{ width: 200 }}
              placeholder="Select an employee"
            >
              {employees.map((employee) => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        
        <Form.Item label="Filter by Workplace">
          <Select
            value={selectedWorkplace}
            onChange={onWorkplaceChange}
            style={{ width: 200 }}
            placeholder="Select a workplace"
          >
            <Select.Option value="all">All Workplaces</Select.Option>
            {workplaces.map((workplace) => (
              <Select.Option key={workplace.id} value={workplace.id}>
                {workplace.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default FilterControls;
