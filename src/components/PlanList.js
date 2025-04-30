import React, { useEffect, useState } from "react";
import { Table, Tag, Progress, message } from "antd";
import moment from "moment";
import apiService from "../services/apiService";
import ExpandedInstallments from "../components/ExpandedInstallments"; // Adjust path if needed

const PlanList = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchPlans = async (current = 1, pageSize = 10) => {
    setLoading(true);
    const limit = pageSize;
    const offset = (current - 1) * pageSize;
    try {
      const response = await apiService.getPlans({ limit, offset });
      setData(response.data.data);
      setPagination({
        current,
        pageSize,
        total: response.data.pagination?.count || 0,
      });
    } catch (error) {
      console.error("Error fetching plans:", error);
      messageApi.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (newPagination) => {
    fetchPlans(newPagination.current, newPagination.pageSize);
  };

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const isMerchant = user?.is_merchant;

  const columns = [
    {
      title: "Number of Installments",
      key: "installments",
      render: (_, record) => {
        const total = record.number_of_installments;
        const paid = record.total_paid_installments;
        const isOverdue = record.total_overdue_installments > 0;
        return (
          <div>
            <Progress
              percent={((paid / total) * 100).toFixed(2)}
              size="small"
              status={paid === total ? "success" : "active"}
              strokeColor={isOverdue ? "#ff4d4f" : undefined}
            />
            {`${paid}/${total} paid installments`}
          </div>
        );
      },
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.status === "active" ? "blue" : "green"}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => moment(date).format("MMMM Do, YYYY"),
    },
    {
      title: isMerchant ? "User Name" : "Merchant Name",
      dataIndex: isMerchant ? ["user", "name"] : ["merchant", "name"],
      key: isMerchant ? "user_name" : "merchant_name",
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <ExpandedInstallments installments={record.installments} />
          ),
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default PlanList;
