
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Plus, List, BookOpen } from 'lucide-react';

interface PlaylistCreatorProps {
  isVisible: boolean;
  onClose: () => void;
  areas: string[];
}

const PlaylistCreator = ({ isVisible, onClose, areas }: PlaylistCreatorProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(20);
  const [isCreating, setIsCreating] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible) {
      fetchAvailableYears();
    }
  }, [isVisible]);

  const fetchAvailableYears = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('ano')
        .eq('exame', 'OAB')
        .not('ano', 'is', null);

      if (error) {
        console.error('Error fetching years:', error);
        return;
      }

      const uniqueYears = [...new Set(data?.map(item => item.ano).filter(Boolean))];
      const sortedYears = uniqueYears.sort((a, b) => parseInt(b) - parseInt(a));
      setAvailableYears(sortedYears);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleCreatePlaylist = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, insira um nome para a playlist",
        variant: "destructive"
      });
      return;
    }

    if (selectedAreas.length === 0) {
      toast({
        title: "Área necessária",
        description: "Selecione pelo menos uma área do direito",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para criar playlists",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('user_playlists' as any)
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          areas: selectedAreas,
          exams: ['OAB'],
          years: selectedYears.length > 0 ? selectedYears : null,
          question_count: questionCount
        });

      if (error) {
        console.error('Error creating playlist:', error);
        toast({
          title: "Erro ao criar playlist",
          description: "Não foi possível criar a playlist. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Playlist criada com sucesso! 🎉",
          description: `"${name}" foi criada para estudos do OAB.`
        });
        
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedAreas([]);
    setSelectedYears([]);
    setQuestionCount(20);
  };

  const handleSelectAllAreas = () => {
    if (selectedAreas.length === areas.length) {
      setSelectedAreas([]);
    } else {
      setSelectedAreas([...areas]);
    }
  };

  const handleSelectAllYears = () => {
    if (selectedYears.length === availableYears.length) {
      setSelectedYears([]);
    } else {
      setSelectedYears([...availableYears]);
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="bg-netflix-card border-netflix-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <List size={20} className="text-blue-500" />
            Criar Playlist de Estudos OAB
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nome e Descrição */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Nome da Playlist *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Direito Constitucional - Revisão OAB"
                className="bg-gray-800 border-gray-600 text-white"
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Descrição (opcional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo desta playlist de estudos..."
                className="bg-gray-800 border-gray-600 text-white resize-none"
                rows={3}
                maxLength={200}
              />
            </div>
          </div>

          {/* Tipo de Exame - Fixo OAB */}
          <Card className="bg-blue-900/20 border-blue-600/30 p-4">
            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-400" />
              Tipo de Exame
            </h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white px-3 py-1">
                OAB - Ordem dos Advogados do Brasil
              </Badge>
              <span className="text-blue-300 text-sm">
                Playlists são especializadas para questões do OAB
              </span>
            </div>
          </Card>

          {/* Quantidade de Questões */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Quantidade de Questões por Sessão
            </label>
            <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="10">10 questões</SelectItem>
                <SelectItem value="20">20 questões</SelectItem>
                <SelectItem value="30">30 questões</SelectItem>
                <SelectItem value="50">50 questões</SelectItem>
                <SelectItem value="80">80 questões (Simulado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Áreas do Direito */}
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                Áreas do Direito
                <Badge variant="outline" className="text-xs">
                  {selectedAreas.length} selecionadas
                </Badge>
              </h3>
              <Button
                onClick={handleSelectAllAreas}
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                {selectedAreas.length === areas.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {areas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area-${area}`}
                    checked={selectedAreas.includes(area)}
                    onCheckedChange={() => handleAreaToggle(area)}
                  />
                  <label
                    htmlFor={`area-${area}`}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
            {selectedAreas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {selectedAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="outline"
                    className="text-xs bg-blue-900/30 border-blue-600 text-blue-300 cursor-pointer hover:bg-blue-900/50"
                    onClick={() => handleAreaToggle(area)}
                  >
                    {area}
                    <X size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Anos do OAB */}
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                Anos do OAB
                <Badge variant="outline" className="text-xs">
                  {selectedYears.length} selecionados
                </Badge>
              </h3>
              <Button
                onClick={handleSelectAllYears}
                variant="ghost"
                size="sm"
                className="text-orange-400 hover:text-orange-300 text-xs"
              >
                {selectedYears.length === availableYears.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableYears.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={() => handleYearToggle(year)}
                  />
                  <label
                    htmlFor={`year-${year}`}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {year}
                  </label>
                </div>
              ))}
            </div>
            {selectedYears.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {selectedYears.map((year) => (
                  <Badge
                    key={year}
                    variant="outline"
                    className="text-xs bg-orange-900/30 border-orange-600 text-orange-300 cursor-pointer hover:bg-orange-900/50"
                    onClick={() => handleYearToggle(year)}
                  >
                    {year}
                    <X size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-gray-400 text-xs mt-2">
              Se nenhum ano for selecionado, serão incluídas questões de todos os anos disponíveis.
            </p>
          </Card>

          {/* Resumo da Playlist */}
          {selectedAreas.length > 0 && (
            <Card className="bg-green-900/20 border-green-600/30 p-4">
              <h4 className="text-green-300 font-medium mb-2">Resumo da Playlist:</h4>
              <ul className="text-green-400 text-sm space-y-1">
                <li>• {selectedAreas.length} área(s) do direito selecionada(s)</li>
                <li>• {selectedYears.length > 0 ? selectedYears.length : 'Todos os'} ano(s) do OAB disponíveis</li>
                <li>• {questionCount} questões por sessão de estudo</li>
              </ul>
            </Card>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Limpar
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              disabled={isCreating || !name.trim() || selectedAreas.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus size={16} />
                  Criar Playlist
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistCreator;
