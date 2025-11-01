import React, { useState } from 'react';
import CalculatorButton from './components/CalculatorButton';
import type { ButtonConfig } from './types';
import { evaluate } from './calculatorLogic';

const scientificButtons: ButtonConfig[] = [
  { id: 'sin', label: 'sin', type: 'scientific' },
  { id: 'cos', label: 'cos', type: 'scientific' },
  { id: 'tan', label: 'tan', type: 'scientific' },
  { id: 'log', label: 'log', type: 'scientific' },
  { id: 'ln', label: 'ln', type: 'scientific' },
  { id: 'leftParen', label: '(', type: 'scientific' },
  { id: 'rightParen', label: ')', type: 'scientific' },
  { id: 'sqrt', label: '√', type: 'scientific' },
  { id: 'power', label: 'xʸ', type: 'scientific' },
  { id: 'pi', label: 'π', type: 'scientific' },
];

const mainButtons: ButtonConfig[] = [
  { id: 'clear', label: 'AC', type: 'function' },
  { id: 'toggleSign', label: '+/-', type: 'function' },
  { id: 'percent', label: '%', type: 'function' },
  { id: 'divide', label: '÷', type: 'operator' },
  { id: '7', label: '7', type: 'number' },
  { id: '8', label: '8', type: 'number' },
  { id: '9', label: '9', type: 'number' },
  { id: 'multiply', label: '×', type: 'operator' },
  { id: '4', label: '4', type: 'number' },
  { id: '5', label: '5', type: 'number' },
  { id: '6', label: '6', type: 'number' },
  { id: 'subtract', label: '−', type: 'operator' },
  { id: '1', label: '1', type: 'number' },
  { id: '2', label: '2', type: 'number' },
  { id: '3', label: '3', type: 'number' },
  { id: 'add', label: '+', type: 'operator' },
  { id: '0', label: '0', type: 'number', className: 'col-span-2 !w-auto' },
  { id: 'decimal', label: '.', type: 'number' },
  { id: 'equals', label: '=', type: 'operator' },
];

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');

  const formatDisplayValue = (value: string) => {
    if (value.length > 9) {
      try {
        const num = parseFloat(value);
        if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.0000001 && num !== 0)) {
          return num.toExponential(2);
        }
      } catch (e) {
        // Ignore parsing errors for intermediate states like "Error"
      }
    }
    return value.slice(0, 12);
  };

  const handleButtonClick = (id: string, label: string) => {
    switch (id) {
      case 'clear':
        setExpression('');
        setDisplayValue('0');
        break;
      case 'equals':
        try {
          const result = evaluate(expression);
          setDisplayValue(String(result));
          setExpression(String(result));
        } catch (error) {
          setDisplayValue('Error');
          setExpression('');
        }
        break;
      case 'toggleSign':
        // This is a complex operation on a string expression, so we'll omit for now.
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case 'sqrt':
        setExpression((prev) => `${prev}${label}(`);
        break;
      case 'power':
        setExpression((prev) => `${prev}^`);
        break;
      default:
        if (displayValue === 'Error' || (displayValue === '0' && id !== 'decimal')) {
          setExpression(label);
          setDisplayValue(label);
        } else {
          setExpression((prev) => `${prev}${label}`);
          setDisplayValue((prev) => `${prev}${label}`);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto rounded-3xl shadow-lg p-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700">
        <div className="bg-transparent text-white p-4 rounded-t-lg text-right">
          <div className="text-gray-400 text-2xl h-8 break-all truncate" title={expression}>{expression}</div>
          <div className="text-6xl font-light break-words" style={{ minHeight: '64px' }}>
            {formatDisplayValue(displayValue)}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-4 mb-3">
          {scientificButtons.map((btn) => (
             <CalculatorButton
             key={btn.id}
             onClick={() => handleButtonClick(btn.id, btn.label)}
             label={btn.label}
             type='scientific'
             className={btn.className}
           />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {mainButtons.map((btn) => (
            <CalculatorButton
              key={btn.id}
              onClick={() => handleButtonClick(btn.id, btn.label)}
              label={btn.label}
              type={btn.type}
              className={btn.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
