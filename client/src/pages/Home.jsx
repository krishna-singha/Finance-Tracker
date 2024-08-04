import AvailableBalance from "../components/AvailableBalance";
import TotalExpenses from "../components/TotalExpenses";
import TotalSavings from "../components/TotalSavings";
import TotalIncome from "../components/TotalIncome";
import CustomPieChart from "../components/CustomPieChart";
import LineChart from "../components/LineChart";
// import LastFiveTransection from "../components/LastFiveTransection"

const Home = () => {

    const data = [
        { name: 'Category A', value: 400 },
        { name: 'Category B', value: 300 },
        { name: 'Category C', value: 300 },
        { name: 'Category D', value: 200 },
    ];

    const lineData = [
        { name: 'Jan', value: 40 },
        { name: 'Feb', value: 30 },
        { name: 'Mar', value: 35 },
        { name: 'Apr', value: 50 },
        { name: 'May', value: 55 },
        { name: 'Jun', value: 60 },
        { name: 'Jul', value: 5}
    ];

    return (
        <section className="py-10">
            <div className="max-w-[1380px] mx-auto">
                <div className="grid grid-cols-4 gap-8">
                    <div>
                        <AvailableBalance />
                    </div>
                    <div>
                        <TotalIncome />
                    </div>
                    <div>
                        <TotalSavings />
                    </div>
                    <div>
                        <TotalExpenses />
                    </div>
                </div>
                <div className="mt-6 flex gap-6">
                    <div className="w-[60%] h-[35rem] bg-[#181C3A] rounded-md flex juce' items-center">
                        <div className="w-full">
                            <LineChart data={lineData} />
                        </div>
                    </div>
                    <div className="bg-[#181C3A] h-[35rem] w-[40%] rounded-md flex items-center">
                        <div className="w-full">
                            <CustomPieChart data={data} />
                        </div>
                    </div>
                </div>
                {/* <div>
                    <LastFiveTransection />
                </div> */}
                {/* <div className="mt-6 flex gap-6 justify-between">
                    <div className="w-full">
                        <input type="search" placeholder="Search by Name" className="px-4 py-2 w-full rounded-md bg-[#181C3A]" />
                    </div>
                    <div>
                        <select name="sort" id="sort" className="bg-[#181C3A]">
                            <option value="all">All</option>
                            <option value="Income">Income</option>
                            <option value="Expenses">Expenses</option>
                            <option value="Savings">Savings</option>
                        </select>
                    </div>
                </div> */}
            </div>
        </section>
    )
}

export default Home;