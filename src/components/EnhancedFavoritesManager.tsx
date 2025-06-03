
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EnhancedFavoritesManagerProps {
  questionId: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const EnhancedFavoritesManager = ({ 
  questionId, 
  size = 'md', 
  showText = false 
}: EnhancedFavoritesManagerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  useEffect(() => {
    checkAuthAndFavoriteStatus();
  }, [questionId]);

  const checkAuthAndFavoriteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      
      // Check if question is already favorited
      const { data, error } = await supabase
        .from('question_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite status:', error);
        return;
      }

      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error in checkAuthAndFavoriteStatus:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar questões como favoritas",
        variant: "destructive"
      });
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('question_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Questão removida da sua lista de favoritos",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('question_favorites')
          .insert({
            user_id: user.id,
            question_id: questionId
          });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Questão salva na sua lista de favoritos",
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
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-200 hover:scale-110 ${
        isFavorite 
          ? 'text-red-500 hover:text-red-400' 
          : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      {loading ? (
        <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      ) : (
        <Heart 
          className={sizeClasses[size]} 
          fill={isFavorite ? 'currentColor' : 'none'} 
        />
      )}
      {showText && (
        <span className="ml-2 text-sm">
          {isFavorite ? 'Favorito' : 'Favoritar'}
        </span>
      )}
    </Button>
  );
};

export default EnhancedFavoritesManager;
