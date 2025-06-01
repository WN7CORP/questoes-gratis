
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, GraduationCap } from 'lucide-react';

interface QuestionJustificationProps {
  justification: string;
  isVisible: boolean;
  onClose: () => void;
}

const QuestionJustification = ({ justification, isVisible, onClose }: QuestionJustificationProps) => {
  // Function to safely render HTML content
  const renderHTMLContent = (content: string) => {
    if (!content) return <p className="text-gray-400">Justificativa não disponível.</p>;
    
    // Check if content contains HTML tags
    const hasHTML = /<[^>]*>/g.test(content);
    
    if (hasHTML) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          className="prose prose-invert max-w-none text-gray-100 leading-relaxed"
          style={{
            fontSize: '16px',
            lineHeight: '1.6'
          }}
        />
      );
    }
    
    return (
      <div className="text-gray-100 leading-relaxed whitespace-pre-wrap" style={{
        fontSize: '16px',
        lineHeight: '1.6'
      }}>
        {content}
      </div>
    );
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="bg-netflix-card border-netflix-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-white text-xl">
              <GraduationCap className="text-blue-500" size={24} />
              Comentário da Questão
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2"
            >
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {renderHTMLContent(justification)}
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t border-netflix-border">
          <Button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionJustification;
