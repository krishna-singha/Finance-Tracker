import { useState } from "react";
import { FaWallet, FaUser, FaSignOutAlt, FaBars, FaTimes, FaHome, FaChartLine, FaMoneyBill, FaPiggyBank, FaBullseye, FaListAlt, FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    // { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/expenses", label: "Expenses", icon: <FaMoneyBill /> },
    { to: "/incomes", label: "Incomes", icon: <FaChartLine /> },
    { to: "/budgets", label: "Budgets", icon: <FaPiggyBank /> },
    { to: "/goals", label: "Goals", icon: <FaBullseye /> },
    { to: "/all-transactions", label: "All Transactions", icon: <FaListAlt /> },
    { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
    // { to: "/profile", label: "Profile", icon: <FaUserCircle /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <FaWallet className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">Finance Tracker</span>
          </NavLink>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* User Info & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Info - Desktop */}
                <NavLink to={"/profile"} className="hidden md:flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-2 cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    {/* <p className="text-gray-400 text-xs">{user.email}</p> */}
                  </div>
                </NavLink>

                {/* Logout Button - Desktop */}
                {/* <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <FaSignOutAlt />
                  <span className="hidden lg:block">Logout</span>
                </button> */}

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/signin"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile User Info */}
              <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors mt-4"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
