import React from "react";
import { Button, Modal, Form, Input, DatePicker } from "antd";

const AddExpense = ({ isExpenseModalVisible, handleExpenseCancel, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add Expense"
      open={isExpenseModalVisible} // Controlled by parent component
      onCancel={handleExpenseCancel} // Pass close handler
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense"); // Call the onFinish handler passed from Expenses
          form.resetFields(); // Reset form fields after submission
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name of the transaction" }]}
        >
          <Input type="text" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter the expense amount" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the expense date" }]}
        >
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExpense;
