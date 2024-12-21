import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AboutApp.css';

const AboutApp = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Header Section */}
      <header className="about-header">
        <div className="overlay">
          <h1 className="main-title">Welcome to Expense Tracker</h1>
          <p className="subtitle">Your ultimate financial management solution.</p>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
  <h2 className="section-title">Why Choose Expense Tracker?</h2>
  <p className="section-description">
    Manage your finances like a pro with these amazing features:
  </p>
  <ul className="features-list">
    <li>Manage your finances with ease by recording and tracking daily expenses and incomes, analyzing spending trends through real-time insights, setting financial goals to stay on budget effortlessly, receiving timely reminders for bill payments and deadlines, and ensuring your data is secure and encrypted to protect your privacy.
    </li>
    {/* <li>Analyze your spending trends with real-time insights.</li> */}
    {/* <li>Set financial goals and stay on budget effortlessly.</li> */}
    {/* <li>Get reminders for bill payments and deadlines.</li> */}
    {/* <li>Secure and encrypted data to protect your privacy.</li> */}
  </ul>

  {/* FAQ Section */}
  <div className="faq-section">
    <h3 className="faq-title">Frequently Asked Questions</h3>
    <div className="faq-item">
      <p className="faq-question">Q1: Is my financial data safe?</p>
      <p className="faq-answer">
        Yes, your data is fully encrypted and stored securely. We prioritize your privacy and ensure it’s never shared.
      </p>
    </div>
    <div className="faq-item">
      <p className="faq-question">Q2: Can I customize my budget?</p>
      <p className="faq-answer">
        Absolutely! You can set personalized budgets for different categories and track your progress.
      </p>
    </div>
    <div className="faq-item">
      <p className="faq-question">Q3: Are there mobile apps available?</p>
      <p className="faq-answer">
        Yes, Expense Tracker is available on both Android and iOS platforms, making it easy to track finances on the go.
      </p>
    </div>
    <div className="faq-item">
      <p className="faq-question">Q4: How can I track overdue payments?</p>
      <p className="faq-answer">
        The app sends timely reminders for bills and deadlines to ensure you never miss a payment.
      </p>
    </div>
  </div>
</section>


      {/* Call-to-Action */}
      <div className="cta-section">
        <button
          className="cta-button"
          onClick={() => navigate('/Dashboard')}
        >
          Explore Dashboard
        </button>
      </div>
    </div>
  );
};

export default AboutApp;
