
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Target, Trophy, TrendingUp, Clock, ChevronRight, Play, Zap, Award, Users, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import StudySessionFinal from './StudySessionFinal';
import DailyChallenge from './DailyChallenge';
import OabTipsCarousel from './OabTipsCarousel';
import { useToast } from "@/hooks/use-toast";

interface HomeSectionProps {
  onHideNavigation?: (hide: boolean) => void;
}

const HomeSection = ({
  onHideNavigation
}: HomeSectionProps) => {
  const [showStudySession, setShowStudySession] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showRandomQuestions, setShowRandomQuestions] = useState(false);
  const [showSimulado, setShowSimulado] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAreas: 0,
    totalExams: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('QUESTOES_FINAL')
        .select('area, aplicada_em');

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        const uniqueAreas = new Set(data?.map(item => item.area).filter(Boolean));
        const uniqueExams = new Set(data?.map(item => item.aplicada_em).filter(item => item && !item.includes('null')));

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
    setShowStudySession(true);
    setShowRandomQuestions(false);
    setShowSimulado(false);
    setShowDailyChallenge(false);
    onHideNavigation?.(true);
  };

  const handleRandomQuestions = () => {
    setSelectedArea('');
    setShowRandomQuestions(true);
    setShowStudySession(true);
    setShowSimulado(false);
    setShowDailyChallenge(false);
    onHideNavigation?.(true);
  };

  const handleSimuladoAccess = () => {
    setShowSimulado(true);
    setShowStudySession(false);
    setShowRandomQuestions(false);
    setShowDailyChallenge(false);
  };

  const handleDailyChallenge = () => {
    setShowDailyChallenge(true);
    setShowStudySession(true);
    setShowRandomQuestions(false);
    setShowSimulado(false);
    setSelectedArea('');
    onHideNavigation?.(true);
  };

  const handleBackToHome = () => {
    setShowStudySession(false);
    setShowRandomQuestions(false);
    setSelectedArea('');
    setShowDailyChallenge(false);
    onHideNavigation?.(false);
  };

  const popularAreas = ['Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Processual Civil', 'Direito do Trabalho', 'Direito Administrativo'];

  if (showStudySession && !showSimulado) {
    return (
      <div className="h-full overflow-y-auto bg-netflix-black">
        <div className="p-6 px-[6px]">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-gray-800 border-l-4 border-netflix-red animate-fade-in">
            <button 
              onClick={handleBackToHome} 
              className="text-netflix-red hover:text-red-400 transition-all duration-200 font-semibold hover:scale-105"
            >
              ← Voltar ao Início
            </button>
            <h1 className="text-2xl font-bold text-white">
              {showDailyChallenge ? 'Desafio Diário - 20 Questões' : showRandomQuestions ? 'Questões Aleatórias' : `Estudando: ${selectedArea}`}
            </h1>
          </div>
          
          <StudySessionFinal 
            filters={showRandomQuestions ? {} : selectedArea ? { area: selectedArea } : {}}
            onExit={handleBackToHome}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Hero Section */}
      <div className="relative p-6 pb-8 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-netflix-red rounded-full p-3 transition-transform duration-200 hover:scale-110">
              <Award className="text-white" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Questões comentadas Pro
            </h1>
          </div>
          <p className="text-xl text-netflix-text-secondary mb-8 max-w-2xl mx-auto">
            Prepare-se para concursos jurídicos com questões comentadas, simulados e conteúdo atualizado
          </p>
          
          {/* Hero CTA Button - Destacado */}
          <div className="mb-8">
            <Button 
              onClick={handleRandomQuestions}
              className="bg-gradient-to-r from-netflix-red to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 animate-pulse"
            >
              <Target className="mr-3 h-6 w-6" />
              Iniciar Questões
              <ChevronRight className="ml-3 h-6 w-6" />
            </Button>
            <p className="text-netflix-text-secondary text-sm mt-3">
              Comece a estudar agora com questões aleatórias
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-netflix-card border border-netflix-border rounded-lg p-4 transition-all duration-200 hover:scale-105">
              <div className="text-2xl font-bold text-netflix-red mb-1">
                {stats.totalQuestions.toLocaleString()}
              </div>
              <div className="text-sm text-netflix-text-secondary">
                Questões Disponíveis
              </div>
            </div>
            <div className="bg-netflix-card border border-netflix-border rounded-lg p-4 transition-all duration-200 hover:scale-105">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {stats.totalAreas}
              </div>
              <div className="text-sm text-netflix-text-secondary">
                Áreas do Direito
              </div>
            </div>
            <div className="bg-netflix-card border border-netflix-border rounded-lg p-4 transition-all duration-200 hover:scale-105">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {stats.totalExams}
              </div>
              <div className="text-sm text-netflix-text-secondary">
                Concursos Passados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Section */}
      <div className="mb-8 px-[5px] animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="text-orange-500" size={28} />
          Desafio Diário
        </h2>
        <DailyChallenge onStartChallenge={handleDailyChallenge} />
      </div>

      {/* OAB Tips Carousel */}
      <div className="mb-8 px-[7px] animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Scale className="text-blue-500" size={28} />
          Dicas para o Sucesso em Concursos Jurídicos
        </h2>
        <OabTipsCarousel />
      </div>

      {/* Main Study Options */}
      <div className="px-6 mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="text-netflix-red" size={28} />
          Como você quer estudar hoje?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Study by Area */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Scale className="text-white" size={24} />
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
              {popularAreas.slice(0, 3).map(area => (
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
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl" onClick={handleRandomQuestions}>
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
          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl" onClick={handleSimuladoAccess}>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-netflix-red rounded-lg p-3 group-hover:scale-110 transition-transform">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Simulado Completo</h3>
                <p className="text-red-200">Provas reais de concursos anteriores</p>
              </div>
            </div>
            <p className="text-red-100/80 text-sm mb-4">
              Pratique com questões reais de concursos, cronometrado e nas mesmas condições da prova oficial.
            </p>
            <div className="flex items-center gap-2 text-red-200">
              <Clock size={16} />
              <span className="text-sm font-medium">5h de duração</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Special Categories */}
      <div className="px-6 mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-netflix-red" size={24} />
          Categorias Especiais
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" onClick={() => handleAreaSelect('Ética Profissional')}>
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Ética Profissional</h3>
                <p className="text-gray-400 text-xs">Estatuto da Advocacia</p>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" onClick={() => handleAreaSelect('Direito Constitucional')}>
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

          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" onClick={() => handleAreaSelect('Direito Civil')}>
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

          <Card className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" onClick={() => handleAreaSelect('Direito Penal')}>
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
      <div className="px-6 pb-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <div className="bg-gradient-to-r from-netflix-red/20 to-red-800/20 border border-netflix-red/30 rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Pronto para começar?</h3>
              <p className="text-netflix-text-secondary">
                Escolha uma das opções acima e comece sua jornada rumo ao sucesso em concursos jurídicos!
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-netflix-red rounded-full p-4 animate-pulse">
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
