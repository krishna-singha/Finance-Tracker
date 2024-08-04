import React from 'react';
import ReactEcharts from 'echarts-for-react';

const LineChart = ({ data }) => {
  const getOption = () => {
    // Extract names and values from data
    const names = data.map(item => item.name);
    const values = data.map(item => item.value);

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
      },
      legend: {
        data: ['Values'],
        textStyle: {
          color: 'white',
        },
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          color: 'white',
        },
        axisLine: {
          lineStyle: {
            color: '#ffffff',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'white',
        },
        axisLine: {
          lineStyle: {
            color: '#ffffff',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#383838',
          },
        },
      },
      series: [
        {
          name: 'Values',
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: {
            color: '#0088FE',
            width: 2,
          },
          itemStyle: {
            color: '#0088FE',
            borderColor: '#0088FE',
            borderWidth: 2,
          },
          areaStyle: {
            color: 'rgba(0, 136, 254, 0.2)',
          },
          emphasis: {
            itemStyle: {
              color: '#00C49F',
            },
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

export default LineChart;
