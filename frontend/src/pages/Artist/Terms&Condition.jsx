import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Terms and Conditions for Artists</h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* Introduction */}
            <section>
              <p className="mb-4">
                Welcome to our platform. These Terms and Conditions govern your use of our services as an artist. By registering and using our platform, you agree to be bound by these terms. Please read them carefully as they contain important information about your rights and obligations.
              </p>
            </section>

            {/* Service Provision */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Provision</h2>
              <p className="mb-4">
                As a registered artist on our platform, you agree to provide professional makeup and beauty services to clients in accordance with the highest industry standards. Your commitment to excellence is fundamental to our platform's success and client satisfaction. You acknowledge that the services you provide must align with your expertise, qualifications, and the descriptions provided in your service listings. We expect you to maintain consistent quality across all client interactions and to uphold the professional standards that our platform represents.
              </p>
              <p className="mb-4">
                The scope of services you offer must be clearly defined and accurately represented in your profile. Any limitations, prerequisites, or special requirements must be explicitly communicated to clients before service confirmation. We emphasize the importance of transparency in service delivery to ensure client expectations are properly managed and met.
              </p>
            </section>

            {/* Booking and Appointments */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking and Appointments</h2>
              <p className="mb-4">
                Our booking system is designed to facilitate seamless interactions between artists and clients. When a booking is confirmed through our platform, it constitutes a binding agreement between you and the client. We expect you to honor all confirmed appointments with the utmost professionalism and punctuality. The success of our platform relies heavily on reliable service delivery and mutual respect for scheduled commitments.
              </p>
              <p className="mb-4">
                In the event that a cancellation becomes necessary, we require you to provide adequate notice through our platform's communication channels. This allows clients to make alternative arrangements and maintains the professional standards we strive to uphold. Repeated cancellations or pattern of unreliability may result in review of your account status and potential corrective actions to maintain service quality standards.
              </p>
            </section>

            {/* Pricing and Financial Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pricing and Financial Terms</h2>
              <p className="mb-4">
                Our platform operates on a transparent pricing model where you have the autonomy to set your service rates. This flexibility allows you to value your services appropriately based on your expertise, market conditions, and service complexity. However, all financial transactions must be processed through our secure payment system to ensure protection for both artists and clients.
              </p>
              <p className="mb-4">
                Platform fees are an integral part of our operational model and contribute to maintaining and improving our services. These fees are automatically calculated and deducted from each transaction in accordance with our current fee structure. We maintain the right to adjust fee structures with appropriate notice to all platform participants. Regular payments are processed according to our established schedule, ensuring reliable and predictable income flow for our artists.
              </p>
            </section>

            {/* Professional Standards and Ethics */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Standards and Ethics</h2>
              <p className="mb-4">
                Maintaining high professional standards is paramount to our platform's reputation and success. We expect all artists to adhere to strict ethical guidelines in their client interactions. This includes maintaining appropriate professional boundaries, respecting client privacy, and ensuring confidentiality of client information. Your conduct should always reflect the professional nature of our platform and contribute to a positive, trust-based environment.
              </p>
              <p className="mb-4">
                Quality assurance extends beyond service delivery to encompass all aspects of client interaction. This includes maintaining clean and hygienic working conditions, using professional-grade products and tools, and staying current with industry trends and techniques. Regular training and skill updates are encouraged to ensure service quality remains competitive and relevant.
              </p>
            </section>

            {/* Account Management and Compliance */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Management and Compliance</h2>
              <p className="mb-4">
                Your account on our platform represents your professional identity and must be maintained with accuracy and attention to detail. Regular updates to your profile, service descriptions, and availability calendar are essential for effective platform operation. Prompt and professional responses to client inquiries and booking requests are expected as part of your account management responsibilities.
              </p>
              <p className="mb-4">
                Compliance with platform policies, local regulations, and industry standards is mandatory. This includes maintaining any required licenses, certifications, or permits relevant to your services. Failure to maintain compliance may result in account suspension or termination. We reserve the right to request verification of credentials or conduct periodic reviews to ensure ongoing compliance.
              </p>
            </section>

            {/* Termination and Amendments */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Termination and Amendments</h2>
              <p className="mb-4">
                While we value our relationship with each artist, we maintain the right to suspend or terminate accounts that violate our terms or consistently fail to meet our standards. Account termination may be initiated by either party with appropriate notice, subject to the completion of any outstanding obligations or bookings. We strive to handle all terminations professionally and fairly, with consideration for both artist and client interests.
              </p>
              <p className="mb-4">
                These terms and conditions may be updated periodically to reflect changes in our services, legal requirements, or operational needs. We will provide notice of significant changes and maintain an archive of previous versions for reference. Continued use of our platform following any modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Last Updated */}
            <div className="pt-8 text-sm text-gray-500 border-t border-gray-200">
              <p>Last Updated: February 20, 2025</p>
              <p className="mt-2">
                By continuing to use our platform, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 