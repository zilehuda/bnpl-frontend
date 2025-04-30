import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

const { Title } = Typography;

const GenericLogin = ({ isMerchant }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = isMerchant
        ? await apiService.loginMerchant(values)
        : await apiService.loginUser(values);

      localStorage.setItem("access_token", response.data.data.token.access);
      localStorage.setItem("refresh_token", response.data.data.token.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      navigate(isMerchant ? "/merchant/dashboard" : "/user/dashboard");
    } catch (error) {
      console.log("Login error:", error.response.status);
      if (error.response && error.response.status === 401) {
        messageApi.error("Unauthorized: Invalid credentials.");
      } else {
        messageApi.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            width: 400,
            padding: 20,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
            {isMerchant ? "Merchant Login" : "User Login"}
          </Title>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default GenericLogin;
