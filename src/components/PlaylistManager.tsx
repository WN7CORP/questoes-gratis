
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shuffle, Play, Trash2, Calendar, Hash, MapPin } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  description: string;
  areas: string[] | null;
  exams: string[] | null;
  years: string[] | null;
  question_count: number;
  created_at: string;
}

interface PlaylistManagerProps {
  isVisible: boolean;
  onClose: () => void;
  onPlaylistStart: (playlist: Playlist) => void;
}

const PlaylistManager = ({ isVisible, onClose, onPlaylistStart }: PlaylistManagerProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible) {
      fetchPlaylists();
    }
  }, [isVisible]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para ver suas playlists",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('user_playlists' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching playlists:', error);
        toast({
          title: "Erro ao carregar playlists",
          description: "Não foi possível carregar suas playlists.",
          variant: "destructive"
        });
      } else {
        setPlaylists((data || []) as Playlist[]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    setDeletingId(playlistId);
    try {
      const { error } = await supabase
        .from('user_playlists' as any)
        .delete()
        .eq('id', playlistId);

      if (error) {
        console.error('Error deleting playlist:', error);
        toast({
          title: "Erro ao deletar playlist",
          description: "Não foi possível deletar a playlist.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Playlist deletada",
          description: "A playlist foi removida com sucesso."
        });
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFiltersSummary = (playlist: Playlist) => {
    const filters = [];
    
    if (playlist.areas && playlist.areas.length > 0) {
      filters.push(`${playlist.areas.length} área(s)`);
    }
    
    if (playlist.exams && playlist.exams.length > 0) {
      filters.push(`${playlist.exams.length} exame(s)`);
    }
    
    if (playlist.years && playlist.years.length > 0) {
      filters.push(`${playlist.years.length} ano(s)`);
    }
    
    return filters.length > 0 ? filters.join(' • ') : 'Sem filtros específicos';
  };

  if (loading) {
    return (
      <Dialog open={isVisible} onOpenChange={onClose}>
        <DialogContent className="bg-netflix-card border-netflix-border max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <div className="text-gray-400 ml-4">Carregando playlists...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="bg-netflix-card border-netflix-border max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shuffle size={20} className="text-green-500" />
            Minhas Playlists
            <Badge variant="outline" className="ml-2">
              {playlists.length} playlists
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {playlists.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700 p-8 text-center">
              <Shuffle className="mx-auto mb-4 text-gray-500" size={48} />
              <h3 className="text-white text-lg font-semibold mb-2">Nenhuma playlist encontrada</h3>
              <p className="text-gray-400 mb-4">
                Crie sua primeira playlist personalizada para organizar seus estudos.
              </p>
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Criar Primeira Playlist
              </Button>
            </Card>
          ) : (
            playlists.map((playlist) => (
              <Card key={playlist.id} className="bg-gray-800/50 border-gray-700 p-4 hover:bg-gray-800/70 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold text-lg">{playlist.name}</h3>
                      <Badge variant="outline" className="bg-green-900/30 border-green-600 text-green-300">
                        <Hash size={12} className="mr-1" />
                        {playlist.question_count} questões
                      </Badge>
                    </div>
                    
                    {playlist.description && (
                      <p className="text-gray-300 text-sm mb-3">{playlist.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(playlist.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {getFiltersSummary(playlist)}
                      </span>
                    </div>
                    
                    {/* Filtros aplicados */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {playlist.areas?.map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="text-xs bg-blue-900/20 border-blue-600/50 text-blue-300"
                        >
                          {area}
                        </Badge>
                      ))}
                      {playlist.exams?.map((exam) => (
                        <Badge
                          key={exam}
                          variant="outline"
                          className="text-xs bg-purple-900/20 border-purple-600/50 text-purple-300"
                        >
                          {exam}
                        </Badge>
                      ))}
                      {playlist.years?.map((year) => (
                        <Badge
                          key={year}
                          variant="outline"
                          className="text-xs bg-orange-900/20 border-orange-600/50 text-orange-300"
                        >
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => {
                        onPlaylistStart(playlist);
                        onClose();
                      }}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <Play size={14} />
                      Iniciar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                          disabled={deletingId === playlist.id}
                        >
                          {deletingId === playlist.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-netflix-card border-netflix-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Deletar Playlist?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Tem certeza que deseja deletar a playlist "{playlist.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Sim, Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistManager;
