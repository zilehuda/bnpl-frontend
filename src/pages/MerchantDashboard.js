import { Statistic, Row, Col, Card } from "antd";
import apiService from "../services/apiService";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import MerchantPlanManagement from "../components/MerchantPlanManagement";

const MerchantDashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    apiService
      .getMerchantMetrics()
      .then((response) => {
        setMetrics(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, []);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div style={{ padding: 20 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={metrics.total_revenue}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Overdue Plans" value={metrics.overdue_plans} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Success Rate"
                value={metrics.success_rate}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 20 }}>
          <MerchantPlanManagement />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MerchantDashboard;
