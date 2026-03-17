import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Privacy and Policy</h1>
          <div className="mt-12 space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
            <p>This privacy policy applies to the website <strong className="text-foreground">MODELMANAGEMENT.MU</strong></p>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">How do we process the information you give us?</h2>
              <p>When you join the MODELMANAGEMENT.MU website, we want you to be informed and confident about how we process your information. We collect them in order to enhance your experience, helping you get the most out of your membership and to connect and collaborate with other professionals in a business-to-business environment. Do not worry: your data is always treated with care and respect and we never share it with third parties.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">What data do we collect? (Applicable only for Models)</h2>
              <p>Name, Email address, Phone Number, Location, Gender, Website or portfolio link, Password (encrypted), Date of birth, Information about transactions, Date registered, recent login, uploaded images, followers, liked/favorites, Ethnicity, nationality, hair and eye colour, height, shoe size, bust, waist, hips, dress size, Languages spoken, Modeling categories and specialties, Preferred locations, Date when you apply to castings or accepted/declined a booking, &quot;About me&quot; free text, Payment information, reviews/comments, Social media links, Uploaded images, ID Number, A selfie of you with it.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">Requirements for photographers, brands, agencies, etc.</h2>
              <p>Name and company name, Email, Location, Gender, Password (encrypted), Date of birth, Transaction information, Date registered, recent login, uploaded images, followers, liked/favorites, &quot;About me&quot;, Phone number, Social media links, Uploaded images.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">Which service providers we share your data with?</h2>
              <p>We partner with various companies to deliver services. For Premium we work with trusted payment providers like MCB. We use MCB to verify identity documents; MCB collects images of ID, facial images, ID numbers, addresses, fraud signals, device information; MCB shares data with us and uses it for fraud detection and services. Links: Google Firebase privacy, Resend privacy, Bunny.net privacy, Mastercard global privacy notice.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">With whom do we share your data?</h2>
              <p>We do not share your data with any third parties without your permission, except when required by law.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">Data retention / Where stored / Legal grounds</h2>
              <p>If you keep being a user we will retain your information. All data is stored on our secure servers in Firebase and Bunny.net. Legal basis: company&apos;s legitimate interests, in accordance with the Data Protection Act 2017.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">What is this data used for?</h2>
              <p>We use the information to understand user activity and enhance our services, personalize experience, share relevant content. We may contact you via email, phone, SMS, WhatsApp, or Facebook Messenger for account updates. For models: notifications about messages, casting invitations, likes, follows, platform updates, promotions, surveys, tips, news. For professionals: pending approval, missing details, reminders to publish/update castings. ModelManagement.mu processes personal data in accordance with the Mauritius Data Protection Act 2017.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">IP addresses and Cookies</h2>
              <p>We keep a brief record of your IP address to protect from spam and security threats. We use cookies to optimize your journey, remember settings, session data, and refine site usage. You can turn off cookies via your browser; this might limit certain features.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">Technical Security Measures</h2>
              <p>We will report data breaches to the relevant data protection authority within 72 hours and notify affected users via email.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">How to manage your personal data?</h2>
              <p>Data is used to give you and other users the best experience. You have the right to edit or erase certain information (may make the site less useful). You have the right to have your account and information erased: contact info@modelmanagement.mu. Email preferences can be changed in Edit my profile; certain important emails may still be sent. You can request to see details of personal information we hold: contact info@modelmanagement.mu; proof of identity may be required; we may charge a fee; requests take up to 30 days.</p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground mb-2">How Do We Update This Privacy Policy?</h2>
              <p>We may update at any time; a notice will be displayed on this page. If you do not agree, you may request deletion of your account and data. Contact: info@modelmanagement.mu.</p>
            </section>
            <section className="bg-card magazine-border p-6">
              <h2 className="font-display text-xl text-foreground mb-2">Contact</h2>
              <p>Contact number: +230 468 6969<br />Email: info@theflashgroups.com<br />Address: Flash Communications Ltd, 2nd Floor, Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
