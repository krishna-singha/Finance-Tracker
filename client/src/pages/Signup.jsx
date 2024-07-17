import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../auth/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { isLoggedInAtom } from '../store/isLoggedInAtom';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            setIsLoggedIn(true);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError(null);

        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            setIsLoggedIn(true);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6">Create Account</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        Have an account? &nbsp;
                        <NavLink to="/signin" className="text-blue-600">
                            Sign In
                        </NavLink>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <button
                    onClick={handleGoogleSignUp}
                    className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 mt-4"
                    disabled={loading}
                >
                    {loading ? 'Signing Up...' : 'Sign up with Google'}
                </button>
            </div>
        </div>
    );
};

export default SignupPage;
