
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from 'lucide-react';

interface OptionsProps {
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isCorrect: boolean | null;
  correctAnswer: string;
}

const Options = ({ options, selectedOption, onSelect, isCorrect, correctAnswer }: OptionsProps) => {
  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getButtonVariant = (option: string) => {
    if (selectedOption === null) return "outline";
    if (selectedOption === option) {
      return isCorrect ? "default" : "destructive";
    }
    if (option === correctAnswer && isCorrect === false) {
      return "default";
    }
    return "outline";
  };

  const getButtonColor = (option: string) => {
    if (selectedOption === null) return "";
    if (selectedOption === option) {
      return isCorrect ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
    }
    if (option === correctAnswer && isCorrect === false) {
      return "bg-green-600 hover:bg-green-700";
    }
    return "";
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={getButtonVariant(option)}
          className={`w-full text-left justify-start p-4 h-auto whitespace-normal ${getButtonColor(option)}`}
          onClick={() => onSelect(option)}
          disabled={isCorrect !== null}
        >
          <div className="flex items-start gap-3 w-full">
            <span className="font-bold text-lg flex-shrink-0">
              {getOptionLetter(index)}
            </span>
            <span className="flex-1">{option}</span>
            {selectedOption === option && isCorrect !== null && (
              isCorrect ? (
                <CheckCircle className="text-white ml-2 flex-shrink-0" size={20} />
              ) : (
                <XCircle className="text-white ml-2 flex-shrink-0" size={20} />
              )
            )}
            {option === correctAnswer && isCorrect === false && selectedOption !== option && (
              <CheckCircle className="text-white ml-2 flex-shrink-0" size={20} />
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Options;
