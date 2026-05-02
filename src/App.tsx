import { useState } from "react";
import { useAuth } from "./lib/auth";
import { getMarketingPath } from "./lib/marketingPaths";
import { Landing } from "./views/Landing";
import { BlogView } from "./views/BlogView";
import { PrivacyView } from "./views/PrivacyView";
import { TermsView } from "./views/TermsView";
import { JournalApp } from "./views/JournalApp";
import { AuthModal } from "./components/AuthModal";
import { supabaseConfigured } from "./lib/supabase";

export default function App() {
  const auth = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const marketingPath = getMarketingPath();

  if (auth.loading && !marketingPath) {
    return (
      <div className="app-loading">
        <span className="brand">
          <span className="brand-mark" aria-hidden="true" />
          Tenure Trail
        </span>
        <p className="muted">Loading…</p>
      </div>
    );
  }

  const authModal = (
    <AuthModal
      open={authOpen}
      onClose={() => setAuthOpen(false)}
      onSubmit={auth.sendMagicLink}
    />
  );

  if (marketingPath === "blog") {
    return (
      <>
        <BlogView
          user={auth.user}
          onSignIn={() => setAuthOpen(true)}
          configured={supabaseConfigured}
        />
        {authModal}
      </>
    );
  }

  if (marketingPath === "privacy") {
    return (
      <>
        <PrivacyView
          user={auth.user}
          onSignIn={() => setAuthOpen(true)}
          configured={supabaseConfigured}
        />
        {authModal}
      </>
    );
  }

  if (marketingPath === "terms") {
    return (
      <>
        <TermsView
          user={auth.user}
          onSignIn={() => setAuthOpen(true)}
          configured={supabaseConfigured}
        />
        {authModal}
      </>
    );
  }

  if (!auth.user) {
    return (
      <>
        <Landing
          configured={supabaseConfigured}
          onGetStarted={() => setAuthOpen(true)}
        />
        {authModal}
      </>
    );
  }

  return <JournalApp user={auth.user} signOut={auth.signOut} />;
}
