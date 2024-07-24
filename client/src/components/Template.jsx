import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Template = () => {
    return (
        <>
            <header className="bg-primary border-b border-[#ffe1ff47] sticky top-0">
                <Navbar />
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