
export interface QuestionFinal {
  id: number;
  area: string;
  tema: string;
  assunto: string;
  enunciado: string;
  A: string;
  B: string;
  C: string;
  D: string | null;
  E: string | null;
  resposta_correta: string;
  alternativa_correta: string;
  justificativa: string;
  aplicada_em: string;
  numero_questao: number;
  opcoes: string[];
  hasAlternativeD: boolean;
  hasAlternativeE: boolean;
}

export interface QuestionFilters {
  area?: string;
  tema?: string;
  assunto?: string;
  aplicadaEm?: string;
  numAlternativas?: 'todas' | '4' | '5';
}

export interface QuestionStats {
  totalQuestions: number;
  questionsByArea: Record<string, number>;
  questionsByTema: Record<string, number>;
  questionsWith4Alternatives: number;
  questionsWith5Alternatives: number;
}
