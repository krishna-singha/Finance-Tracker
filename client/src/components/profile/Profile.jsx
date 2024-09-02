import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../../store/userAtom";
import axios from "axios";
import { allTransectionAtom } from "../../store/allTransectionAtom";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../auth/firebase";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {

    const [user, setUser] = useRecoilState(userAtom);
    const [showProfile, setShowProfile] = useState(false);
    const [transactions, setTransactions] = useRecoilState(allTransectionAtom);

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    uid: firebaseUser.uid,
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [setUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const userExist = async () => {
            await fetch(`${BACKEND_URL}/v1/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: user.uid,
                    name: user.name,
                    email: user.email,
                }),
            })
        };
        if (user) {
            userExist();
        }
    }), [user];

    // Fetch all transections
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const data = await axios.post(`${BACKEND_URL}/v1/api/getAllTransactions`, {
                    "_id": user.uid,
                });
                setTransactions(data.data);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        };
        if (user?.uid) {
            getTransactions();
        }
    }, [user, setTransactions]);

    return (
        <div>
            {user ? (
                <div onClick={toggleProfile} className="flex items-center gap-2 w-fit relative hover:bg-[#181C3A] px-3 py-1 rounded-xl cursor-pointer" >
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-white">{user.name}</span>
                        <span className="text-[#ffffffb3]">Student</span>
                    </div>
                    <div className="p-1 rounded-full ">
                        <img src={user.photoURL} alt="profile" className="rounded-full size-[3.5rem]" />
                    </div>
                    {showProfile && (
                        <div className="absolute bottom-[-2.7rem] right-0 bg-[#181C3A] py-2 px-4 rounded-xl">
                            <button onClick={handleLogout} className="text-white">Logout</button>
                        </div>
                    )}
                </div >
            ) : (
                <div onClick={toggleProfile} className="flex items-center gap-2 w-fit relative hover:bg-[#181C3A] px-3 py-1 rounded-xl cursor-pointer" >
                    <div className="cursor-pointer p-1 rounded-full ">
                        <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="User Avatar" className="rounded-full size-[3.5rem]" />
                    </div>
                    {showProfile && (
                        <div className="absolute bottom-[-2.7rem] right-0 bg-[#181C3A] py-2 px-4 rounded-xl">
                            <button onClick={handleLogin} className="text-white">Login</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;