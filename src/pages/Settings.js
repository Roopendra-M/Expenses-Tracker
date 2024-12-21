import React from "react";
import "./styles/Settings.css"; // Import the updated CSS file
import { Card, Switch, Button, Select, Input } from "antd";

const { Option } = Select;

const Settings = () => {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {/* Profile Section */}
      <Card className="settings-card" title="Profile">
        <Input placeholder="Edit Name" className="settings-input" />
        <Button type="primary" className="settings-button">
          Save Changes
        </Button>
      </Card>

      {/* Notifications Section */}
      <Card className="settings-card" title="Notifications">
        <div className="settings-option">
          <p>Enable Transaction Alerts</p>
          <Switch />
        </div>
        <div className="settings-option">
          <p>Enable Weekly Summary Emails</p>
          <Switch />
        </div>
      </Card>

      {/* Preferences */}
      <Card className="settings-card" title="Preferences">
        <div className="settings-option">
          <p>Select Currency</p>
          <Select defaultValue="INR" className="settings-select">
            <Option value="INR">₹ INR</Option>
            <Option value="USD">$ USD</Option>
            <Option value="EUR">€ EUR</Option>
          </Select>
        </div>
        <div className="settings-option">
          <p>Select Language</p>
          <Select defaultValue="English" className="settings-select">
            <Option value="English">English</Option>
            <Option value="Telugu">Telugu</Option>
            <Option value="Hindi">Hindi</Option>
          </Select>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="settings-card" title="Appearance">
        <div className="settings-option">
          <p>Dark Mode</p>
          <Switch />
          {/* <Button type="default" className="small-button">
            Dark Mode
          </Button> */}
        </div>
      </Card>

      {/* Security */}
      <Card className="settings-card" title="Security">
        <div className="settings-option">
          <p>Change Password</p>
          <Button type="default" className="settings-button">
            Change Password
          </Button>
        </div>
        <div className="settings-option">
          <p>Enable Two-Factor Authentication</p>
          <Switch />
          {/* <Button type="default" className="small-button">
            Enable
          </Button> */}
        </div>
      </Card>
    </div>
  );
};

export default Settings;
