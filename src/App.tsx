import { useState } from "react";
import { useAuth } from "./lib/auth";
import { Landing } from "./views/Landing";
import { JournalApp } from "./views/JournalApp";
import { AuthModal } from "./components/AuthModal";
import { supabaseConfigured } from "./lib/supabase";

export default function App() {
  const auth = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (auth.loading) {
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

  if (!auth.user) {
    return (
      <>
        <Landing
          configured={supabaseConfigured}
          onGetStarted={() => setAuthOpen(true)}
        />
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onSubmit={auth.sendMagicLink}
        />
      </>
    );
  }

  return <JournalApp user={auth.user} signOut={auth.signOut} />;
}
