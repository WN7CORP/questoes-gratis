
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
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
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const toggleFavorite = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Temporarily toggle favorite state in local storage
      const favorites = JSON.parse(localStorage.getItem('questionFavorites') || '[]');
      const isCurrentlyFavorite = favorites.includes(questionId);
      
      if (isCurrentlyFavorite) {
        const newFavorites = favorites.filter((id: number) => id !== questionId);
        localStorage.setItem('questionFavorites', JSON.stringify(newFavorites));
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Questão removida da sua lista de favoritos",
        });
      } else {
        favorites.push(questionId);
        localStorage.setItem('questionFavorites', JSON.stringify(favorites));
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
      <Heart 
        className={sizeClasses[size]} 
        fill={isFavorite ? 'currentColor' : 'none'} 
      />
      {showText && (
        <span className="ml-2 text-sm">
          {isFavorite ? 'Favorito' : 'Favoritar'}
        </span>
      )}
    </Button>
  );
};

export default EnhancedFavoritesManager;
