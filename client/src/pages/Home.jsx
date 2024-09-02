import AvailableBalance from "../components/AvailableBalance";
import ExpensesPieChart from "../components/chart/ExpensesPieChart";
import LineChart from "../components/chart/LineChart";
import IncomeGraph from "../components/income/IncomeGraph";
import ExpensesGraph from "../components/expenses/ExpensesGraph";
import TopThreeStocks from "../components/stocks/Stocks";
import AddData from "../components/addData/AddData";
import GeminiAI from "../components/geminiAI/GeminiAI";

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
                                <div className="w-[15rem]">
                                    <button onClick={() => {
                                        window.location.reload();
                                    }}
                                        className='text-xl text-white bg-[#252839] py-4 rounded-xl w-full'>
                                        Sync Now
                                    </button>
                                </div>
                                <div className="w-[15rem] my-6">
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
                            <GeminiAI />
                        </div>
                        <div>
                            <ExpensesPieChart />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home;