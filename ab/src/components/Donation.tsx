import React from 'react';

interface NameNumberProps {
  name: string;
  number: number;
}

const NameNumber: React.FC<NameNumberProps> = ({ name, number }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-100 border border-blue-300 rounded-lg shadow-md p-4 w-64">
      <h1 className="text-xl font-bold text-blue-700">{name}</h1>
      <p className="text-lg text-blue-500">{number}</p>
    </div>
  );
};

export default NameNumber;
