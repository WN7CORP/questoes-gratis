
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Scale, Shield, Home as HomeIcon, Users, Briefcase, Globe } from 'lucide-react';

const StudyAreas = () => {
  const areas = [
    {
      name: "Ética Profissional",
      description: "Código de Ética e Disciplina da OAB",
      questionsCount: 245,
      progress: 78,
      icon: Scale,
      color: "bg-blue-500"
    },
    {
      name: "Direito Constitucional",
      description: "Princípios e normas constitucionais",
      questionsCount: 312,
      progress: 45,
      icon: Shield,
      color: "bg-green-500"
    },
    {
      name: "Direito Civil",
      description: "Pessoas, bens, fatos jurídicos",
      questionsCount: 428,
      progress: 62,
      icon: HomeIcon,
      color: "bg-purple-500"
    },
    {
      name: "Direito Penal",
      description: "Crimes e contravenções penais",
      questionsCount: 356,
      progress: 33,
      icon: Shield,
      color: "bg-red-500"
    },
    {
      name: "Direito do Trabalho",
      description: "Relações de trabalho e emprego",
      questionsCount: 289,
      progress: 55,
      icon: Users,
      color: "bg-yellow-500"
    },
    {
      name: "Direito Empresarial",
      description: "Sociedades e atividade empresarial",
      questionsCount: 198,
      progress: 28,
      icon: Briefcase,
      color: "bg-indigo-500"
    },
    {
      name: "Direito Tributário",
      description: "Sistema tributário nacional",
      questionsCount: 267,
      progress: 41,
      icon: Globe,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Áreas de Estudo
        </h1>
        <p className="text-netflix-text-secondary">
          Escolha uma disciplina para começar a estudar
        </p>
      </div>

      {/* Stats Overview */}
      <div className="px-6 mb-6">
        <Card className="bg-netflix-card border-netflix-border p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-netflix-red">7</div>
              <div className="text-sm text-netflix-text-secondary">Disciplinas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">2,095</div>
              <div className="text-sm text-netflix-text-secondary">Questões</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">52%</div>
              <div className="text-sm text-netflix-text-secondary">Progresso Médio</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Areas Grid */}
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {areas.map((area, index) => (
            <Card 
              key={index}
              className="bg-netflix-card border-netflix-border p-5 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`${area.color} p-3 rounded-lg`}>
                  <area.icon className="text-white" size={24} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-lg">
                      {area.name}
                    </h3>
                    <Badge variant="secondary" className="bg-netflix-border text-netflix-text-secondary">
                      {area.questionsCount}
                    </Badge>
                  </div>
                  <p className="text-netflix-text-secondary text-sm mb-3">
                    {area.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-netflix-border rounded-full h-2">
                      <div 
                        className="bg-netflix-red h-2 rounded-full transition-all duration-300"
                        style={{ width: `${area.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-netflix-text-secondary min-w-[3rem]">
                      {area.progress}%
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="text-netflix-text-secondary" size={20} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-6">
        <Card className="bg-gradient-to-r from-netflix-red to-red-700 border-none p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                Simulado Geral
              </h3>
              <p className="text-gray-200 text-sm">
                Questões mistas de todas as disciplinas
              </p>
            </div>
            <ChevronRight className="text-white" size={24} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudyAreas;
