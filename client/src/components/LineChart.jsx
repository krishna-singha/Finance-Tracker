import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const LineChart = () => {
  const totalData = [
    { name: '01 Jan 24', value: 40 },
    { name: '02 Jan 24', value: 30 },
    { name: '03 Jan 24', value: 20 },
    { name: '04 Jan 24', value: 100 },
    { name: '05 Jan 24', value: 40 },
  ];

  const incomeData = [
    { name: '01 Jan 24', value: 20 },
    { name: '02 Jan 24', value: 15 },
    { name: '03 Jan 24', value: 25 },
    { name: '04 Jan 24', value: 35 },
    { name: '05 Jan 24', value: 20 },
  ];

  const expensesData = [
    { name: '01 Jan 24', value: 10 },
    { name: '02 Jan 24', value: 55 },
    { name: '03 Jan 24', value: 15 },
    { name: '04 Jan 24', value: 25 },
    { name: '05 Jan 24', value: 10 },
  ];

  const getOption = () => {
    const names = totalData.map(item => item.name);

    const totalValues = totalData.map(item => item.value);
    const incomeValues = incomeData.map(item => item.value);
    const expensesValues = expensesData.map(item => item.value);

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
        data: names,
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
          animationDuration: 2000,
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
          animationDuration: 2000,
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
          animationDuration: 2000,
        },
      ],
    };
  };

  return (
    <div className='h-[30rem] pt-6 bg-[#181C3A] rounded-xl'>
      <ReactEcharts option={getOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default LineChart;
