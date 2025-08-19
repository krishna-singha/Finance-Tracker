import { NavLink } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  return (
    <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-8 px-3">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400">Join thousands managing their finances</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
        <AuthForm type="signup" />

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <NavLink
              to="/signin"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in here
            </NavLink>
          </p>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-gray-500 text-sm">
          ✨ Free forever • 🚀 Instant setup
        </p>
      </div>
    </div>
  );
}
