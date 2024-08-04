import React from 'react';
import ReactEcharts from 'echarts-for-react';

const StylishPieChart = ({ data }) => {
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
    <div style={{ backgroundColor: '#181C3A', padding: '20px', borderRadius: '10px' }}>
      <ReactEcharts option={getOption()} style={{ height: 400, width: '100%' }} />
    </div>
  );
};

export default StylishPieChart;
