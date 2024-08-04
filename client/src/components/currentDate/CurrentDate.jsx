import React from 'react';
import { MdDateRange } from 'react-icons/md';

const CurrentDate = () => {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center text-white bg-[#181C3A] w-fit p-6 rounded-xl shadow-lg">
      <MdDateRange className="text-2xl mr-2" />
      <span>{date}</span>
    </div>
  );
};

export default CurrentDate;
