
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FavoriteQuestion {
  id: string;
  question_id: number;
  created_at: string;
  Questoes_Comentadas: {
    id: number;
    ano: string;
    exame: string;
    area: string;
    numero: string;
    questao: string;
    resposta_correta: string;
  };
}

const FavoriteQuestions = () => {
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_question_favorites')
        .select(`
          *,
          Questoes_Comentadas!inner(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavorites(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string, questionId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_question_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast({
          title: "Erro",
          description: "Não foi possível remover dos favoritos",
          variant: "destructive"
        });
      } else {
        setFavorites(prev => prev.filter(f => f.id !== favoriteId));
        toast({
          title: "Removido dos favoritos",
          description: "Questão removida da sua lista de favoritos"
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700 p-6">
        <div className="text-gray-400">Carregando favoritos...</div>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700 p-8 text-center">
        <Heart className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-white text-xl font-semibold mb-2">Nenhuma questão favorita</h3>
        <p className="text-gray-400">
          Adicione questões aos favoritos para revisá-las mais tarde
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <Heart className="text-red-500" size={20} />
          Questões Favoritas ({favorites.length})
        </h2>
      </div>

      <div className="space-y-4">
        {favorites.map((favorite) => {
          const question = favorite.Questoes_Comentadas;
          return (
            <Card key={favorite.id} className="bg-gray-900 border-gray-700 p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800 text-xs">
                      {question.exame}ª {question.ano}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800 text-xs">
                      Q. {question.numero}
                    </Badge>
                    <Badge variant="outline" className="border-blue-600 text-blue-300 bg-blue-900/20 text-xs">
                      {question.area}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                    {question.questao}
                  </p>
                  
                  <div className="text-gray-400 text-xs">
                    Favoritado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <BookOpen size={16} className="mr-1" />
                    Estudar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFavorite(favorite.id, question.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteQuestions;
