import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AliceBot',
  description: 'Privacy Policy and Data Protection for AliceBot PWA',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p className="leading-relaxed">
              AliceBot ("we", "our", or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information
              when you use our Progressive Web Application (PWA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Information We Collect
            </h2>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">2.1 Personal Information</h3>
              <p className="leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Email address and username for account creation</li>
                <li>Transaction history (deposits and withdrawals)</li>
                <li>Bookmaker account information</li>
                <li>Profile preferences and settings</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4">2.2 Automatically Collected Information</h3>
              <p className="leading-relaxed">
                When you use AliceBot, we automatically collect:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (features used, time spent)</li>
                <li>Log data (IP address, access times)</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4">2.3 Local Storage</h3>
              <p className="leading-relaxed">
                Our PWA uses browser local storage and IndexedDB to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Enable offline functionality</li>
                <li>Cache data for faster performance</li>
                <li>Store user preferences</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <p className="leading-relaxed mb-2">
              We use the collected information for:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Providing and maintaining the AliceBot service</li>
              <li>Processing your transactions and managing your account</li>
              <li>Sending important notifications and updates</li>
              <li>Improving our application and user experience</li>
              <li>Analyzing usage patterns to enhance features</li>
              <li>Ensuring security and preventing fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Data Storage and Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>All data transmission is encrypted using HTTPS/TLS</li>
              <li>Passwords are hashed using secure algorithms</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal information</li>
            </ul>
            <p className="leading-relaxed mt-3">
              <strong>Data Location:</strong> Your data is stored on secure servers
              and may be backed up locally on your device for offline access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Data Sharing and Disclosure
            </h2>
            <p className="leading-relaxed mb-2">
              We do not sell, trade, or rent your personal information. We may share
              your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>With your consent:</strong> When you explicitly authorize us</li>
              <li><strong>Legal requirements:</strong> When required by law or legal process</li>
              <li><strong>Service providers:</strong> With trusted partners who help operate our service (under strict confidentiality agreements)</li>
              <li><strong>Business transfers:</strong> In the event of a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Your Rights and Choices
            </h2>
            <p className="leading-relaxed mb-2">
              You have the following rights regarding your data:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from notifications</li>
            </ul>
            <p className="leading-relaxed mt-3">
              To exercise these rights, contact us at: <a href="mailto:support@alicebot.online" className="text-blue-600 hover:underline">support@alicebot.online</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Cookies and Tracking
            </h2>
            <p className="leading-relaxed">
              AliceBot uses:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Essential cookies:</strong> Required for authentication and basic functionality</li>
              <li><strong>Service Worker:</strong> Enables offline functionality and caching</li>
              <li><strong>Local Storage:</strong> Stores preferences and cached data</li>
            </ul>
            <p className="leading-relaxed mt-3">
              We do not use third-party tracking cookies or analytics without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Children's Privacy
            </h2>
            <p className="leading-relaxed">
              AliceBot is not intended for users under 18 years of age. We do not
              knowingly collect personal information from children. If you believe we
              have collected information from a minor, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. International Data Transfers
            </h2>
            <p className="leading-relaxed">
              Your information may be transferred to and processed in countries other
              than your country of residence. We ensure that such transfers comply with
              applicable data protection laws and implement appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes by posting the new policy on this page and updating the
              "Last updated" date. Your continued use of AliceBot after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-3 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:support@alicebot.online" className="text-blue-600 hover:underline">support@alicebot.online</a></p>
              <p><strong>Website:</strong> <a href="https://front-alice.alicebot.online" className="text-blue-600 hover:underline">https://front-alice.alicebot.online</a></p>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              GDPR Compliance (EU Users)
            </h2>
            <p className="leading-relaxed mb-2">
              For users in the European Union, we comply with the General Data Protection
              Regulation (GDPR). This includes:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Legal basis for processing (consent, contract, legitimate interest)</li>
              <li>Right to data portability</li>
              <li>Right to be forgotten</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Notification of data breaches within 72 hours</li>
            </ul>
            <p className="leading-relaxed mt-3">
              To file a complaint with a supervisory authority, contact your local data protection authority.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to AliceBot
          </a>
        </div>
      </div>
    </div>
  );
}
