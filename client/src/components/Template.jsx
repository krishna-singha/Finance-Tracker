import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import CurrentDate from "./currentDate/CurrentDate";
import Profile from "./profile/Profile";

const Template = () => {
    return (
        <>
            {/* <header className="bg-primary border-b border-[#ffe1ff47] sticky top-0">
                <Navbar />
            </header> */}
            <header className="bg-primary sticky top-0">
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
    )
}

export default Template;