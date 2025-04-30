import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div style={{ width: "80%" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
          Welcome to BNPL Platform
        </Title>
        <Row gutter={16} justify="center">
          <Col span={8}>
            <Card
              hoverable
              style={{ textAlign: "center" }}
              onClick={() => navigate("/merchant/login")}
            >
              <Title level={4}>Login as Merchant</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{ textAlign: "center" }}
              onClick={() => navigate("/user/login")}
            >
              <Title level={4}>Login as User</Title>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
