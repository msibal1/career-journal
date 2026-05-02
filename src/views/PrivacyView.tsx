import type { User } from "@supabase/supabase-js";
import { LegalDocumentPage } from "../components/LegalDocumentPage";

type Props = {
  user: User | null;
  onSignIn: () => void;
  configured: boolean;
};

export function PrivacyView({ user, onSignIn, configured }: Props) {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      canonicalPath="/privacy"
      metaDescription="How Tenure Trail collects, uses, and stores information when you use the service."
      user={user}
      onSignIn={onSignIn}
      configured={configured}
    >
      <section className="legal-doc-section">
        <h2>Overview</h2>
        <p>
          Tenure Trail (“we,” “us”) operates the website and application at{" "}
          <strong>tenuretrail.com</strong> (the “Service”). This policy describes how we handle
          personal information when you use the Service. By using it, you agree to this policy.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account information.</strong> Email address and authentication data when you
            sign in with a magic link (provided through our authentication provider).
          </li>
          <li>
            <strong>Journal content.</strong> Information you enter (weekly wins, metrics, notes,
            tags, projects, and similar fields) stored with your account.
          </li>
          <li>
            <strong>Technical data.</strong> Basic device and connection information that browsers
            and hosting services typically log (for example IP address, timestamps, and error logs)
            as needed to operate and secure the Service.
          </li>
        </ul>
      </section>

      <section className="legal-doc-section">
        <h2>How we use information</h2>
        <ul>
          <li>To provide, maintain, and improve the Service.</li>
          <li>To authenticate you and sync your journal across devices.</li>
          <li>To respond to support requests when you contact us.</li>
          <li>To detect abuse, fraud, or technical problems.</li>
          <li>To comply with applicable law.</li>
        </ul>
      </section>

      <section className="legal-doc-section">
        <h2>Where data is processed</h2>
        <p>
          The Service uses infrastructure providers (including database and authentication services)
          that may process data in the United States or other regions where they operate. By using
          the Service, you understand that your information may be transferred and processed in
          those locations.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Retention and deletion</h2>
        <p>
          We keep your account and journal data while your account is active. You may delete
          content or your account through features we provide where available; if you need help,
          contact us using the address below. Some information may remain in backups for a limited
          period before being overwritten.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Your choices</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, export, or delete
          personal information, or to object to certain processing. To exercise those rights,
          contact us as described below. We may need to verify your request.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Children</h2>
        <p>
          The Service is not directed at children under 13 (or the minimum age in your
          jurisdiction). We do not knowingly collect personal information from children.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. We will post the revised version on this
          page and update the “Last updated” date. Continued use of the Service after changes means
          you accept the updated policy.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Contact</h2>
        <p>
          Questions about this Privacy Policy: replace this paragraph with your preferred contact
          (for example <strong>privacy@tenuretrail.com</strong> or a contact form). Until then,
          reach the operator through whatever contact method you publish on{" "}
          <strong>tenuretrail.com</strong>.
        </p>
      </section>
    </LegalDocumentPage>
  );
}
