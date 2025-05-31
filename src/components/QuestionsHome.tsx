
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, TrendingUp, Play, Hash, FileText } from 'lucide-react';
import { QuestionFilters } from '@/types/questionFinal';
import { supabase } from '@/integrations/supabase/client';
import QuestionFiltersComponent from './QuestionFilters';
import StudySessionFinal from './StudySessionFinal';
import UserStatsCard from './UserStatsCard';

interface QuestionsHomeProps {
  onHideNavigation?: (hide: boolean) => void;
}

const QuestionsHome = ({ onHideNavigation }: QuestionsHomeProps) => {
  const [showFilters, setShowFilters] = useState(true);
  const [showStudySession, setShowStudySession] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<QuestionFilters>({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionStats, setQuestionStats] = useState({
    totalTemas: 0,
    totalAssuntos: 0,
    totalAreas: 0
  });

  useEffect(() => {
    fetchQuestionStats();
  }, []);

  useEffect(() => {
    fetchFilteredQuestionCount();
  }, [selectedFilters]);

  const fetchQuestionStats = async () => {
    try {
      // Count total questions
      const { count: total } = await supabase
        .from('QUESTOES_FINAL')
        .select('*', { count: 'exact', head: true });

      // Count distinct areas
      const { data: areasData } = await supabase
        .from('QUESTOES_FINAL')
        .select('area')
        .not('area', 'is', null);

      const uniqueAreas = areasData ? new Set(areasData.map(item => item.area)).size : 0;

      // Count distinct themes
      const { data: temasData } = await supabase
        .from('QUESTOES_FINAL')
        .select('tema')
        .not('tema', 'is', null);

      const uniqueTemas = temasData ? new Set(temasData.map(item => item.tema)).size : 0;

      // Count distinct subjects
      const { data: assuntosData } = await supabase
        .from('QUESTOES_FINAL')
        .select('assunto')
        .not('assunto', 'is', null);

      const uniqueAssuntos = assuntosData ? new Set(assuntosData.map(item => item.assunto)).size : 0;

      setQuestionStats({
        totalTemas: uniqueTemas,
        totalAssuntos: uniqueAssuntos,
        totalAreas: uniqueAreas
      });

      setTotalQuestions(total || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFilteredQuestionCount = async () => {
    try {
      let query = supabase
        .from('QUESTOES_FINAL')
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (selectedFilters.area) {
        query = query.eq('area', selectedFilters.area);
      }
      if (selectedFilters.tema) {
        query = query.eq('tema', selectedFilters.tema);
      }
      if (selectedFilters.assunto) {
        query = query.eq('assunto', selectedFilters.assunto);
      }

      const { count } = await query;
      setTotalQuestions(count || 0);
    } catch (error) {
      console.error('Error counting filtered questions:', error);
    }
  };

  const handleStartStudy = () => {
    setShowFilters(false);
    setShowStudySession(true);
    onHideNavigation?.(true);
  };

  const handleExitStudySession = () => {
    setShowStudySession(false);
    setShowFilters(true);
    onHideNavigation?.(false);
  };

  if (showStudySession) {
    return (
      <StudySessionFinal
        filters={selectedFilters}
        onExit={handleExitStudySession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Questões Comentadas
          </h1>
          <p className="text-netflix-text-secondary text-sm sm:text-base lg:text-lg">
            Resolva questões de direito organizadas por área, tema e assunto
          </p>
        </div>

        {/* User Stats Card */}
        <UserStatsCard />

        {/* Stats Cards - Showing Questions, Themes, and Subjects */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-netflix-red rounded-lg p-1.5 sm:p-2">
                <BookOpen className="text-white" size={16} />
              </div>
              <div>
                <div className="text-white font-semibold text-lg sm:text-xl">{totalQuestions}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Questões</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-600 rounded-lg p-1.5 sm:p-2">
                <Target className="text-white" size={16} />
              </div>
              <div>
                <div className="text-white font-semibold text-lg sm:text-xl">{questionStats.totalAreas}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Áreas</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-green-600 rounded-lg p-1.5 sm:p-2">
                <Hash className="text-white" size={16} />
              </div>
              <div>
                <div className="text-white font-semibold text-lg sm:text-xl">{questionStats.totalTemas}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Temas</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-purple-600 rounded-lg p-1.5 sm:p-2">
                <FileText className="text-white" size={16} />
              </div>
              <div>
                <div className="text-white font-semibold text-lg sm:text-xl">{questionStats.totalAssuntos}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Assuntos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters at the top */}
        <div className="mb-6">
          <QuestionFiltersComponent
            onFiltersChange={setSelectedFilters}
            totalQuestions={totalQuestions}
            onStartStudy={handleStartStudy}
          />
        </div>

        {/* Start Study Button - Improved mobile responsiveness */}
        <div className="text-center px-4">
          <Button
            onClick={handleStartStudy}
            disabled={totalQuestions === 0}
            className="bg-netflix-red hover:bg-red-700 text-white px-4 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto max-w-md"
          >
            <Play className="mr-2" size={16} />
            Iniciar Sessão de Estudos
            {totalQuestions > 0 && (
              <Badge className="ml-2 bg-white text-netflix-red text-xs">
                {totalQuestions} questões
              </Badge>
            )}
          </Button>
          {totalQuestions === 0 && (
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Ajuste os filtros para encontrar questões
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsHome;
