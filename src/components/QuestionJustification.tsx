
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, MessageSquare } from 'lucide-react';

interface QuestionJustificationProps {
  justification: string;
  isVisible: boolean;
  onClose: () => void;
}

const QuestionJustification = ({ justification, isVisible, onClose }: QuestionJustificationProps) => {
  if (!isVisible) return null;

  // Function to safely render HTML content
  const renderHTMLContent = (content: string) => {
    if (!content) return 'Justificativa não disponível para esta questão.';

    // Check if content contains HTML tags
    const hasHTML = /<[^>]*>/g.test(content);
    if (hasHTML) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: content }} 
          className="text-gray-100 leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>strong]:font-bold [&>em]:italic [&>u]:underline [&>br]:block [&>br]:my-2 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:bg-gray-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>pre]:bg-gray-800 [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto"
        />
      );
    }
    return <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">{content}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-netflix-card border-netflix-border w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-netflix-border">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold">
              Comentário da Questão
            </h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {renderHTMLContent(justification)}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-netflix-border">
          <Button
            onClick={onClose}
            className="bg-netflix-red hover:bg-red-700 text-white px-6"
          >
            Fechar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuestionJustification;
