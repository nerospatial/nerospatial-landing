import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <div className="mb-16">
          <Link 
            href="/"
            className="inline-block mb-8 text-sm text-white/40 hover:text-white transition-colors duration-300 uppercase tracking-widest font-mono"
          >
            ← Return to Base
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">Privacy Policy</h1>
          <p className="text-white/60 text-lg font-light">Last updated: November 19, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-neutral-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">1. Introduction</h2>
            <p>
              Welcome to NeroSpatial ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">2. Information We Collect</h2>
            <p className="mb-4">
              We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60">
              <li>Personal Data: Name, email address, contact information.</li>
              <li>Usage Data: IP address, browser type, device information.</li>
              <li>Spatial Data: Interaction data within our spatial environments (if applicable).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">4. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, and Vital Interests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">6. Contact Us</h2>
            <p>
              If you have questions or comments about this notice, you may email us at legal@nerospatial.com or by post to:
            </p>
            <address className="mt-4 not-italic text-white/60">
              NeroSpatial Inc.<br />
              123 Spatial Way<br />
              San Francisco, CA 94105<br />
              United States
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
