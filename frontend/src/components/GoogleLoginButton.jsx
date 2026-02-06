import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    try {
      /* global google */
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_CLIENT_ID,
          callback: (response) => {
            loginWithGoogle(response.credential);
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login"),
          { theme: "outline", size: "large" }
        );
      }
    } catch (err) {
      console.error("Google Login failed to initialize:", err);
    }
  }, []);

  return <div id="google-login"></div>;
}
