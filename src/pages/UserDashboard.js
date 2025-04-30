import React, { useEffect, useState } from "react";
import { Typography, message, Table, Tag, Tabs, Button } from "antd";
import moment from "moment";
import apiService from "../services/apiService";
import DashboardLayout from "../components/DashboardLayout";
import PlanList from "../components/PlanList";

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [upcomingInstallments, setUpcomingInstallments] = useState([]);
  const [pastInstallments, setPastInstallments] = useState([]);
  const [upcomingPagination, setUpcomingPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [pastPagination, setPastPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch installments data
  const fetchInstallments = async (
    installmentType,
    current = 1,
    pageSize = 10
  ) => {
    setLoading(true);
    try {
      const response = await apiService.getUserInstallments({
        installment_type: installmentType,
        limit: pageSize,
        offset: (current - 1) * pageSize,
      });

      if (installmentType === "upcoming") {
        setUpcomingInstallments(response.data.data);
        setUpcomingPagination({
          current,
          pageSize,
          total: response.data.pagination?.count || 0,
        });
      } else if (installmentType === "past") {
        setPastInstallments(response.data.data);
        setPastPagination({
          current,
          pageSize,
          total: response.data.pagination?.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching installments:", error);
      messageApi.error("Failed to fetch installments");
    } finally {
      setLoading(false);
    }
  };

  // Pay button functionality
  const handlePay = async (id) => {
    try {
      await apiService.payInstallment(id); // Call the pay API
      messageApi.success("Installment paid successfully!");
      // Refresh both upcoming and past tables after payment
      fetchInstallments(
        "upcoming",
        upcomingPagination.current,
        upcomingPagination.pageSize
      );
      fetchInstallments(
        "past",
        pastPagination.current,
        pastPagination.pageSize
      );
    } catch (error) {
      console.error("Failed to pay installment:", error);
      messageApi.error("Failed to pay installment");
    }
  };

  const installmentColumns = [
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (due_date) => moment(due_date).format("MMMM Do, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          {
            paid: "green",
            pending: "blue",
            late: "red",
          }[status] || "gray";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handlePay(record.id)}
          disabled={record.status === "paid"}
        >
          {record.status === "paid" ? "Paid" : "Pay"}
        </Button>
      ),
    },
  ];

  // Table change handler for pagination
  const handleTableChange = (installmentType, newPagination) => {
    fetchInstallments(
      installmentType,
      newPagination.current,
      newPagination.pageSize
    );
  };

  useEffect(() => {
    fetchInstallments(
      "upcoming",
      upcomingPagination.current,
      upcomingPagination.pageSize
    );
    fetchInstallments("past", pastPagination.current, pastPagination.pageSize);
  }, []);

  return (
    <>
      {contextHolder}
      <DashboardLayout>
        <div style={{ padding: 20 }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Upcoming Installments" key="1">
              <Table
                columns={installmentColumns}
                dataSource={upcomingInstallments}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: upcomingPagination.current,
                  pageSize: upcomingPagination.pageSize,
                  total: upcomingPagination.total,
                  showSizeChanger: true,
                }}
                onChange={(pagination) =>
                  handleTableChange("upcoming", pagination)
                }
                bordered
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Past Installments" key="2">
              <Table
                columns={installmentColumns}
                dataSource={pastInstallments}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: pastPagination.current,
                  pageSize: pastPagination.pageSize,
                  total: pastPagination.total,
                  showSizeChanger: true,
                }}
                onChange={(pagination) => handleTableChange("past", pagination)}
                bordered
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Plans" key="3">
              <PlanList />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
