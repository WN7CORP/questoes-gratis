import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle, Filter } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import UserStatsCard from './UserStatsCard';
interface UserStudySession {
  id: string;
  user_id: string;
  mode: string;
  area: string | null;
  questions_answered: number;
  correct_answers: number;
  total_time: number;
  created_at: string;
  completed_at: string | null;
}
const PerformanceSection = () => {
  const [sessions, setSessions] = useState<UserStudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  useEffect(() => {
    fetchSessions();
  }, [timeFilter]);
  const fetchSessions = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Calcular data limite baseada no filtro
      let dateFilter = '';
      const now = new Date();
      switch (timeFilter) {
        case '7d':
          now.setDate(now.getDate() - 7);
          dateFilter = now.toISOString();
          break;
        case '30d':
          now.setDate(now.getDate() - 30);
          dateFilter = now.toISOString();
          break;
        case '3m':
          now.setMonth(now.getMonth() - 3);
          dateFilter = now.toISOString();
          break;
        default:
          dateFilter = '';
      }
      let query = supabase.from('user_study_sessions').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
      }
      const {
        data: sessionsData,
        error
      } = await query;
      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(sessionsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'random':
        return 'Aleatórias';
      case 'simulado':
        return 'Simulado';
      case 'recent':
        return 'Recentes';
      case 'area':
        return 'Por Área';
      case 'daily_challenge':
        return 'Desafio Diário';
      default:
        return mode === 'all' ? 'Geral' : mode;
    }
  };
  return (
    <div className="h-full overflow-y-auto bg-black">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Seu Desempenho
            </h1>
            <p className="text-gray-400">
              Acompanhe seu progresso e identifique pontos de melhoria
            </p>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter size={16} className="text-gray-400" />
          <span className="text-white text-sm">Período:</span>
          <div className="flex gap-1">
            {[{
            key: '7d',
            label: '7 dias'
          }, {
            key: '30d',
            label: '30 dias'
          }, {
            key: '3m',
            label: '3 meses'
          }, {
            key: 'all',
            label: 'Tudo'
          }].map(({
            key,
            label
          }) => <Button key={key} variant={timeFilter === key ? "default" : "outline"} size="sm" onClick={() => setTimeFilter(key as any)} className={`text-xs ${timeFilter === key ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}>
                {label}
              </Button>)}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-6">
        {/* User Stats */}
        <UserStatsCard />

        {/* Recent Sessions */}
        <Card className="bg-gray-900 border-gray-700 p-6 px-[4px] py-[26px] my-[11px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="text-red-500" size={20} />
            Sessões Recentes
          </h2>
          
          {loading ? (
            <div className="text-gray-400 text-center py-8">
              Carregando sessões...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto mb-4 text-gray-500" size={48} />
              <h3 className="text-white text-lg font-semibold mb-2">Nenhuma sessão encontrada</h3>
              <p className="text-gray-400">
                Complete algumas sessões de estudo para ver seu histórico
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.map(session => {
                const accuracy = session.questions_answered > 0 
                  ? Math.round((session.correct_answers / session.questions_answered) * 100) 
                  : 0;

                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg py-[17px]">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-600 p-2 rounded-lg">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {session.area || 'Todas as áreas'} • {getModeLabel(session.mode)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatDate(session.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-white font-bold">{session.questions_answered}</div>
                          <div className="text-gray-400 text-xs">questões</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`font-bold ${accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {accuracy}%
                          </div>
                          <div className="text-gray-400 text-xs">acertos</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">{formatTime(session.total_time)}</div>
                          <div className="text-gray-400 text-xs">tempo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default PerformanceSection;
