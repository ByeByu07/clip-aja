import React from 'react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-12">
      <div className="mx-auto max-w-3xl bg-white shadow-md rounded-2xl p-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using this application, you accept and agree to be bound by these Terms of Service.
            This is a <strong>hackathon/demo project</strong> and is not intended for commercial use.
            If you do not agree to these terms, please do not use this service.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">2. Description of Service</h2>
          <p className="text-gray-700">
            This application provides video content management and social media integration services.
            The service integrates with third-party platforms to enhance your experience.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">3. Third-Party Integrations</h2>
          <p className="text-gray-700">
            This application integrates with the following third-party services and requests specific permissions:
          </p>

          <div className="ml-4 mt-3">
            <h3 className="font-medium text-gray-800">TikTok Integration</h3>
            <p className="text-gray-700 mt-2">We request the following TikTok permissions:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-2">
              <li><strong>user.info.profile</strong> - To access your TikTok profile information</li>
              <li><strong>video.list</strong> - To retrieve and display your video list</li>
              <li><strong>user.info.basic</strong> - To access your basic user information</li>
              <li><strong>user.info.stats</strong> - To access your TikTok stats</li>
            </ul>
          </div>

          <div className="ml-4 mt-4">
            <h3 className="font-medium text-gray-800">Google Integration</h3>
            <p className="text-gray-700 mt-2">We request the following Google permissions:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-2">
              <li><strong>Email</strong> - To identify your account</li>
              <li><strong>Name</strong> - To personalize your experience</li>
              <li><strong>Profile Photo</strong> - To display your profile picture</li>
            </ul>
          </div>

          <p className="text-gray-700 mt-4">
            By connecting your accounts, you authorize us to access this information in accordance with our Privacy Policy.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">4. User Responsibilities</h2>
          <p className="text-gray-700">You agree to:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Provide accurate and current information when using the service.</li>
            <li>Maintain the security of your account credentials.</li>
            <li>Not use the service for any illegal or unauthorized purpose.</li>
            <li>Not attempt to gain unauthorized access to any part of the service.</li>
            <li>Comply with all applicable laws and regulations when using the service.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">5. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, features, and functionality of this service are owned by the project creators and are protected
            by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the service
            without explicit permission.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">6. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            This service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without any warranties
            of any kind, either express or implied. As a hackathon/demo project, we do not guarantee that the service will
            be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the maximum extent permitted by law, the creators of this project shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">8. Data Usage and Privacy</h2>
          <p className="text-gray-700">
            Your use of this service is also governed by our Privacy Policy. We collect and use data as described in the
            Privacy Policy. By using this service, you consent to such collection and use.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">9. Account Termination</h2>
          <p className="text-gray-700">
            We reserve the right to terminate or suspend your access to the service at any time, without prior notice,
            for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">10. Modifications to Service and Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify or discontinue the service at any time without notice. We may also update these
            Terms of Service from time to time. The updated date at the top of this page will reflect the latest changes.
            Your continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">11. Contact Information</h2>
          <p className="text-gray-700">
            For questions or concerns about these Terms of Service, please contact: <strong>hello@bayu-ai.dev</strong>
          </p>
        </section>

        <footer className="mt-8 border-t pt-6 text-sm text-gray-500">
          <p>
            <strong>Note:</strong> These terms of service are provided as a template for hackathon/demo use.
            This is not legal advice. For production or commercial deployment, consult with a legal professional
            to ensure compliance with applicable laws and regulations.
          </p>
        </footer>
      </div>
    </main>
  );
}
