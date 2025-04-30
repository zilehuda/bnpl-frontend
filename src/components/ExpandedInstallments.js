// components/ExpandedInstallments.js
import React from "react";
import { Table, Tag } from "antd";
import moment from "moment";

const ExpandedInstallments = ({ installments }) => {
  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (date) => moment(date).format("MMMM Do, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          paid: "green",
          pending: "blue",
          late: "red",
        };
        return <Tag color={colorMap[status] || "gray"}>{status}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={installments}
      rowKey="id"
      pagination={false}
    />
  );
};

export default ExpandedInstallments;
