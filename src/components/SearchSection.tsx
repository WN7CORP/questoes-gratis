
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
    "Responsabilidade civil"
  ];

  const searchResults = [
    {
      id: 1,
      question: "Sobre o Estatuto da Advocacia e da OAB, é correto afirmar que...",
      subject: "Ética Profissional",
      year: "2023",
      difficulty: "Médio",
      answered: false
    },
    {
      id: 2,
      question: "No que se refere aos direitos fundamentais previstos na Constituição...",
      subject: "Direito Constitucional",
      year: "2022",
      difficulty: "Difícil",
      answered: true
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-netflix-black">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Buscar Questões
        </h1>
        <p className="text-netflix-text-secondary">
          Encontre questões específicas por tema ou palavra-chave
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-text-secondary" size={20} />
          <Input
            placeholder="Buscar por tema, artigo, súmula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-netflix-card border-netflix-border text-white placeholder:text-netflix-text-secondary"
          />
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="border-netflix-border text-netflix-text-secondary hover:bg-netflix-card">
            <Filter size={16} className="mr-1" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="border-netflix-border text-netflix-text-secondary hover:bg-netflix-card">
            Por disciplina
          </Button>
          <Button variant="outline" size="sm" className="border-netflix-border text-netflix-text-secondary hover:bg-netflix-card">
            Por ano
          </Button>
        </div>
      </div>

      {/* Recent Searches */}
      {!searchTerm && (
        <div className="px-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Buscas Recentes</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="border-netflix-border text-netflix-text-secondary hover:bg-netflix-card"
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
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Resultados para "{searchTerm}"
            </h2>
            <span className="text-netflix-text-secondary text-sm">
              {searchResults.length} questões encontradas
            </span>
          </div>

          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="bg-netflix-card border-netflix-border p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-netflix-red rounded-lg p-2 mt-1">
                    <BookOpen className="text-white" size={16} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-netflix-border text-netflix-text-secondary">
                        Questão {result.id}
                      </Badge>
                      <Badge variant="outline" className="border-netflix-border text-netflix-text-secondary">
                        {result.year}
                      </Badge>
                      {result.answered && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-white text-sm mb-2 leading-relaxed">
                      {result.question}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-netflix-text-secondary">
                      <span>{result.subject}</span>
                      <span>•</span>
                      <span>{result.difficulty}</span>
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
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Tópicos Populares</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Ética e Disciplina",
              "Direitos Fundamentais",
              "Organização do Estado",
              "Processo Civil",
              "Direito Penal",
              "Direito do Trabalho"
            ].map((topic, index) => (
              <Card 
                key={index}
                className="bg-netflix-card border-netflix-border p-4 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-white font-medium text-sm">{topic}</h3>
                <p className="text-netflix-text-secondary text-xs mt-1">
                  {Math.floor(Math.random() * 50) + 10} questões
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
