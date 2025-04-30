import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  message,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Table,
  Divider,
} from "antd";
import moment from "moment";
import apiService from "../services/apiService";
import PlanList from "./PlanList";
const { Title } = Typography;

const MerchantPlanManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [installmentPreview, setInstallmentPreview] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        start_date: values.start_date.format("YYYY-MM-DD"),
      };
      await apiService.createPlan(formattedValues);
      messageApi.success("Plan added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      if (error.response?.data?.code === 3000) {
        const backendErrors = error.response.data.error;
        Object.keys(backendErrors).forEach((field) => {
          form.setFields([
            { name: field, errors: [backendErrors[field].join(", ")] },
          ]);
        });
      } else {
        messageApi.error("Failed to add plan.");
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const disablePastDates = (current) => {
    return current && current < moment().endOf("day");
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        start_date: values.start_date.format("YYYY-MM-DD"),
      };

      const response = await apiService.getInstallmentPlans({
        number_of_installments: formattedValues.number_of_installments,
        total_amount: formattedValues.total_amount,
        start_date: formattedValues.start_date,
      });
      setInstallmentPreview(response.data.data.installments);
    } catch (error) {
      if (!error.errorFields) {
        messageApi.error("Failed to preview installments");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{}}>
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Title level={2}></Title>
          <Button type="primary" onClick={showModal}>
            Add Plan
          </Button>
        </Space>
        <PlanList />
        <Modal
          title="Add Plan"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              name="user_email"
              rules={[
                { required: true, message: "Please input the user email!" },
              ]}
            >
              <Input placeholder="Enter user email" />
            </Form.Item>
            <Form.Item
              name="total_amount"
              rules={[
                { required: true, message: "Please input the total amount!" },
              ]}
            >
              <Input placeholder="Enter total amount" />
            </Form.Item>
            <Form.Item
              name="number_of_installments"
              rules={[
                {
                  required: true,
                  message: "Please input number of installments",
                },
              ]}
            >
              <Input placeholder="Enter number of installments" />
            </Form.Item>
            <Form.Item
              name="start_date"
              rules={[
                { required: true, message: "Please select the start date!" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={disablePastDates}
              />
            </Form.Item>
            <Button
              type="default"
              onClick={handlePreview}
              style={{ marginBottom: 20 }}
            >
              Preview Installments Plan
            </Button>
            {installmentPreview.length > 0 && (
              <>
                <Divider>Installment Preview</Divider>
                <Table
                  columns={[
                    { title: "Amount", dataIndex: "amount", key: "amount" },
                    {
                      title: "Due Date",
                      dataIndex: "due_date",
                      key: "due_date",
                      render: (due_date) =>
                        moment(due_date).format("MMMM Do, YYYY"),
                    },
                  ]}
                  dataSource={installmentPreview}
                  rowKey={(record, index) => index}
                  pagination={false}
                  bordered
                />
              </>
            )}
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default MerchantPlanManagement;
