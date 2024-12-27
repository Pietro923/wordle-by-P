import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters: {
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  };
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, usedLetters }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  const getKeyColor = (key: string) => {
    if (!usedLetters[key]) {
      return 'bg-white shadow-lg hover:bg-gray-50 border border-gray-200 text-gray-700';
    }
    switch (usedLetters[key]) {
      case 'correct':
        return 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 text-white border-none';
      case 'present':
        return 'bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-200 text-white border-none';
      case 'absent':
        return 'bg-gray-500 hover:bg-gray-600 shadow-lg shadow-gray-200 text-white border-none';
      default:
        return 'bg-white shadow-lg hover:bg-gray-50 border border-gray-200 text-gray-700';
    }
  };

  const getKeySize = (key: string) => {
    if (key === 'ENTER') return 'w-20';
    if (key === '⌫') return 'w-16';
    return 'w-10 sm:w-12';
  };

  const getKeyContent = (key: string) => {
    if (key === '⌫') return <ArrowLeftIcon className="w-5 h-5" />;
    if (key === 'ENTER') return (
      <div className="flex items-center justify-center gap-1">
        <span>ENTER</span>
        <ArrowRightIcon className="w-4 h-4" />
      </div>
    );
    return key;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-3 bg-gray-50 rounded-xl">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 mb-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`
                ${getKeySize(key)}
                h-14
                rounded-lg
                font-bold
                text-sm
                ${getKeyColor(key)}
                transition-all
                duration-200
                active:scale-95
                flex
                items-center
                justify-center
                uppercase
              `}
            >
              {getKeyContent(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;