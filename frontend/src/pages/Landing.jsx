import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaWallet,
  FaShieldAlt,
  FaRocket,
  FaMobile,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaUsers,
  FaGlobe,
  FaBell,
  FaLock,
  FaBullseye,
  FaMoneyBillWave,
} from "react-icons/fa";

const Landing = () => {
  const features = [
    {
      icon: <FaChartLine className="text-3xl text-blue-500" />,
      title: "Smart Analytics",
      description:
        "Get deep insights into your spending patterns with advanced charts and analytics that help you make informed financial decisions.",
    },
    {
      icon: <FaWallet className="text-3xl text-green-500" />,
      title: "Easy Tracking",
      description:
        "Effortlessly track your income and expenses with our intuitive interface designed for simplicity and efficiency.",
    },
    {
      icon: <FaMobile className="text-3xl text-indigo-500" />,
      title: "Mobile Friendly",
      description: "Access your finances anywhere with our responsive design that works perfectly on all devices.",
    },
    {
      icon: <FaBullseye className="text-3xl text-purple-500" />,
      title: "Goal Setting",
      description: "Set and track your financial goals with progress monitoring and smart recommendations.",
    },
    {
      icon: <FaShieldAlt className="text-3xl text-red-500" />,
      title: "Secure & Private",
      description: "Your financial data is protected with bank-level security and encryption protocols.",
    },
    {
      icon: <FaBell className="text-3xl text-yellow-500" />,
      title: "Smart Alerts",
      description: "Get notified about important financial events, budget limits, and goal achievements.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content:
        "This app transformed how I manage my business finances. The analytics are incredibly helpful for understanding cash flow patterns!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      content:
        "Clean interface, powerful features. Finally found a finance tracker that I actually enjoy using. The goal tracking is fantastic.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Davis",
      role: "Student",
      content:
        "Perfect for tracking my student budget. The savings goals feature keeps me motivated to reach my financial targets!",
      rating: 5,
      avatar: "ED",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "₹500M+", label: "Money Tracked" },
    { number: "95%", label: "User Satisfaction" },
    { number: "50+", label: "Countries" },
  ];

  const pricingFeatures = [
    "Unlimited transactions",
    "Advanced analytics",
    "Goal tracking",
    "Budget management",
    "Export reports",
    "Mobile app access",
    "24/7 support",
    "Data security",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full border border-blue-500/30 mb-8">
              <FaRocket className="mr-2 text-blue-400" />
              <span className="text-blue-400 font-medium">Take control of your financial future</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Take Control of Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                {" "}
                Finances
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The most intuitive and powerful personal finance tracker. Monitor
              your spending, analyze your habits, and achieve your financial
              goals with ease and confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Free Today <FaArrowRight />
              </Link>
              <Link
                to="/signin"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to give you complete control over your
              financial life with insights that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 p-8 rounded-xl hover:bg-slate-800/70 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 group"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who've already taken control of their finances with our powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Your Journey <FaRocket />
            </Link>
            <Link
              to="/signin"
              className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Landing;
