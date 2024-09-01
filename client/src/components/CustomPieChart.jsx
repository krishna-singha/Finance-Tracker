import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/userAtom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StylishPieChart = () => {
  const user = useRecoilValue(userAtom);
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    const getExpenseData = async () => {
      try {
        if (user?.uid) {
          const { data } = await axios.post(`${BACKEND_URL}/v1/api/getData/expense`, {
            "_id": user.uid,
          });
          setExpense(data);
        }
      } catch (error) {
        console.error('Failed to fetch expense data:', error);
      }
    };

    getExpenseData();
  }, [user]);

  const processExpensesByCategory = (expenses) => {
    const categorySum = {};

    expenses.forEach(expenseItem => {
      const { category, amount } = expenseItem;

      if (categorySum[category]) {
        categorySum[category] += amount;
      } else {
        categorySum[category] = amount;
      }
    });

    return Object.keys(categorySum).map(category => ({
      name: category,
      value: categorySum[category],
    }));
  };

  const processedData = processExpensesByCategory(expense);

  const getOption = () => {
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