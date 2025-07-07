import { Link } from "react-router-dom";
import {
  FaHeart,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaCode,
  FaWallet,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900/70 backdrop-blur-lg py-8 border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FaWallet className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Finance Tracker
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                title="GitHub"
              >
                <FaGithub />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                title="LinkedIn"
              >
                <FaLinkedin />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                title="Twitter"
              >
                <FaTwitter />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>&copy; 2024 Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by</span>
              <span className="text-white font-medium">Krishna Singha</span>
              <FaCode className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
