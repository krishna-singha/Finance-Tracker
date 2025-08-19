import { NavLink } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const SigninPage = () => {
  return (
    <div className="w-full mx-auto max-w-md flex-1 flex flex-col justify-center py-8 px-3">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your account to continue</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50">
        <AuthForm type="login" />

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <NavLink
              to="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign up here
            </NavLink>
          </p>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-gray-500 text-sm">
          💰 Track unlimited
          transactions
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
