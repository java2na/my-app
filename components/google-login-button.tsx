"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function GoogleLoginButton({ next }: { next?: string } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const callbackUrl = next
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg className="size-4" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v9h11.8c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.08C42.45 37.08 45.12 31.3 45.12 24.5z"
          />
          <path
            fill="#34A853"
            d="M24 46c6.3 0 11.58-2.08 15.45-5.64l-7.08-5.52c-2.15 1.44-4.92 2.3-8.37 2.3-6.44 0-11.9-4.34-13.86-10.19H2.78v5.72C6.6 41.1 14.62 46 24 46z"
          />
          <path
            fill="#FBBC05"
            d="M10.14 26.95c-.49-1.44-.77-2.97-.77-4.56s.28-3.12.77-4.56v-5.72H2.78C1.02 15.52 0 19.11 0 23.39s1.02 7.87 2.78 11.28z"
          />
          <path
            fill="#EA4335"
            d="M24 10.75c3.48 0 6.6 1.2 9.06 3.55l6.3-6.3C35.57 4.09 30.3 2 24 2 14.62 2 6.6 6.9 2.78 14.11l7.36 5.72C12.1 15.09 17.56 10.75 24 10.75z"
          />
        </svg>
        {isLoading ? "이동 중..." : "Google로 계속하기"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
}
