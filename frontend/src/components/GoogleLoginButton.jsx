import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const initializeGoogle = () => {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_CLIENT_ID,
            callback: (response) => {
              loginWithGoogle(response.credential);
            },
          });

          const parent = document.getElementById("google-login");
          if (parent) {
            window.google.accounts.id.renderButton(parent, {
              theme: "outline",
              size: "large",
              text: "continue_with",
              width: "250",
            });
          }
        }
      } catch (err) {
        console.error("Google Login failed to initialize:", err);
      }
    };

    // If script already loaded, initialize immediately
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      // Poll until google is available (as script is loaded async)
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loginWithGoogle]);

  return <div id="google-login"></div>;
}
