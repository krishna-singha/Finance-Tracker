import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { FaIndianRupeeSign } from "react-icons/fa6";


const IncomeGraph = () => {
    const data = [
        { name: '01 Jan 24', value: 40 },
        { name: '02 Jan 24', value: 3000 },
        { name: '02 Jan 24', value: 30 },
        { name: '03 Jan 24', value: 200 },
    ];

    const calculateIncome = () => {
        return data.reduce((acc, item) => acc + item.value, 0);
    };

    const getOption = () => {
        // Extract names and values from data
        const names = data.map(item => item.name);
        const values = data.map(item => item.value);

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
                data: names,
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
                    data: values,
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
        <div className='rounded-xl p-4 bg-[#181C3A]'>
            <div className='text-white'>
                <h2 className='font-bold'>Income</h2>
                <span><FaIndianRupeeSign className='inline-block'/>{calculateIncome()}</span>
            </div>
            <div className='h-[6rem]'>
                <ReactEcharts option={getOption()} style={{height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default IncomeGraph;
