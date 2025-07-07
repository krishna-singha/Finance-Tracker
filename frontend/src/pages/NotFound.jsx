import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center">
                    {/* Error Icon */}
                    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                        <FaExclamationTriangle className="text-3xl text-white" />
                    </div>

                    {/* Error Message */}
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-300 mb-8">
                        Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                            <FaArrowLeft />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                            <FaHome />
                            Go Home
                        </button>
                    </div>

                    {/* Additional Help */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                        <p className="text-gray-400 text-sm">
                            Need help? Contact our support team or check our documentation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;