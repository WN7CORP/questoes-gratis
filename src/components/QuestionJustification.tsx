
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from 'lucide-react';

interface QuestionJustificationProps {
  justification: string;
  isVisible: boolean;
  onClose: () => void;
}

const QuestionJustification = ({ justification, isVisible, onClose }: QuestionJustificationProps) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-netflix-card border-l border-netflix-border z-50
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              Comentário da Questão
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
            {justification}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionJustification;
