import { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useRecoilValue } from 'recoil';
import { incomeAtom } from '../store/incomeAtom';
import { expenseAtom } from '../store/expenseAtom';

const LineChart = () => {
  const incomeData = useRecoilValue(incomeAtom);
  const expenseData = useRecoilValue(expenseAtom);

  console.log('Income Data:', incomeData);
  console.log('Expenses Data:', expenseData);

  // Calculate total amounts by summing income and expenses
  const totalData = incomeData.map((item, index) => {
    return {
      date: item.date,
      amount: item.amount + (expenseData[index]?.amount || 0),
    };
  });

  // Calculate total slopes (if needed)
  // const calculateTotalSlopes = (data) => {
  //   let slopes = [];
  //   for (let i = 1; i < data.length; i++) {
  //     const slope = data[i].amount - data[i - 1].amount;
  //     slopes.push(slope);
  //   }
  //   return slopes;
  // };

  // const totalSlopes = calculateTotalSlopes(totalData);

  const getOption = () => {
    const dates = totalData.map(item => item.date);

    const totalValues = totalData.map(item => item.amount);
    const incomeValues = incomeData.map(item => item.amount);
    const expensesValues = expenseData.map(item => item.amount);

    return {
      backgroundColor: '#181C3A',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        formatter: (params) => {
          let tooltipText = `<div style="color: white;">${params[0].name}</div>`;
          params.forEach(param => {
            tooltipText += `<div style="color: white;">${param.seriesName}: ${param.value}</div>`;
          });
          return tooltipText;
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Make tooltip background semi-transparent
      },
      legend: {
        data: ['Total', 'Income', 'Expenses'],
        textStyle: {
          color: 'white',
          fontSize: 14,
        },
        itemWidth: 20,
        itemHeight: 10,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: '#FFFFFF',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#FFFFFF',
            width: 2,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#FFFFFF',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#FFFFFF',
            width: 2,
          },
        },
        splitLine: {
          lineStyle: {
            color: '#383838',
            width: 1,
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: 'Total',
          type: 'line',
          data: totalValues,
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
          animationDuration: 4000,
        },
        {
          name: 'Income',
          type: 'line',
          data: incomeValues,
          smooth: true,
          lineStyle: {
            color: '#FF6347',
            width: 3,
          },
          itemStyle: {
            color: '#FF6347',
            borderColor: '#FF6347',
            borderWidth: 3,
          },
          areaStyle: {
            color: 'rgba(255, 99, 71, 0.2)',
          },
          emphasis: {
            itemStyle: {
              color: '#FF6347',
              borderColor: '#FF6347',
              borderWidth: 3,
            },
          },
          animationDuration: 4000,
        },
        {
          name: 'Expenses',
          type: 'line',
          data: expensesValues,
          smooth: true,
          lineStyle: {
            color: '#FFD700',
            width: 3,
          },
          itemStyle: {
            color: '#FFD700',
            borderColor: '#FFD700',
            borderWidth: 3,
          },
          areaStyle: {
            color: 'rgba(255, 215, 0, 0.2)',
          },
          emphasis: {
            itemStyle: {
              color: '#FFD700',
              borderColor: '#FFD700',
              borderWidth: 3,
            },
          },
          animationDuration: 4000,
        },
      ],
    };
  };

  return (
    <div className='h-[30rem] py-8 bg-[#181C3A] rounded-xl'>
      <ReactEcharts option={getOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default LineChart;
