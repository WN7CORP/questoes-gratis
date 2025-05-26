
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, XCircle, Heart, MessageSquare, Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  ano: string;
  exame: string;
  area: string;
  numero: string;
  questao: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: string;
  justificativa: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer?: (questionId: number, selectedAnswer: string, isCorrect: boolean) => void;
  mode?: 'practice' | 'simulation' | 'review';
  timeLimit?: number;
}

const QuestionCard = ({ question, onAnswer, mode = 'practice', timeLimit }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    if (!answered && mode === 'simulation') {
      const timer = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          if (timeLimit && newTime >= timeLimit) {
            handleTimeUp();
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [answered, mode, timeLimit]);

  // Check if question is favorite
  useEffect(() => {
    checkIfFavorite();
  }, [question.id]);

  const checkIfFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_question_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', question.id)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not favorite
    }
  };

  const alternatives = [
    { key: 'A', value: question.alternativa_a },
    { key: 'B', value: question.alternativa_b },
    { key: 'C', value: question.alternativa_c },
    { key: 'D', value: question.alternativa_d },
  ].filter(alt => alt.value && alt.value.trim() !== '');

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || answered) return;
    
    const isCorrect = selectedAnswer === question.resposta_correta;
    setAnswered(true);
    setShowResult(true);
    
    // Save attempt to database
    await saveAttempt(selectedAnswer, isCorrect);
    
    if (onAnswer) {
      onAnswer(question.id, selectedAnswer, isCorrect);
    }
  };

  const handleTimeUp = () => {
    if (!answered) {
      setAnswered(true);
      setShowResult(true);
      saveAttempt('', false);
      toast({
        title: "Tempo esgotado!",
        description: "A questão foi marcada como incorreta.",
        variant: "destructive"
      });
    }
  };

  const saveAttempt = async (answer: string, isCorrect: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_question_attempts')
        .insert({
          user_id: user.id,
          question_id: question.id,
          selected_answer: answer,
          is_correct: isCorrect,
          time_spent: timeSpent
        });
    } catch (error) {
      console.error('Error saving attempt:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para salvar favoritos",
          variant: "destructive"
        });
        return;
      }

      if (isFavorite) {
        await supabase
          .from('user_question_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', question.id);
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Questão removida da sua lista de favoritos"
        });
      } else {
        await supabase
          .from('user_question_favorites')
          .insert({
            user_id: user.id,
            question_id: question.id
          });
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Questão salva na sua lista de favoritos"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos",
        variant: "destructive"
      });
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_question_notes')
        .upsert({
          user_id: user.id,
          question_id: question.id,
          note_text: note
        });

      setShowNote(false);
      toast({
        title: "Anotação salva",
        description: "Sua anotação foi salva com sucesso"
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const getAlternativeStyle = (key: string) => {
    if (!answered) {
      return selectedAnswer === key 
        ? 'bg-red-600 border-red-500 text-white shadow-lg transform scale-[1.02] transition-all duration-200' 
        : 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200';
    }
    
    if (key === question.resposta_correta) {
      return 'bg-green-600 border-green-500 text-white shadow-lg';
    }
    
    if (key === selectedAnswer && key !== question.resposta_correta) {
      return 'bg-red-600 border-red-500 text-white shadow-lg';
    }
    
    return 'bg-gray-800 border-gray-600 text-gray-400 opacity-60';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-700 p-4 sm:p-6 max-w-4xl mx-auto shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 rounded-lg p-2">
            <BookOpen className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
                {question.exame}ª {question.ano}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
                Questão {question.numero}
              </Badge>
              {mode === 'simulation' && (
                <Badge variant="outline" className="border-orange-600 text-orange-300 bg-orange-900/20">
                  <Clock size={12} className="mr-1" />
                  {formatTime(timeSpent)}
                </Badge>
              )}
            </div>
            <h3 className="text-white font-medium text-sm sm:text-base">{question.area}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={`${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-gray-300'} transition-colors`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNote(!showNote)}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <MessageSquare size={20} />
          </Button>
          {answered && (
            <div className="flex items-center gap-2">
              {selectedAnswer === question.resposta_correta ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
          {question.questao}
        </p>
      </div>

      {/* Note section */}
      {showNote && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Adicione suas anotações sobre esta questão..."
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-gray-100 placeholder-gray-400 resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={saveNote} size="sm" className="bg-red-600 hover:bg-red-700">
              Salvar
            </Button>
            <Button onClick={() => setShowNote(false)} variant="outline" size="sm">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Alternatives */}
      <div className="space-y-3 mb-6">
        {alternatives.map((alternative) => (
          <button
            key={alternative.key}
            onClick={() => handleAnswerSelect(alternative.key)}
            disabled={answered}
            className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${getAlternativeStyle(alternative.key)}`}
          >
            <div className="flex items-start gap-3">
              <span className="font-bold text-lg min-w-[24px] flex-shrink-0">
                {alternative.key})
              </span>
              <span className="flex-1 text-sm sm:text-base">
                {alternative.value}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {!answered && (
        <Button
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Responder
        </Button>
      )}

      {/* Justification */}
      {showResult && question.justificativa && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            Comentário da Questão
          </h4>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {question.justificativa}
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
