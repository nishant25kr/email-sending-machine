import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import GoogleLoginButton from "./components/GoogleLoginButton";

function AppContent() {
  const { user } = useAuth();



  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold mb-4 text-center">
            Login to ReachInbox
          </h1>
          <GoogleLoginButton />

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => user === undefined ? null : window.loginWithDev()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              Dev Login (Bypass Google)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
