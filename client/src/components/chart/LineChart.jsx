import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useRecoilValue } from 'recoil';
import { incomeAtom } from '../../store/incomeAtom';
import { expenseAtom } from '../../store/expenseAtom';

const LineChart = () => {
  const incomeData = useRecoilValue(incomeAtom);
  const expenseData = useRecoilValue(expenseAtom);

  // Function to get all unique dates from income and expense data
  const getAllUniqueDates = (incomeData, expenseData) => {
    const allDates = new Set();
  
    const addDatesFromData = (data) => {
      data.forEach(item => {
        if (item.date) {
          allDates.add(item.date);
        }
      });
    };
  
    addDatesFromData(incomeData);
    addDatesFromData(expenseData);
    return Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
  };

  const allDates = getAllUniqueDates(incomeData, expenseData);

  // Function to get chart options
  const getOption = () => {
    const dates = allDates;
    const incomeValues = allDates.map(date => incomeData.find(item => item.date === date)?.amount || 0);
    const expensesValues = allDates.map(date => expenseData.find(item => item.date === date)?.amount || 0);
  
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      legend: {
        data: ['Income', 'Expenses'],
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
          name: 'Income',
          type: 'line',
          data: incomeValues,
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
          animationDuration: 4000,
        },
        {
          name: 'Expenses',
          type: 'line',
          data: expensesValues,
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