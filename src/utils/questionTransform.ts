
import { Question } from '@/types/question';

// Tipo que representa os dados brutos vindos do Supabase
interface SupabaseQuestionData {
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

// Função para transformar dados do Supabase no tipo Question
export const transformSupabaseToQuestion = (data: SupabaseQuestionData): Question => {
  return {
    ...data,
    resposta: data.resposta_correta, // Adiciona a propriedade resposta obrigatória
    opcoes: [
      data.alternativa_a,
      data.alternativa_b,
      data.alternativa_c,
      data.alternativa_d
    ].filter(Boolean), // Adiciona opcoes e remove alternativas vazias
    questao: data.enunciado // Adiciona questao como opcional para compatibilidade
  };
};

// Função para transformar arrays de dados do Supabase
export const transformSupabaseToQuestions = (dataArray: SupabaseQuestionData[]): Question[] => {
  return dataArray.map(transformSupabaseToQuestion);
};
