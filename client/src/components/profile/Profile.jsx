import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../../store/userAtom";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../auth/firebase";

const Profile = () => {

    const [user, setUser] = useRecoilState(userAtom);
    const [showProfile, setShowProfile] = useState(false);

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
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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