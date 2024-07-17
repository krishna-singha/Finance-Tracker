import { FaIndianRupeeSign } from "react-icons/fa6";

const Home = () => {
    return (
        <section className="py-10">
            <div className="max-w-[1380px] mx-auto">
                <div className="grid grid-flow-col grid-cols-4 gap-8">
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="font-[600] text-xl mb-4">Current Balance</h2>
                        <p><FaIndianRupeeSign className="inline-block" /> 1000</p>
                        <button className="bg-blue-600 text-white w-full py-2 mt-6 rounded-md">Reset Balance</button>
                    </div>
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="font-[600] text-xl mb-4">Total Income</h2>
                        <p><FaIndianRupeeSign className="inline-block" /> 1000</p>
                        <button className="bg-blue-600 text-white w-full py-2 mt-6 rounded-md">Add Income</button>
                    </div>
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="font-[600] text-xl mb-4">Total Savings</h2>
                        <p><FaIndianRupeeSign className="inline-block" /> 500</p>
                        <button className="bg-blue-600 text-white w-full py-2 mt-6 rounded-md">Add Savings</button>
                    </div>
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="font-[600] text-xl mb-4">Total Expenses</h2>
                        <p><FaIndianRupeeSign className="inline-block" /> 1000</p>
                        <button className="bg-blue-600 text-white w-full py-2 mt-6 rounded-md">Reset Expenses</button>
                    </div>
                </div>
                <div className="mt-6 flex gap-6">
                    <div className="w-[60%] h-[35rem] bg-white rounded-md">

                    </div>
                    <div className="bg-white h-[35rem] w-[40%] rounded-md">

                    </div>
                </div>
                <div className="mt-6 flex gap-6 justify-between">
                    <div className="w-full">
                        <input type="search" placeholder="Search by Name" className="px-4 py-2 w-full rounded-md" />
                    </div>
                    <div>
                        <select name="sort" id="sort">
                            <option value="all">All</option>
                            <option value="Income">Income</option>
                            <option value="Expenses">Expenses</option>
                            <option value="Savings">Savings</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home;