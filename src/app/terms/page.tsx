import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AliceBot',
  description: 'Terms of Service and Conditions for using AliceBot PWA',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using AliceBot ("the Service"), you accept and agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
              please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Description of Service
            </h2>
            <p className="leading-relaxed mb-2">
              AliceBot is a Progressive Web Application (PWA) that provides:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Management of bookmaker deposits and withdrawals</li>
              <li>Transaction history tracking</li>
              <li>Multi-bookmaker account support</li>
              <li>Offline functionality</li>
              <li>Push notifications for updates</li>
              <li>Data synchronization across devices</li>
            </ul>
            <p className="leading-relaxed mt-3">
              The Service is provided "as is" and may be modified, suspended, or discontinued
              at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. User Accounts and Registration
            </h2>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">3.1 Account Creation</h3>
              <p className="leading-relaxed">
                To use certain features of AliceBot, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4">3.2 Age Requirement</h3>
              <p className="leading-relaxed">
                You must be at least 18 years old to use AliceBot. By using the Service,
                you represent that you meet this age requirement.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">3.3 Account Termination</h3>
              <p className="leading-relaxed">
                We reserve the right to terminate or suspend your account at any time for
                violations of these Terms or for any other reason, with or without notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. User Conduct and Responsibilities
            </h2>
            <p className="leading-relaxed mb-2">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload or transmit viruses, malware, or malicious code</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest information from other users</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Intellectual Property Rights
            </h2>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">5.1 Our Rights</h3>
              <p className="leading-relaxed">
                All content, features, and functionality of AliceBot (including but not limited
                to software, text, graphics, logos, icons, and code) are owned by us or our
                licensors and are protected by copyright, trademark, and other intellectual
                property laws.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">5.2 Your Rights</h3>
              <p className="leading-relaxed">
                You retain ownership of the data you input into AliceBot. By using the Service,
                you grant us a limited license to use, store, and process your data solely for
                the purpose of providing the Service.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">5.3 License to Use</h3>
              <p className="leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to use AliceBot
                for personal, non-commercial purposes, subject to these Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Data and Privacy
            </h2>
            <p className="leading-relaxed">
              Your use of AliceBot is also governed by our Privacy Policy. Please review our
              <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a> to
              understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Disclaimers and Limitations of Liability
            </h2>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">7.1 No Warranty</h3>
              <p className="leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">7.2 No Financial Advice</h3>
              <p className="leading-relaxed">
                AliceBot is a transaction management tool only. We do not provide financial,
                investment, or gambling advice. Any decisions you make based on information in
                the Service are your sole responsibility.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">7.3 Limitation of Liability</h3>
              <p className="leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
                REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">7.4 Third-Party Services</h3>
              <p className="leading-relaxed">
                AliceBot may integrate with third-party bookmaker services. We are not responsible
                for the availability, accuracy, or content of such third-party services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Indemnification
            </h2>
            <p className="leading-relaxed">
              You agree to indemnify, defend, and hold harmless AliceBot, its officers, directors,
              employees, and agents from and against any claims, liabilities, damages, losses, and
              expenses arising out of or in any way connected with your use of the Service or
              violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Modifications to Service and Terms
            </h2>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">9.1 Service Changes</h3>
              <p className="leading-relaxed">
                We reserve the right to modify or discontinue the Service (or any part thereof)
                at any time, with or without notice. We shall not be liable to you or any third
                party for any modification, suspension, or discontinuation of the Service.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">9.2 Terms Changes</h3>
              <p className="leading-relaxed">
                We may revise these Terms from time to time. The most current version will always
                be posted on this page. By continuing to use the Service after revisions become
                effective, you agree to be bound by the revised Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Governing Law and Dispute Resolution
            </h2>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">10.1 Governing Law</h3>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of
                France, without regard to its conflict of law provisions.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">10.2 Dispute Resolution</h3>
              <p className="leading-relaxed">
                Any disputes arising out of or relating to these Terms or the Service shall first
                be attempted to be resolved through good faith negotiations. If negotiations fail,
                disputes shall be resolved through binding arbitration or in the courts of France.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Severability
            </h2>
            <p className="leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that
              provision shall be limited or eliminated to the minimum extent necessary, and the
              remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              12. Entire Agreement
            </h2>
            <p className="leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement
              between you and AliceBot regarding the use of the Service and supersede all prior
              agreements and understandings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              13. Contact Information
            </h2>
            <p className="leading-relaxed mb-2">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="mt-3 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:support@alicebot.online" className="text-blue-600 hover:underline">support@alicebot.online</a></p>
              <p><strong>Website:</strong> <a href="https://front-alice.alicebot.online" className="text-blue-600 hover:underline">https://front-alice.alicebot.online</a></p>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              14. Specific Provisions for App Stores
            </h2>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">14.1 Google Play Store</h3>
              <p className="leading-relaxed">
                If you download AliceBot from Google Play Store, you agree that Google is not
                responsible for the Service and has no obligations with respect to it.
              </p>

              <h3 className="font-medium text-gray-800 mt-4">14.2 Microsoft Store</h3>
              <p className="leading-relaxed">
                If you download AliceBot from Microsoft Store, you agree that Microsoft is not
                responsible for the Service and has no obligations with respect to it.
              </p>
            </div>
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
