
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle, XCircle } from 'lucide-react';

const PerformanceSection = () => {
  const stats = {
    totalQuestions: 127,
    correctAnswers: 99,
    accuracy: 78,
    studyStreak: 12,
    averageTime: 45
  };

  const subjectPerformance = [
    { subject: "Ética Profissional", correct: 45, total: 52, accuracy: 87, trend: "up" },
    { subject: "Direito Constitucional", correct: 23, total: 35, accuracy: 66, trend: "up" },
    { subject: "Direito Civil", correct: 18, total: 25, accuracy: 72, trend: "down" },
    { subject: "Direito Penal", correct: 8, total: 15, accuracy: 53, trend: "up" },
  ];

  const recentActivity = [
    { date: "Hoje", questions: 8, correct: 6, accuracy: 75 },
    { date: "Ontem", questions: 12, correct: 10, accuracy: 83 },
    { date: "2 dias", questions: 15, correct: 11, accuracy: 73 },
    { date: "3 dias", questions: 6, correct: 5, accuracy: 83 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Seu Desempenho
        </h1>
        <p className="text-netflix-text-secondary">
          Acompanhe seu progresso e identifique pontos de melhoria
        </p>
      </div>

      {/* Overview Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-netflix-red p-2 rounded-lg">
                <CheckCircle className="text-white" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
                <div className="text-sm text-netflix-text-secondary">Questões Resolvidas</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.accuracy}%</div>
                <div className="text-sm text-netflix-text-secondary">Taxa de Acerto</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.studyStreak}</div>
                <div className="text-sm text-netflix-text-secondary">Dias Seguidos</div>
              </div>
            </div>
          </Card>

          <Card className="bg-netflix-card border-netflix-border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-600 p-2 rounded-lg">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.averageTime}s</div>
                <div className="text-sm text-netflix-text-secondary">Tempo Médio</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Performance by Subject */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Desempenho por Disciplina</h2>
        <div className="space-y-3">
          {subjectPerformance.map((item, index) => (
            <Card key={index} className="bg-netflix-card border-netflix-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{item.subject}</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={item.accuracy >= 70 ? "default" : "secondary"}
                    className={item.accuracy >= 70 ? "bg-green-600" : "bg-netflix-border text-netflix-text-secondary"}
                  >
                    {item.accuracy}%
                  </Badge>
                  {item.trend === "up" ? (
                    <TrendingUp className="text-green-500" size={16} />
                  ) : (
                    <TrendingDown className="text-red-500" size={16} />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-netflix-text-secondary mb-2">
                <span>{item.correct} de {item.total} questões</span>
                <span>{item.accuracy}% de acerto</span>
              </div>
              
              <div className="w-full bg-netflix-border rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.accuracy >= 70 ? 'bg-green-500' : 'bg-netflix-red'}`}
                  style={{ width: `${item.accuracy}%` }}
                ></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <Card key={index} className="bg-netflix-card border-netflix-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-netflix-red p-2 rounded-lg">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{activity.date}</div>
                    <div className="text-netflix-text-secondary text-sm">
                      {activity.questions} questões resolvidas
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-bold">{activity.accuracy}%</div>
                  <div className="text-netflix-text-secondary text-sm">
                    {activity.correct}/{activity.questions} acertos
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
