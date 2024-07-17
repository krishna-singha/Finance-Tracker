import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Template = () => {
    return (
        <>
            <header className="bg-blue-600">
                <Navbar />
            </header>
            <main className="min-h-screen">
                <Outlet />
            </main>
            <footer className="border-t border-[#0000006a]">
                <Footer />
            </footer>
        </>
    )
}

export default Template;