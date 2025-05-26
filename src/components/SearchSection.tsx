
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, BookOpen } from 'lucide-react';

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const recentSearches = [
    "Estatuto da OAB",
    "Direitos fundamentais",
    "Competência da União",
    "Responsabilidade civil",
    "Processo penal",
    "Direito empresarial"
  ];

  const searchResults = [
    {
      id: 1,
      question: "Marilda, após ter sido regularmente processada, foi condenada, pelo Juízo originariamente competente, pela prática de desacato...",
      subject: "Direito Processual Penal",
      year: "2024",
      exam: "XL",
      difficulty: "Médio",
      answered: true,
      correctAnswer: "A"
    },
    {
      id: 2,
      question: "No que se refere aos direitos fundamentais previstos na Constituição Federal, é correto afirmar que...",
      subject: "Direito Constitucional",
      year: "2023",
      exam: "XXXIX",
      difficulty: "Difícil",
      answered: false,
      correctAnswer: "C"
    },
    {
      id: 3,
      question: "Sobre o Estatuto da Advocacia e da OAB, assinale a alternativa correta quanto às prerrogativas...",
      subject: "Ética Profissional",
      year: "2024",
      exam: "XL",
      difficulty: "Fácil",
      answered: true,
      correctAnswer: "B"
    },
    {
      id: 4,
      question: "Em relação à competência da União para legislar, conforme estabelecido na Constituição Federal...",
      subject: "Direito Constitucional",
      year: "2023",
      exam: "XXXIX",
      difficulty: "Médio",
      answered: false,
      correctAnswer: "D"
    }
  ];

  const filteredResults = searchTerm 
    ? searchResults.filter(result => 
        result.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
          Buscar Questões
        </h1>
        <p className="text-netflix-text-secondary text-sm sm:text-base">
          Encontre questões específicas por tema ou palavra-chave
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-text-secondary" size={20} />
          <Input
            placeholder="Buscar por tema, artigo, súmula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-netflix-card border-netflix-border text-white placeholder:text-netflix-text-secondary h-12 text-base"
          />
        </div>
        
        <div className="flex gap-2 mt-3 flex-wrap">
          <Button variant="outline" size="sm" className="bg-netflix-card border-netflix-border text-netflix-text-secondary hover:bg-gray-700 hover:text-white transition-colors">
            <Filter size={16} className="mr-1" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="bg-netflix-card border-netflix-border text-netflix-text-secondary hover:bg-gray-700 hover:text-white transition-colors">
            Por disciplina
          </Button>
          <Button variant="outline" size="sm" className="bg-netflix-card border-netflix-border text-netflix-text-secondary hover:bg-gray-700 hover:text-white transition-colors">
            Por ano
          </Button>
        </div>
      </div>

      {/* Recent Searches */}
      {!searchTerm && (
        <div className="px-4 sm:px-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Buscas Recentes</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-netflix-card border-netflix-border text-netflix-text-secondary hover:bg-gray-700 hover:text-white transition-colors"
                onClick={() => setSearchTerm(search)}
              >
                <Clock size={14} className="mr-1" />
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchTerm && (
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Resultados para "{searchTerm}"
            </h2>
            <span className="text-netflix-text-secondary text-sm">
              {filteredResults.length} questões encontradas
            </span>
          </div>

          <div className="space-y-4">
            {filteredResults.map((result) => (
              <Card key={result.id} className="bg-netflix-card border-netflix-border p-4 sm:p-5 hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-netflix-red rounded-lg p-2 mt-1 flex-shrink-0">
                    <BookOpen className="text-white" size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="bg-netflix-border text-netflix-text-secondary">
                        {result.exam}ª {result.year}
                      </Badge>
                      <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary bg-netflix-card">
                        Questão {result.id}
                      </Badge>
                      {result.answered && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-400">Respondida</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white text-sm sm:text-base mb-3 leading-relaxed line-clamp-3">
                      {result.question}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-netflix-text-secondary flex-wrap">
                      <span className="font-medium">{result.subject}</span>
                      <span>•</span>
                      <span>Dificuldade: {result.difficulty}</span>
                      <span>•</span>
                      <span>Resposta: {result.correctAnswer}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Popular Topics */}
      {!searchTerm && (
        <div className="px-4 sm:px-6 pb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Tópicos Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "Ética e Disciplina", count: 156 },
              { name: "Direitos Fundamentais", count: 89 },
              { name: "Organização do Estado", count: 123 },
              { name: "Processo Civil", count: 234 },
              { name: "Direito Penal", count: 178 },
              { name: "Direito do Trabalho", count: 145 },
              { name: "Direito Empresarial", count: 98 },
              { name: "Direito Tributário", count: 167 }
            ].map((topic, index) => (
              <Card 
                key={index}
                className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => setSearchTerm(topic.name)}
              >
                <h3 className="text-white font-medium text-sm sm:text-base">{topic.name}</h3>
                <p className="text-netflix-text-secondary text-xs sm:text-sm mt-1">
                  {topic.count} questões
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
