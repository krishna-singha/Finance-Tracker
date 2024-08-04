import AvailableBalance from "../components/AvailableBalance";
import TotalExpenses from "../components/TotalExpenses";
import TotalSavings from "../components/TotalSavings";
import TotalIncome from "../components/TotalIncome";
import CustomPieChart from "../components/CustomPieChart";
import LineChart from "../components/LineChart";
// import LastFiveTransection from "../components/LastFiveTransection"
import Profile from "../components/profile/Profile";
import IncomeGraph from "../components/income/IncomeGraph";
import ExpensesGraph from "../components/expenses/ExpensesGraph";
import TopThreeStocks from "../components/stocks/Stocks";
import AddData from "../components/addData/AddData";
import Suggesions from "../components/suggesions/Suggestions";

const Home = () => {

    return (
        <section className="py-10">
            <div className="max-w-[1550px] mx-auto">
                <div className="flex gap-6 justify-between">
                    <div>
                        <div className="flex gap-6">
                            <div>
                                <div className="h-fit mb-6">
                                    <AvailableBalance />
                                </div>
                                <div>
                                    <AddData />
                                </div>
                            </div>
                            <div className="">
                                <div className="w-[15rem] mb-6">
                                    <IncomeGraph />
                                </div>
                                <div className="w-[15rem]">
                                    <ExpensesGraph />
                                </div>
                            </div>
                            <div className="w-[22rem]">
                                <TopThreeStocks />
                            </div>
                        </div>
                        <div className="w-full mt-6">
                            <LineChart />
                        </div>
                    </div>
                    <div className="w-[32rem]">
                        <div className=" mb-6">
                            <Suggesions />
                        </div>
                        <div>
                            <CustomPieChart />
                        </div>
                    </div>
                </div>

                {/* <div className="grid grid-cols-4 gap-8">
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
                </div> */}
                <div className="mt-6 flex gap-6">
                    {/* <div className="w-[40%] bg-[#181C3A] rounded-md flex juce' items-center">
                        <div className="w-full">
                            <LineChart />
                        </div>
                    </div> */}
                    {/* <div className="bg-[#181C3A] h-[35rem] w-[40%] rounded-md flex items-center">
                        <div className="w-full">
                            
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    )
}

export default Home;