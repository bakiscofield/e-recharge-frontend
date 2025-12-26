import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support - AliceBot',
  description: 'Get help and support for AliceBot PWA',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Support & Help Center
          </h1>

          <p className="text-gray-600 mb-8">
            Need help with AliceBot? We're here to assist you. Find answers to common questions
            or contact our support team.
          </p>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">Email Support</h2>
              </div>
              <p className="text-gray-600 mb-3">
                Get help via email. We typically respond within 24 hours.
              </p>
              <a
                href="mailto:support@alicebot.online"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@alicebot.online
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
              </div>
              <p className="text-gray-600 mb-3">
                Find quick answers to frequently asked questions.
              </p>
              <a
                href="#faq"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse FAQ →
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {/* Getting Started */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Getting Started
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    How do I install AliceBot as a PWA?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    <strong>Desktop:</strong> When you visit AliceBot, you'll see an install icon
                    in your browser's address bar. Click it to install.<br />
                    <strong>Mobile (Android):</strong> Tap the menu (⋮) and select "Add to Home screen" or "Install app".<br />
                    <strong>iOS:</strong> Tap the Share button and select "Add to Home Screen".
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    How do I create an account?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Click on "Sign Up" or "Register" on the home page. Enter your email,
                    username, and password. Verify your email address to activate your account.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Is AliceBot free to use?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, AliceBot is free to use. We may introduce premium features in the future,
                    but core functionality will always remain free.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Features & Functionality
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Can I use AliceBot offline?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! AliceBot works offline thanks to our Service Worker. You can view your
                    transaction history and add new transactions even without an internet connection.
                    Changes will sync automatically when you're back online.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    How do I add a deposit or withdrawal?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Navigate to the "Deposits" or "Withdrawals" section. Click the "Add" button (+),
                    fill in the details (amount, bookmaker, date), and save. Your transaction will
                    be added to your history.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Can I manage multiple bookmaker accounts?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, AliceBot supports multiple bookmaker accounts. You can track deposits and
                    withdrawals for each bookmaker separately and view combined statistics.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    How do notifications work?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    AliceBot can send push notifications for important updates like transaction
                    confirmations. You'll be asked to grant notification permission when you first
                    use the app. You can manage this in your browser or device settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Account & Security */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account & Security
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    How do I reset my password?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Click "Forgot Password" on the login page. Enter your email address and we'll
                    send you a password reset link. Follow the link to create a new password.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Is my data secure?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes. We use industry-standard encryption (HTTPS/TLS) for all data transmission.
                    Passwords are hashed, and we never store sensitive information in plain text.
                    See our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> for details.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Can I delete my account?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes. Go to Settings → Account → Delete Account. This will permanently remove
                    all your data from our servers. This action cannot be undone.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Can I export my data?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes. Go to Settings → Data → Export Data. You can download your transaction
                    history and account information in CSV or JSON format.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Issues */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Technical Issues & Troubleshooting
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    The app is not loading properly
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Try these steps:<br />
                    1. Refresh the page (Ctrl+R or Cmd+R)<br />
                    2. Clear your browser cache<br />
                    3. Check your internet connection<br />
                    4. Try using a different browser<br />
                    If the problem persists, contact support.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    My data is not syncing
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Ensure you have an active internet connection. AliceBot syncs automatically
                    when online. If you made changes offline, they'll sync when you reconnect.
                    Check the sync status icon in the app.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    How do I update the app?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    AliceBot updates automatically! When a new version is available, you'll see
                    a notification. Simply refresh the page to apply the update. The Service
                    Worker handles caching and updates seamlessly.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Notifications are not working
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Check that you've granted notification permission in your browser/device settings.
                    Go to Settings → Notifications in AliceBot to manage notification preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* Compatibility */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compatibility & Requirements
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    What browsers are supported?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    AliceBot works best on modern browsers:<br />
                    • Chrome 90+ (Desktop & Android)<br />
                    • Firefox 88+<br />
                    • Safari 14+ (Desktop & iOS)<br />
                    • Edge 90+<br />
                    • Opera 76+
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Does AliceBot work on mobile?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! AliceBot is fully responsive and works great on mobile devices (iOS and Android).
                    Install it as a PWA for the best mobile experience.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Can I use AliceBot on Windows/Mac/Linux?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, AliceBot works on all desktop operating systems. You can also install it
                    from the Microsoft Store (Windows) or use it directly in your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report a Bug */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Report a Bug or Issue
          </h2>
          <p className="text-gray-600 mb-4">
            Found a bug? We appreciate your help in making AliceBot better!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3">
              When reporting a bug, please include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>What you were trying to do</li>
              <li>What happened (error message, unexpected behavior)</li>
              <li>Your browser and operating system</li>
              <li>Steps to reproduce the issue</li>
              <li>Screenshots if applicable</li>
            </ul>
            <div className="mt-4">
              <a
                href="mailto:support@alicebot.online?subject=Bug Report"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Report a Bug
              </a>
            </div>
          </div>
        </div>

        {/* Feature Request */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Request a Feature
          </h2>
          <p className="text-gray-600 mb-4">
            Have an idea for a new feature? We'd love to hear your suggestions!
          </p>
          <a
            href="mailto:support@alicebot.online?subject=Feature Request"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Suggest a Feature
          </a>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/privacy"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Privacy Policy</h3>
                <p className="text-sm text-gray-600">How we protect your data</p>
              </div>
            </a>

            <a
              href="/terms"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Terms of Service</h3>
                <p className="text-sm text-gray-600">Our terms and conditions</p>
              </div>
            </a>
          </div>
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
