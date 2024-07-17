import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/userAtom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { isLoggedInAtom } from "../store/isLoggedInAtom";

const Navbar = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    uid: firebaseUser.uid,
                });
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, [setUser, setIsLoggedIn]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="max-w-[1380px] mx-auto flex justify-between items-center text-white h-16">
            <div>
                <NavLink to={"/"} className="font-[600] text-xl">Financly</NavLink>
            </div>
            <div className="flex gap-4 items-center">
                {user ? (
                    <>
                        <div className="cursor-pointer p-1 rounded-full bg-white">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="profile" className="rounded-full w-[2.3rem] h-[2.3rem]" />
                            ) : (
                                <div className="w-[2.3rem] h-[2.3rem] flex justify-center items-center">
                                    <span className="text-black text-3xl font-[500]">
                                        {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'} {/* Default to 'U' if no name */}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <span onClick={handleLogout} className="font-bold cursor-pointer font-mono">Logout</span>
                        </div>
                    </>
                ) : (
                    <div>
                        <NavLink to={"/signin"} className="font-[500] cursor-pointer">Login</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
