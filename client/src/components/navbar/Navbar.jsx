import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

const Navbar = () => {

    return (
        <div className="text-white bg-[#181C3A] w-fit p-6 flex gap-8 rounded-xl navbar">
            <NavLink to={"/"} className={`flex items-center gap-2 hover:text-[#09C9C8]`}>
                <MdDashboard />
                Dashboard
            </NavLink>
            <NavLink to={"/all-transactions"} className={"flex items-center gap-2 hover:text-[#09C9C8]"}>
                <GrTransaction />
                All Transaction
            </NavLink>
        </div>
    );
}

export default Navbar;