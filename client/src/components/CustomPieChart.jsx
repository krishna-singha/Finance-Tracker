import React from 'react';
import ReactEcharts from 'echarts-for-react';

const StylishPieChart = () => {
  const data = [
    { name: 'Shopings', value: 400 },
    { name: 'Grocery', value: 300 },
    { name: 'Travels', value: 1700 },
    { name: 'Books', value: 3300 },
    { name: 'Stocks', value: 4000 },
];

  const getOption = () => {
    const processedData = data.map(item => ({
      value: item.value,
      name: item.name,
    }));

    return {
      backgroundColor: '#181C3A',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        textStyle: {
          color: 'white',
        },
      },
      series: [
        {
          name: 'Categories',
          type: 'pie',
          radius: '50%',
          data: processedData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#0A0F27',
            borderWidth: 2,
          },
        },
      ],
    };
  };

  return (
    <div className='p-4 bg-[#181C3A] rounded-xl'>
      <div>
        <h1 className='text-white'>Expenses</h1>
      </div>
      <div className='h-[25rem]'>
        <ReactEcharts option={getOption()} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default StylishPieChart;
