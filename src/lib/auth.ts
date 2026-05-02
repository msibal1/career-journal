import { useEffect, useState, useCallback } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "./supabase";

function friendlyAuthError(error: AuthError): Error {
  const msg = error.message ?? "";
  const rateLimited =
    error.status === 429 ||
    /rate limit|too many|security purposes.*only request|over_email_send/i.test(
      msg
    );

  if (rateLimited) {
    return new Error(
      "Email sign-in is temporarily limited (too many magic links were requested). " +
        "Wait about an hour and try once, or ask the operator to connect a custom email provider in Supabase (SMTP) for higher limits and better deliverability."
    );
  }

  return new Error(msg || "Sign-in failed. Please try again.");
}

export type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setState({ session: null, user: null, loading: false });
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!supabase) {
      throw new Error(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then rebuild."
      );
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw friendlyAuthError(error);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return { ...state, sendMagicLink, signOut };
}
