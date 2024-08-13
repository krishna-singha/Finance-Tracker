import { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../store/userAtom";
import { expenseAtom } from '../../store/expenseAtom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const ExpensesGraph = () => {
    const user = useRecoilValue(userAtom);
    const [expenseData, setExpenseData] = useRecoilState(expenseAtom);

    useEffect(() => {
        const getIncomeData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/v1/api/getData/expenses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: user.uid,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setExpenseData(data);
                }
            } catch (error) {
                console.error('Get income data error:', error);
            }
        };

        if (user) {
            getIncomeData();
        }
    }, [user]);

    const calculateExpenses = () => {
        return expenseData.reduce((acc, item) => acc + item.amount, 0);
    };

    const getOption = () => {
        // Extract dates and amounts from expenseData
        const dates = expenseData.map(item => item.date);
        const amounts = expenseData.map(item => item.amount);

        return {
            backgroundColor: '#181C3A',
            tooltip: {
                show: false, // Hide tooltip
            },
            legend: {
                show: false, // Hide legend
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: {
                    show: false, // Hide x-axis labels
                },
                axisLine: {
                    show: true, // Hide x-axis line
                },
                axisTick: {
                    show: false, // Hide x-axis ticks
                },
                splitLine: {
                    show: false, // Hide x-axis split lines
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: false, // Hide y-axis labels
                },
                axisLine: {
                    show: false, // Hide y-axis line
                },
                splitLine: {
                    show: false, // Hide y-axis split lines
                },
                axisTick: {
                    show: false, // Hide y-axis ticks
                },
            },
            series: [
                {
                    name: 'Values',
                    type: 'line',
                    data: amounts,
                    smooth: true,
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                            { offset: 0, color: '#00C49F' },
                            { offset: 1, color: '#0088FE' },
                        ]),
                        width: 3,
                    },
                    itemStyle: {
                        color: '#00C49F',
                        borderColor: '#00C49F',
                        borderWidth: 3,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0, 196, 159, 0.3)' },
                            { offset: 1, color: 'rgba(0, 136, 254, 0.1)' },
                        ]),
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#FF6F61',
                            borderColor: '#FF6F61',
                            borderWidth: 3,
                        },
                    },
                    animationDuration: 2000,
                },
            ],
        };
    };

    return (
        <div className='rounded-xl px-4 py-8 bg-[#181C3A]'>
            <div className='text-white'>
                <h2 className='font-bold'>Expenses</h2>
                <span><FaIndianRupeeSign className='inline-block'/>{calculateExpenses()}</span>
            </div>
            <div className='h-[6rem]'>
                <ReactEcharts option={getOption()} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default ExpensesGraph;
