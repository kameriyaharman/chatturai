import { Link } from 'react-router-dom';
import { Lines } from '../components/Chrome2';

const Mail = () => <a href="mailto:contact@chatturai.com">contact@chatturai.com</a>;

function LegalHead({ title, intro }) {
  return (
    <header className="phero">
      <div className="shell">
        <Lines as="h1" lines={title} style={{ fontSize: 'clamp(64px,9vw,150px)' }} />
        <div className="phero-row">
          <p data-r="">{intro}</p>
          <span className="updated" data-r="" style={{ '--i': 1 }}>Last updated 9 August 2026</span>
        </div>
      </div>
    </header>
  );
}

export function Privacy() {
  return (
    <>
      <LegalHead
        title={['Privacy', 'policy']}
        intro="Chatturai Productions Private Limited respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you visit our website, interact with our ads, or engage our services."
      />
      <section className="shell">
        <div className="doc2" data-r="fade">
          <h2>1. Information we collect</h2>
          <p>We may collect the following types of information.</p>
          <ul>
            <li><span className="strong">Information you provide voluntarily.</span> When you fill out a contact form on our website or submit your details through LinkedIn Lead Generation forms, we collect personal details such as your full name, job title, company name, email address, and phone number.</li>
            <li><span className="strong">Automated information.</span> When you browse our website, we may automatically collect non-personal data such as IP addresses, browser types, and usage data via cookies to improve user experience.</li>
          </ul>
          <h2>2. How we use your information</h2>
          <p>Chatturai uses the collected data strictly for the following business purposes.</p>
          <ul>
            <li>To respond to your inquiries and provide information about our cinematic AI video production services.</li>
            <li>To follow up on meeting requests or consultations booked via our ads.</li>
            <li>To send relevant professional updates, portfolios, or marketing communications, which you can opt out of at any time.</li>
            <li>To improve our advertising campaigns and website performance.</li>
          </ul>
          <h2>3. Data sharing and disclosure</h2>
          <p>We do not sell, rent, or trade your personal information to third parties. We may share your data only in the following circumstances.</p>
          <ul>
            <li><span className="strong">Service providers.</span> With trusted third-party platforms, such as CRM software or email marketing tools, that assist us in operating our business and strictly adhere to data protection laws.</li>
            <li><span className="strong">Legal requirements.</span> If required to do so by law or in response to valid requests by public authorities.</li>
          </ul>
          <h2>4. Data security</h2>
          <p>We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet is one hundred percent secure.</p>
          <h2>5. Your data rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you.</li>
            <li>Request corrections to any inaccurate or incomplete data.</li>
            <li>Request the deletion of your personal data from our systems.</li>
            <li>Opt out of any future marketing communications by clicking the unsubscribe link in our emails or contacting us directly.</li>
          </ul>
          <h2>6. Contact</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please contact us at <Mail />.</p>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  return (
    <>
      <LegalHead
        title={['Terms and', 'conditions']}
        intro="Welcome to Chatturai Productions Private Limited. These Terms govern your use of our website, our services, and our SMS and messaging communications. By using our website, engaging our services, or opting in to receive messages from us, you agree to these Terms."
      />
      <section className="shell">
        <div className="doc2" data-r="fade">
          <h2>1. About us</h2>
          <p>Chatturai is an AI-first film studio that produces cinematic, emotional brand films and marketing videos for businesses. We provide creative production services to clients worldwide.</p>
          <h2>2. Use of our website</h2>
          <p>You agree to use our website for lawful purposes only. You may not use our website in any way that could damage, disable, or impair the site, or interfere with any other party's use of it. All content on this website, including text, graphics, videos, and branding, is the property of Chatturai and may not be copied or reused without our written permission.</p>
          <h2>3. SMS and messaging program terms</h2>
          <p>The following terms apply specifically to our SMS and messaging communications, in line with carrier and industry requirements.</p>
          <p className="strong">Chatturai (Chatturai Productions Private Limited)</p>
          <ol>
            <li>By opting in, you agree to receive SMS or messaging communications from Chatturai related to your inquiry, consultation, booking, project updates, and information about the services you have requested. These are business and service-related messages only. Consent to receive messages is not a condition of purchasing any goods or services.</li>
            <li>You can cancel the SMS service at any time. Just text STOP to the number you are communicating with. After you send the SMS message STOP to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.</li>
            <li>If you are experiencing issues with the messaging program, you can reply with the keyword HELP for more assistance, or you can get help directly at <Mail />.</li>
            <li>Carriers are not liable for delayed or undelivered messages.</li>
            <li>As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency may vary based on your interaction with us. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.</li>
            <li>If you have any questions regarding privacy, please read our <Link to="/privacy-policy">Privacy Policy</Link>.</li>
          </ol>
          <p>We do not sell, rent, or share your phone number or SMS or messaging data with third parties for their own marketing purposes.</p>
          <h2>4. Services and engagements</h2>
          <p>Any project or service engagement with Chatturai is governed by the specific agreement, proposal, or invoice provided to you at the time of engagement. These Terms are general and do not replace any signed service agreement between you and Chatturai.</p>
          <h2>5. Intellectual property</h2>
          <p>All work produced by Chatturai remains our property until full payment is received, after which ownership of the final deliverables transfers to the client as set out in the applicable service agreement. Chatturai may retain the right to display completed work in its portfolio and marketing, unless otherwise agreed in writing.</p>
          <h2>6. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, Chatturai shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website, services, or messaging communications. Our total liability for any claim shall not exceed the amount paid by you for the specific service giving rise to the claim.</p>
          <h2>7. Changes to these terms</h2>
          <p>We may update these Terms from time to time. Any changes will be posted on this page with an updated "Last updated" date. Your continued use of our website or services after changes are posted constitutes your acceptance of the revised Terms.</p>
          <h2>8. Contact</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us at <Mail />.</p>
        </div>
      </section>
    </>
  );
}
