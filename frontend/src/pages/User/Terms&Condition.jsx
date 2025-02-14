import React, { useEffect } from 'react';

export default function Terms() {
  // Add scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Acknowledgment and Acceptance",
      content: `By accessing or using ShaadiSync's platform and services, you explicitly acknowledge and agree to be bound by these Terms and Conditions. These terms form a legally binding agreement between you and ShaadiSync Pvt. Ltd. You must be at least 18 years of age to use our services and have the legal capacity to enter into contracts. By creating an account, you confirm that you are of legal age and have the authority to accept these terms. If you do not agree with any part of these terms, you must not use our services. We reserve the right to modify these terms at any time, and your continued use of our services following any changes constitutes your acceptance of the modified terms.`
    },
    {
      title: "2. Services",
      content: `ShaadiSync provides a comprehensive wedding planning platform that connects couples with verified vendors and service providers. Our services include, but are not limited to: vendor discovery and booking, wedding planning tools, budget management, checklist creation, and customer support. We act as a facilitator between couples and vendors, helping streamline the wedding planning process. While we strive to maintain high-quality service standards, we do not guarantee the performance of listed vendors. We continuously update and improve our platform features and reserve the right to modify, suspend, or discontinue any part of our services with reasonable notice. The platform may experience occasional downtime for maintenance or updates. Users acknowledge that third-party services integrated into our platform may have their own terms of service.`
    },
    {
      title: "3. User Registration",
      content: `When registering on ShaadiSync, you must provide accurate, current, and complete information. This includes your full name, valid email address, phone number, and other required details. You are responsible for maintaining the confidentiality of your account credentials and must not share them with third parties. Each user is permitted to maintain only one active account. Any duplicate accounts will be terminated. You must promptly update your information if there are any changes. We reserve the right to suspend or terminate accounts that violate our terms, provide false information, or engage in suspicious activities. Account verification may be required through email, phone, or other means. Users must not impersonate others or misrepresent their affiliation with any person or entity.`
    },
    {
      title: "4. User Obligations",
      content: `Users must comply with all applicable local, state, and national laws while using our platform. You agree to respect intellectual property rights and not infringe upon copyrights, trademarks, or other proprietary rights. Users must maintain appropriate conduct, including respectful communication with vendors and other users. Any unauthorized access attempts or security breaches must be reported immediately. Users are responsible for all activities that occur under their account. Content shared on the platform must be appropriate and relevant to wedding planning. Users must not use the platform for any commercial purposes without our explicit permission. Regular monitoring of account activities and transaction history is recommended. Users should maintain copies of all important communications and transactions.`
    },
    {
      title: "5. Prohibited Activities",
      content: `The following activities are strictly prohibited on our platform: Any form of fraudulent or deceptive behavior, including false reviews or misrepresentation of services. Harassment, abuse, or intimidation of other users, vendors, or staff. Unauthorized data collection, scraping, or mining of platform information. Interference with platform operations through malware, viruses, or other harmful code. Spam, unsolicited advertisements, or promotional materials. Attempts to manipulate platform rankings or reviews. Creating multiple accounts or sharing account access. Using the platform for illegal activities or promoting harmful content. Circumventing platform fees or payment systems. Violating vendors' or other users' privacy. Any activity that disrupts or degrades the platform's performance or user experience.`
    },
    {
      title: "6. Payments and Refunds",
      content: `All payments processed through our platform are secured using industry-standard encryption and security measures. Service fees and charges are clearly displayed before confirmation. Payment options include credit cards, debit cards, UPI, and other approved methods. Refunds are processed according to our refund policy, which varies based on service type and cancellation timing. All charges are inclusive of applicable taxes and platform fees. Vendors set their own pricing, and we act as a payment facilitator. Disputed charges must be reported within 48 hours of the transaction. We maintain detailed transaction records for accountability. Currency conversion fees may apply for international transactions. Payment information is stored securely and in compliance with industry standards.`
    },
    {
      title: "7. Support and Grievances",
      content: `Our customer support team is available 24/7 through multiple channels including email, phone, and chat. All grievances are acknowledged within 24 hours and resolved within 48 hours of reporting. A dedicated grievance officer is assigned to handle serious complaints and escalations. We maintain detailed records of all support interactions and resolutions. Users can track their support tickets through their account dashboard. Emergency support is available for time-sensitive issues. We regularly review feedback to improve our support services. Training and resources are provided to help users maximize platform benefits. Periodic surveys are conducted to assess user satisfaction. We maintain transparency in our grievance handling process and provide regular updates on resolution progress.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Terms and Conditions</h1>
        <p className="text-gray-600 mt-3">Last updated: March 15, 2024</p>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-lg text-gray-700 leading-relaxed">
          This document is an electronic record in accordance with Information Technology Act, 2000 and rules thereunder. 
          Please read these terms carefully before using our services. These terms govern your use of ShaadiSync's platform 
          and services, and by accessing our platform, you agree to be bound by them.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="max-w-5xl mx-auto space-y-12">
        {sections.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}
      </div>

      {/* Contact Information */}
      <div className="max-w-5xl mx-auto text-center mt-16">
        <p className="text-gray-700">
          For any questions regarding these terms, please contact:
          <br />
          <a href="mailto:legal@shaadisync.com" className="text-pink-600 hover:underline">
            legal@shaadisync.com
          </a>
        </p>
        <p className="text-gray-500 mt-4">
          © 2024 ShaadiSync - All Rights Reserved
        </p>
      </div>
    </div>
  );
}
