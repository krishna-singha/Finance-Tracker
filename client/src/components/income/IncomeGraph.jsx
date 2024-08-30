import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useRecoilValue, useRecoilState } from "recoil";
import { userAtom } from "../../store/userAtom";
import { incomeAtom } from '../../store/incomeAtom';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { BACKEND_URL } from "../../config";

const IncomeGraph = () => {
    const user = useRecoilValue(userAtom);
    const [incomes, setIncomes] = useState([]);
    const [incomeData, setIncomeData] = useRecoilState(incomeAtom);

    // Fetch income data
    useEffect(() => {
        const getIncomeData = async () => {
            try {
                if (user?.uid) {
                    const { data } = await axios.post(`${BACKEND_URL}/v1/api/getData/income`, {
                        "_id": user.uid,
                    });
                    setIncomes(data);
                }
            } catch (error) {
                console.error('Failed to fetch income data:', error);
            }
        };

        getIncomeData();
    }, [user, setIncomes]);

    // Process data
    const processedData = useMemo(() => {
        const dateMap = new Map();

        incomes.forEach(({ date, amount }) => {
            if (date) {
                dateMap.set(date, (dateMap.get(date) || 0) + amount);
            }
        });

        return Array.from(dateMap, ([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [incomes]);

    // Total income
    const totalIncome = useMemo(() => processedData.reduce((acc, { amount }) => acc + amount, 0), [processedData]);

    // Update recoil state
    useEffect(() => {
        setIncomeData(processedData);
    }, [processedData, setIncomeData]);

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
                            { offset: 0, color: '#00FF00' }, // Bright green
                            { offset: 1, color: '#00FF7F' }, // Light green
                        ]),
                        width: 3,
                    },
                    itemStyle: {
                        color: '#00FF00', // Bright green
                        borderColor: '#00FF7F', // Light green
                        borderWidth: 3,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0, 255, 0, 0.4)' }, // Light green
                            { offset: 1, color: 'rgba(0, 255, 127, 0.1)' }, // Very light green
                        ]),
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#00FF00', // Bright green
                            borderColor: '#00FF7F', // Light green
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
                <h2 className='font-bold'>Income</h2>
                <span className='font-semibold text-[#00FF00]'><FaIndianRupeeSign className='inline-block' />{totalIncome}</span>
            </div>
            <div className='h-[6rem]'>
                <ReactEcharts option={chartOptions} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default IncomeGraph;
