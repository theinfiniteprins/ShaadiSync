import React, { useEffect } from 'react';

export default function Privacy() {
  // Add scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Information Collection",
      content: `We collect various types of information to provide and improve our services. Personal information includes: full name, email address, phone number, postal address, and profile pictures. Wedding-specific information includes: wedding date, venue preferences, guest count, budget details, and style preferences. Account information includes: login credentials, account settings, and usage history. Device and technical information includes: IP address, browser type, operating system, device identifiers, and location data (if permitted). We also collect information about your interactions with vendors, including messages, reviews, and booking history. When you make payments, we collect transaction details while ensuring secure processing through encrypted channels. We may also gather information from third-party sources to verify user identity and prevent fraud. Usage patterns and preferences are collected to personalize your experience and improve our services.`
    },
    {
      title: "2. Data Usage",
      content: `Your information is used to create and maintain your account, personalize your wedding planning experience, and improve our services. We analyze user behavior to enhance platform features and recommend relevant vendors. Your contact information enables important updates about your account, bookings, and platform changes. We use your preferences to customize vendor recommendations and wedding planning suggestions. Transaction data is processed for booking confirmations, refunds, and financial records. Communication history is maintained to provide context for customer support and dispute resolution. Aggregated, anonymized data helps us understand market trends and improve our services. We may use your feedback and reviews to maintain service quality standards. Location data helps provide locally relevant vendor suggestions. Usage patterns inform our platform development and feature priorities.`
    },
    {
      title: "3. Data Security",
      content: `We implement comprehensive security measures to protect your information. All data transmission is encrypted using industry-standard SSL/TLS protocols. We maintain strict access controls and authentication procedures for our systems. Regular security audits and vulnerability assessments are conducted. Employee access to user data is limited and monitored. We use secure cloud infrastructure with redundant backups. Vendor access to user information is restricted to necessary interactions. Payment information is processed through PCI-compliant systems. We implement multi-factor authentication for sensitive operations. Security incident response procedures are regularly updated and tested. While we implement strong security measures, no method of internet transmission is 100% secure. We promptly notify users of any security breaches as required by law.`
    },
    {
      title: "4. Data Sharing",
      content: `We share your information with vendors only when necessary for service delivery and with your explicit consent. Trusted service providers may access data to help operate our platform, including payment processors, cloud storage providers, and analytics services. These providers are contractually obligated to maintain confidentiality. We may share information to comply with legal obligations or respond to valid legal requests. We never sell your personal information to third parties for marketing purposes. Aggregated, non-identifying information may be shared for business analytics. In case of a merger or acquisition, user data may be transferred as a business asset. We require vendors to maintain appropriate security measures for user data. International data transfers comply with applicable data protection laws. We maintain records of all data sharing activities.`
    },
    {
      title: "5. User Rights",
      content: `You have comprehensive rights regarding your personal information. Access Rights: You can request a copy of all personal data we hold about you. Correction Rights: You can update or correct any inaccurate information in your profile. Deletion Rights: You can request deletion of your account and associated data. Portability Rights: You can request your data in a structured, commonly used format. Opt-out Rights: You can opt out of marketing communications and certain data processing activities. Consent Withdrawal: You can withdraw previously given consent for data processing. Restriction Rights: You can request limited processing of your data in certain circumstances. Objection Rights: You can object to processing based on legitimate interests. These requests will be handled within 30 days. We may retain certain information as required by law.`
    },
    {
      title: "6. Cookie Policy",
      content: `We use cookies and similar technologies to enhance your experience. Essential cookies enable basic platform functionality and security features. Preference cookies remember your settings and choices. Analytics cookies help us understand user behavior and improve our services. Third-party cookies may be used for additional features and integrations. You can control cookie preferences through your browser settings. Session cookies are temporary and expire when you close your browser. Persistent cookies remain until they expire or you delete them. We provide clear notice when cookies are first placed on your device. Cookie consent can be withdrawn at any time. We regularly update our cookie list and purposes.`
    },
    {
      title: "7. Data Retention",
      content: `We retain your information for as long as necessary to provide our services and comply with legal obligations. Active account data is maintained until account deletion is requested. Transaction records are kept for financial and tax compliance purposes. Communication history is retained for customer support and legal requirements. Inactive accounts may be archived after two years of no activity. Backup data is retained for 30 days after deletion. Legal compliance documentation is maintained as required by law. We regularly review and update our retention policies. Personal data is securely deleted when no longer needed. Archived data is stored with enhanced security measures. You can request information about retention periods for specific data types.`
    },
    {
      title: "8. Updates to Privacy Policy",
      content: `We may update this Privacy Policy periodically to reflect changes in our practices. Users will be notified of significant changes via email or platform notifications. The updated policy will be effective upon posting to our website. Continued use of our services after changes constitutes acceptance of updates. Historical versions of the policy are available upon request. We encourage regular review of our privacy policy. Material changes will require renewed consent where necessary. We maintain a change log of policy updates. User feedback is considered when updating our policies. We provide clear summaries of significant changes.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 mt-3">Last updated: March 15, 2024</p>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-lg text-gray-700 leading-relaxed">
          At ShaadiSync, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform. 
          By using ShaadiSync, you agree to the collection and use of information in accordance with this policy.
        </p>
      </div>

      {/* Privacy Sections */}
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
          For any questions about this Privacy Policy, please contact our Data Protection Officer:
          <br />
          <a href="mailto:privacy@shaadisync.com" className="text-pink-600 hover:underline">
            privacy@shaadisync.com
          </a>
        </p>
        <p className="text-gray-500 mt-4">
          © 2024 ShaadiSync - All Rights Reserved
        </p>
      </div>
    </div>
  );
}