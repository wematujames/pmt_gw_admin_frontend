"use client";

import { useState } from "react";
import { Button, DatePicker, Drawer, Form, Input, Select, Space } from "antd";
import { FiFilter } from "react-icons/fi";
import dayjs from "dayjs";

const { Option } = Select;

export default function FilterUsers({
  filter,
  setFilter,
}: {
  filter: Record<string, any>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (formVals: any) => {
    const newFilters = { ...formVals };

    // Handle Date formatting
    if (newFilters.dateTime && newFilters.dateTime.length === 2) {
      newFilters.startDate = dayjs(newFilters.dateTime[0]).startOf("day").toISOString();
      newFilters.endDate = dayjs(newFilters.dateTime[1]).endOf("day").toISOString();
    }
    delete newFilters.dateTime;

    // Strip out undefined or empty values to keep the query clean
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, value]) => Boolean(value))
    );

    // Merge new filters, KEEP current page size limit, but RESET to page 1
    setFilter((prev) => ({
      ...cleanFilters,
      _limit: prev._limit,
      _page: 1,
    }));

    setOpen(false);
  };

  const handleReset = () => {
    form.resetFields();
    // Clear filters, keep current limit, reset to page 1
    setFilter((prev) => ({
      _limit: prev._limit,
      _page: 1,
    }));
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        icon={<FiFilter />}
        type="primary"
        className="shadow-sm border-gray-200 text-gray-700 hover:text-[#142868] hover:border-[#142868]"
      >
        Filter
      </Button>

      <Drawer
        title={
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-800 tracking-tight">
              Filter Users
            </span>
            <span className="text-xs text-gray-500 font-medium mt-1">
              Narrow down the users list
            </span>
          </div>
        }
        size={450}
        onClose={() => setOpen(false)}
        open={open}
        footer={
          <div className="flex justify-between items-center w-full py-2">
            <Button
              onClick={handleReset}
              type="text"
              className="text-gray-500 hover:text-red-600 font-medium"
            >
              Clear All
            </Button>
            <Space>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={() => form.submit()}>
                Apply Filters
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={filter}
          className="flex flex-col gap-1"
        >
          <Form.Item name="email" label="Email">
            <Input size="large" placeholder="e.g. jwematu@nerasolgh.com" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input size="large" placeholder="e.g. 233554268378" />
          </Form.Item>

          <Form.Item name="active" label="Status">
            <Select size="large" allowClear placeholder="All Statuses">
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateTime" label="Created Between">
            <DatePicker.RangePicker
              size="large"
              className="w-full"
              getPopupContainer={(trigger) => trigger.parentElement!}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}