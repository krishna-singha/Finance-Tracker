import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import { expenseAtom } from '../../store/expenseAtom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExpensesGraph = () => {
    const user = useRecoilValue(userAtom);
    const [expense, setExpense] = useState([]);
    const [expenseData, setExpenseData] = useRecoilState(expenseAtom);

    // Fetch expense data
    useEffect(() => {
        const getExpenseData = async () => {
            try {
                if (user?.uid) {
                    const { data } = await axios.post(`${BACKEND_URL}/v1/api/getData/expense`, {
                        "_id": user.uid,
                    });
                    setExpense(data);
                }
            } catch (error) {
                console.error('Failed to fetch income data:', error);
            }
        };

        getExpenseData();
    }, [user]);

    // Process data
    const processedData = useMemo(() => {
        const dateMap = new Map();

        expense.forEach(({ date, amount }) => {
            if (date) {
                dateMap.set(date, (dateMap.get(date) || 0) + amount);
            }
        });

        return Array.from(dateMap, ([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [expense]);

    // Total expense
    const totalExpense = useMemo(() => processedData.reduce((acc, { amount }) => acc + amount, 0), [processedData]);

    // Update recoil state
    useEffect(() => {
        setExpenseData(processedData);
    }, [processedData, setExpenseData]);

    // Chart options
    const chartOptions = useMemo(() => {
        const dates = processedData.map(({ date }) => date);
        const amounts = processedData.map(({ amount }) => amount);

        return {
            backgroundColor: '#181C3A',
            tooltip: { show: false },
            legend: { show: false },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { show: true, color: '#FFFFFF' },
                axisLine: { show: true, lineStyle: { color: '#FFFFFF' } },
                axisTick: { show: false },
                splitLine: { show: false },
            },
            yAxis: {
                type: 'value',
                axisLabel: { show: false },
                axisLine: { show: false },
                splitLine: { show: false },
                axisTick: { show: false },
            },
            series: [
                {
                    name: 'Values',
                    type: 'line',
                    data: amounts,
                    smooth: true,
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                            { offset: 0, color: '#FF6347' }, // Tomato red
                            { offset: 1, color: '#FF4500' }, // Orange red
                        ]),
                        width: 3,
                    },
                    itemStyle: {
                        color: '#FF6347', // Tomato red
                        borderColor: '#FF4500', // Orange red
                        borderWidth: 3,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 99, 71, 0.4)' }, // Light tomato red
                            { offset: 1, color: 'rgba(255, 69, 0, 0.1)' }, // Very light orange red
                        ]),
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#FF6347', // Tomato red
                            borderColor: '#FF4500', // Orange red
                            borderWidth: 3,
                        },
                    },
                    animationDuration: 2000,
                },
            ],
        };
    }, [processedData]);


    return (
        <div className='rounded-xl px-4 py-4 bg-[#181C3A]'>
            <div className='text-white'>
                <h2 className='font-bold'>Expense</h2>
                <span className='font-semibold text-[#FF6347]'><FaIndianRupeeSign className='inline-block' />{totalExpense}</span>
            </div>
            <div className='h-[6rem]'>
                <ReactEcharts option={chartOptions} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default ExpensesGraph;
