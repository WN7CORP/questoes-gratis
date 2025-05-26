
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
      {/* Mobile version using Drawer */}
      <div className="block sm:hidden">
        <Drawer open={isVisible} onOpenChange={onClose}>
          <DrawerContent className="bg-netflix-card border-netflix-border max-h-[85vh]">
            <DrawerHeader className="pb-4">
              <DrawerTitle className="text-white text-xl font-semibold flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                Comentário da Questão
              </DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Entenda melhor a resposta correta
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                {justification}
              </div>
            </div>

            <div className="p-4 border-t border-netflix-border">
              <Button
                onClick={onClose}
                className="w-full bg-netflix-red hover:bg-red-700 text-white py-4 text-base rounded-xl active:scale-95 transition-all duration-200"
              >
                Fechar
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop version (existing sliding panel) */}
      <div className="hidden sm:block">
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
      </div>
    </>
  );
};

export default QuestionJustification;
