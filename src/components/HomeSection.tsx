
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Play,
  Zap,
  Award,
  Users,
  FileText,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  ano: string;
  exame: string;
  area: string;
  numero: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: string;
  justificativa: string;
  banca: string;
}

const HomeSection = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showRandomQuestions, setShowRandomQuestions] = useState(false);
  const [showSimulado, setShowSimulado] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAreas: 0,
    totalExams: 0
  });
  const [showOabInfo, setShowOabInfo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('area, exame, ano');

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        const uniqueAreas = new Set(data?.map(item => item.area).filter(Boolean));
        const uniqueExams = new Set(data?.map(item => `${item.exame}-${item.ano}`).filter(item => !item.includes('null')));
        
        setStats({
          totalQuestions: data?.length || 0,
          totalAreas: uniqueAreas.size,
          totalExams: uniqueExams.size
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setShowQuestions(true);
    setShowRandomQuestions(false);
    setShowSimulado(false);
  };

  const handleRandomQuestions = () => {
    setSelectedArea('');
    setShowRandomQuestions(true);
    setShowQuestions(true);
    setShowSimulado(false);
  };

  const handleSimuladoAccess = () => {
    setShowSimulado(true);
    setShowQuestions(false);
    setShowRandomQuestions(false);
  };

  const popularAreas = [
    'Direito Constitucional',
    'Direito Civil',
    'Direito Penal',
    'Direito Processual Civil',
    'Direito do Trabalho',
    'Direito Administrativo'
  ];

  if (showQuestions && !showSimulado) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-gray-800 border-l-4 border-netflix-red">
            <button 
              onClick={() => {
                setShowQuestions(false);
                setShowRandomQuestions(false);
                setSelectedArea('');
              }} 
              className="text-netflix-red hover:text-red-400 transition-colors font-semibold"
            >
              ← Voltar ao Início
            </button>
            <h1 className="text-2xl font-bold text-white">
              {showRandomQuestions ? 'Questões Aleatórias' : `Estudando: ${selectedArea}`}
            </h1>
          </div>
          
          <QuestionsSection 
            selectedArea={showRandomQuestions ? undefined : selectedArea}
            limit={showRandomQuestions ? 10 : 20}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Hero Section */}
      <div className="relative p-6 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-netflix-red rounded-full p-3">
              <Award className="text-white" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              OAB Questões
            </h1>
          </div>
          <p className="text-xl text-netflix-text-secondary mb-8 max-w-2xl mx-auto">
            Prepare-se para o Exame da OAB com questões comentadas, simulados reais e conteúdo atualizado
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-netflix-card border border-netflix-border rounded-lg p-4">
              <div className="text-2xl font-bold text-netflix-red mb-1">
                {stats.totalQuestions.toLocaleString()}
              </div>
              <div className="text-sm text-netflix-text-secondary">
                Questões Disponíveis
              </div>
            </div>
            <div className="bg-netflix-card border border-netflix-border rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {stats.totalAreas}
              </div>
              <div className="text-sm text-netflix-text-secondary">
                Áreas do Direito
              </div>
            </div>
            <div className="bg-netflix-card border border-netflix-border rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {stats.totalExams}
              </div>
              <div className="text-sm text-netflix-text-secondary">
                Exames Passados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre a OAB Section */}
      <div className="px-6 mb-8">
        <Card className="bg-netflix-card border-netflix-border overflow-hidden">
          <div 
            className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => setShowOabInfo(!showOabInfo)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-lg p-3">
                  <Info className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Sobre o Exame da OAB</h2>
                  <p className="text-netflix-text-secondary">
                    Entenda tudo sobre o exame e como se preparar
                  </p>
                </div>
              </div>
              {showOabInfo ? (
                <ChevronUp className="text-netflix-text-secondary" size={24} />
              ) : (
                <ChevronDown className="text-netflix-text-secondary" size={24} />
              )}
            </div>
          </div>
          
          {showOabInfo && (
            <div className="px-6 pb-6 border-t border-netflix-border">
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">📊 Estrutura do Exame</h3>
                  <ul className="space-y-2 text-netflix-text-secondary">
                    <li>• <strong>1ª Fase:</strong> 80 questões objetivas (4 alternativas)</li>
                    <li>• <strong>2ª Fase:</strong> Prova prático-profissional</li>
                    <li>• <strong>Duração:</strong> 5 horas (1ª fase) / 5 horas (2ª fase)</li>
                    <li>• <strong>Aprovação:</strong> Mínimo de 50% de acertos em cada fase</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">🎯 Benefícios de Praticar</h3>
                  <ul className="space-y-2 text-netflix-text-secondary">
                    <li>• <strong>Familiarização:</strong> Conheça o estilo das questões</li>
                    <li>• <strong>Gestão do Tempo:</strong> Pratique o ritmo ideal</li>
                    <li>• <strong>Identificação de Lacunas:</strong> Descubra pontos fracos</li>
                    <li>• <strong>Confiança:</strong> Aumente sua segurança no exame</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">📚 Principais Áreas</h3>
                  <ul className="space-y-2 text-netflix-text-secondary">
                    <li>• Ética Profissional (Estatuto da OAB)</li>
                    <li>• Direito Constitucional</li>
                    <li>• Direito Civil e Processual Civil</li>
                    <li>• Direito Penal e Processual Penal</li>
                    <li>• Direito Administrativo</li>
                    <li>• Direito do Trabalho</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">💡 Dicas de Estudo</h3>
                  <ul className="space-y-2 text-netflix-text-secondary">
                    <li>• <strong>Consistência:</strong> Estude um pouco todos os dias</li>
                    <li>• <strong>Simulados:</strong> Pratique em condições reais</li>
                    <li>• <strong>Revisão:</strong> Foque nas questões erradas</li>
                    <li>• <strong>Legislação:</strong> Mantenha-se atualizado</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Main Study Options */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="text-netflix-red" size={28} />
          Como você quer estudar hoje?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Study by Area */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Estudar por Área</h3>
                <p className="text-blue-200">Foque em disciplinas específicas</p>
              </div>
            </div>
            <p className="text-blue-100/80 text-sm mb-4">
              Escolha uma área do direito e pratique questões específicas para fortalecer seus conhecimentos.
            </p>
            <div className="flex flex-wrap gap-2">
              {popularAreas.slice(0, 3).map((area) => (
                <button
                  key={area}
                  onClick={() => handleAreaSelect(area)}
                  className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 px-3 py-1 rounded-full text-xs transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>
          </Card>

          {/* Random Questions */}
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                onClick={handleRandomQuestions}>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Questões Rápidas</h3>
                <p className="text-green-200">Prática mista e dinâmica</p>
              </div>
            </div>
            <p className="text-green-100/80 text-sm mb-4">
              Questões aleatórias de diferentes áreas para uma revisão completa e diversificada.
            </p>
            <div className="flex items-center gap-2 text-green-200">
              <Play size={16} />
              <span className="text-sm font-medium">Começar Agora</span>
            </div>
          </Card>

          {/* Simulado */}
          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                onClick={handleSimuladoAccess}>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-netflix-red rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Simulado Completo</h3>
                <p className="text-red-200">Provas reais de exames anteriores</p>
              </div>
            </div>
            <p className="text-red-100/80 text-sm mb-4">
              Pratique com exames reais da OAB, cronometrado e nas mesmas condições da prova oficial.
            </p>
            <div className="flex items-center gap-2 text-red-200">
              <Clock size={16} />
              <span className="text-sm font-medium">5h de duração</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Special Categories */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-netflix-red" size={24} />
          Categorias Especiais
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors group"
                onClick={() => handleAreaSelect('Ética Profissional')}>
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Ética Profissional</h3>
                <p className="text-gray-400 text-xs">Estatuto da OAB</p>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors group"
                onClick={() => handleAreaSelect('Direito Constitucional')}>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Constitucional</h3>
                <p className="text-gray-400 text-xs">Base do ordenamento</p>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors group"
                onClick={() => handleAreaSelect('Direito Civil')}>
            <div className="flex items-center gap-3">
              <div className="bg-cyan-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Direito Civil</h3>
                <p className="text-gray-400 text-xs">Relações privadas</p>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors group"
                onClick={() => handleAreaSelect('Direito Penal')}>
            <div className="flex items-center gap-3">
              <div className="bg-red-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Direito Penal</h3>
                <p className="text-gray-400 text-xs">Crimes e penas</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-6 pb-8">
        <div className="bg-gradient-to-r from-netflix-red/20 to-red-800/20 border border-netflix-red/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Pronto para começar?</h3>
              <p className="text-netflix-text-secondary">
                Escolha uma das opções acima e comece sua jornada rumo à aprovação na OAB!
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-netflix-red rounded-full p-4">
                <ChevronRight className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
