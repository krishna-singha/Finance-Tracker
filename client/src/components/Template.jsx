import { Outlet } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import CurrentDate from "./currentDate/CurrentDate";
import Profile from "./profile/Profile";

const Template = () => {

    const isCompatible = useMediaQuery({ maxWidth: 1500 });

    return (
        <>
            {isCompatible ? (
                <div className="bg-primary text-white text-center py-2 min-h-screen flex justify-center items-center">
                    <p>Window size is not compatible <br /> Use your Laptop!</p>
                </div>
            ) : (
                <>
                    <header className="bg-primary sticky top-0 z-[999]">
                        <div className="max-w-[1550px] mx-auto py-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-white text-xl">Personal Finance Tracker</h1>
                            </div>
                            <Navbar />
                            <CurrentDate />
                            <Profile />
                        </div>
                    </header>

                    <main className="min-h-screen">
                        <Outlet />
                    </main>
                    <footer className="border-t border-[#ffe1ff47]">
                        <Footer />
                    </footer>
                </>
            )}
        </>
    )
}

export default Template;