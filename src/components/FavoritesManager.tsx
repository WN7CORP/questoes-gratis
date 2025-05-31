
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart } from 'lucide-react';

interface FavoritesManagerProps {
  questionId: number;
  className?: string;
  size?: number;
}

const FavoritesManager = ({ questionId, className = "", size = 20 }: FavoritesManagerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkFavoriteStatus();
  }, [questionId]);

  const checkFavoriteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if favorite exists in user_question_favorites table
      const { data, error } = await supabase
        .from('user_question_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .limit(1);

      if (error) {
        console.error('Error checking favorite status:', error);
        // Fallback to user_questoes table
        const { data: fallbackData } = await supabase
          .from('user_questoes')
          .select('id')
          .eq('user_id', user.id)
          .eq('questao_id', questionId)
          .limit(1);
        
        setIsFavorite(!!fallbackData && fallbackData.length > 0);
      } else {
        setIsFavorite(!!data && data.length > 0);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
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
        // Remove from favorites
        const { error } = await supabase
          .from('user_question_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);

        if (error) {
          console.error('Error removing favorite:', error);
          // Fallback to user_questoes table
          await supabase
            .from('user_questoes')
            .delete()
            .eq('user_id', user.id)
            .eq('questao_id', questionId);
        }

        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Questão removida da sua lista de favoritos"
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_question_favorites')
          .insert({
            user_id: user.id,
            question_id: questionId
          });

        if (error) {
          console.error('Error adding favorite:', error);
          // Fallback to user_questoes table
          await supabase
            .from('user_questoes')
            .upsert({
              user_id: user.id,
              questao_id: questionId,
              resposta_selecionada: '',
              acertou: false
            });
        }

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
    >
      <Heart 
        size={size} 
        className={`transition-colors duration-200 ${
          isFavorite 
            ? 'text-red-500 fill-red-500' 
            : 'text-gray-400 hover:text-red-400'
        } ${isLoading ? 'opacity-50' : ''}`}
      />
    </button>
  );
};

export default FavoritesManager;
