import type { User } from "@supabase/supabase-js";
import { LegalDocumentPage } from "../components/LegalDocumentPage";

type Props = {
  user: User | null;
  onSignIn: () => void;
  configured: boolean;
};

export function TermsView({ user, onSignIn, configured }: Props) {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      canonicalPath="/terms"
      metaDescription="Terms governing use of the Tenure Trail website and application."
      user={user}
      onSignIn={onSignIn}
      configured={configured}
    >
      <section className="legal-doc-section">
        <h2>Agreement</h2>
        <p>
          These Terms of Service (“Terms”) govern your access to and use of Tenure Trail at{" "}
          <strong>tenuretrail.com</strong> and related services (the “Service”). By creating an
          account or using the Service, you agree to these Terms.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>The Service</h2>
        <p>
          Tenure Trail provides tools to record career-related notes (such as weekly wins and
          metrics) and to export or generate text for your own use (for example in reviews or
          interviews). We may change, suspend, or discontinue features with reasonable notice
          where practicable.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Accounts</h2>
        <p>
          You must provide accurate information and keep your sign-in secure. You are responsible
          for activity under your account. We may suspend or terminate accounts that violate these
          Terms or harm the Service or other users.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Your content</h2>
        <p>
          You retain ownership of content you submit. You grant us a limited license to host,
          store, process, and display your content only as needed to run the Service for you. You
          represent that you have the rights to any content you submit.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service unlawfully or to harass, harm, or mislead others.</li>
          <li>Attempt to access accounts or systems you are not authorized to use.</li>
          <li>Overload, disrupt, or probe the Service in ways that impair security or availability.</li>
          <li>Upload malware or content that infringes others’ rights.</li>
        </ul>
      </section>

      <section className="legal-doc-section">
        <h2>Disclaimers</h2>
        <p>
          The Service is provided <strong>“as is”</strong> without warranties of any kind,
          express or implied. Tenure Trail is an{" "}
          <strong>educational and organizational tool</strong>. It is{" "}
          <strong>not</strong> legal, financial, HR, or career advice. You are responsible for how
          you use exported material and for decisions you make in employment or job searches.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Tenure Trail and its operators will not be
          liable for indirect, incidental, special, consequential, or punitive damages, or for
          lost profits, data, or goodwill. Our total liability for any claim arising from these
          Terms or the Service is limited to the greater of (a) amounts you paid us for the Service
          in the twelve months before the claim or (b) fifty U.S. dollars, except where limited by
          law.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Indemnity</h2>
        <p>
          You will defend and indemnify us against claims arising from your content, your use of
          the Service, or your violation of these Terms, to the extent permitted by law.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Termination</h2>
        <p>
          You may stop using the Service at any time. We may suspend or end access if you breach
          these Terms or if we reasonably need to protect the Service or users. Provisions that by
          their nature should survive (including disclaimers, limitations, and indemnity) survive
          termination.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Governing law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which the Service operator
          is established, without regard to conflict-of-law rules. You agree to the courts in that
          jurisdiction for disputes, unless applicable law requires otherwise.
        </p>
        <p className="legal-doc-note">
          Replace the paragraph above with state/country and venue clauses after your lawyer
          reviews them.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Changes</h2>
        <p>
          We may update these Terms. We will post the new version on this page and update the “Last
          updated” date. Your continued use after the effective date constitutes acceptance. If
          changes are material, we will try to provide reasonable notice.
        </p>
      </section>

      <section className="legal-doc-section">
        <h2>Contact</h2>
        <p>
          For questions about these Terms, replace this text with your support email or contact
          process (for example <strong>legal@tenuretrail.com</strong>).
        </p>
      </section>
    </LegalDocumentPage>
  );
}
