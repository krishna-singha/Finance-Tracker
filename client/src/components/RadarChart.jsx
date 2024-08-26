import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const RadarChart = () => {
  const getOption = () => {
    return {
      backgroundColor: '#181C3A',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textStyle: {
          color: '#fff',
        },
        formatter: (params) => {
          let tooltipText = `<strong>${params.name}</strong><br/>`;
          params.value.forEach((val, index) => {
            tooltipText += `<div style="color: ${params.color};">${params.marker} ${params.seriesName} ${index + 1}: ${val}</div>`;
          });
          return tooltipText;
        },
      },
      radar: {
        indicator: [
          { name: 'Metric 1', max: 100 },
          { name: 'Metric 2', max: 100 },
          { name: 'Metric 3', max: 100 },
        ],
        radius: '70%',
        center: ['50%', '55%'],
        shape: 'circle',
        splitNumber: 5,
        axisName: {
          color: '#ffffff',
          fontSize: 14,
        },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(255, 255, 255, 0.2)',
              'rgba(255, 255, 255, 0.4)',
              'rgba(255, 255, 255, 0.6)',
            ].reverse(),
          },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)'].reverse(),
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
      series: [
        {
          name: 'Data',
          type: 'radar',
          data: [
            {
              value: [100, 90, 20,],
              name: 'Series 1',
            },
          ],
          lineStyle: {
            color: '#FF6347',
            width: 3,
          },
          itemStyle: {
            color: '#FF6347',
          },
          areaStyle: {
            color: 'rgba(255, 99, 71, 0.5)',
          },
        },
      ],
    };
  };

  return (
    <div className='h-[30rem] p-6 bg-[#181C3A] rounded-xl'>
      <ReactEcharts option={getOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default RadarChart;
