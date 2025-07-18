import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from 'react-hot-toast';
import { isValidEmail, validatePassword, validateName } from "../utils/form";

export default function AuthForm({ type = "signup" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const isSignup = type === "signup";

  const validateForm = () => {
    const newErrors = {};

    // Name validation for signup
    if (isSignup) {
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.errors[0];
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (isSignup) {
        result = await signup(formData.name, formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result && result.success) {
        toast.success(result.data.message || "Authentication successful!");
        navigate('/dashboard');
      } else {
        toast.error(result?.message || "Authentication failed");
        console.error('Auth failed:', result);
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full p-4 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all";
    const errorClass = errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-slate-600 focus:ring-blue-500";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSignup && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={getInputClassName('name')}
            required
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={getInputClassName('email')}
          required
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password *
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className={getInputClassName('password')}
          required
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password}</p>
        )}
        {isSignup && formData.password && (
          <div className="mt-2">
            <PasswordStrength password={formData.password} />
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          isSignup ? "Create Account" : "Sign In"
        )}
      </button>
    </form>
  );
}

// Password strength indicator component
const PasswordStrength = ({ password }) => {
  const validation = validatePassword(password);
  
  // Calculate strength score based on validation
  const getStrengthScore = () => {
    if (!password) return 0;
    if (validation.isValid) return 4;
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;
    
    return Math.min(score, 4);
  };
  
  const score = getStrengthScore();
  
  const getStrengthText = (score) => {
    switch (score) {
      case 0: return { text: "Very Weak", color: "text-red-500" };
      case 1: return { text: "Weak", color: "text-red-400" };
      case 2: return { text: "Fair", color: "text-yellow-400" };
      case 3: return { text: "Good", color: "text-blue-400" };
      case 4: return { text: "Strong", color: "text-green-400" };
      default: return { text: "Very Weak", color: "text-red-500" };
    }
  };

  const strength = getStrengthText(score);

  return (
    <div className="text-xs space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Strength:</span>
        <span className={strength.color}>{strength.text}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 w-full rounded ${
              level <= score ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      {!validation.isValid && validation.errors.length > 0 && (
        <div className="mt-1">
          <p className="text-red-400 text-xs">Requirements:</p>
          <ul className="text-red-400 text-xs space-y-0.5 ml-2">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="text-red-500">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
