
import { QuestionFinal } from '@/types/questionFinal';

// Tipo que representa os dados brutos vindos do Supabase da tabela QUESTOES_FINAL
interface SupabaseQuestionFinalData {
  id: number;
  area: string | null;
  tema: string | null;
  assunto: string | null;
  enunciado: string | null;
  A: string | null;
  B: string | null;
  C: string | null;
  D: string | null;
  E: string | null;
  resposta_correta: string | null;
  alternativa_correta: string | null;
  justificativa: string | null;
  aplicada_em: string | null;
  numero_questao: number | null;
}

// Função para transformar dados do Supabase no tipo QuestionFinal
export const transformSupabaseToQuestionFinal = (data: SupabaseQuestionFinalData): QuestionFinal => {
  const opcoes = [
    data.A,
    data.B,
    data.C,
    data.D,
    data.E
  ].filter(Boolean) as string[];

  return {
    id: data.id,
    area: data.area || '',
    tema: data.tema || '',
    assunto: data.assunto || '',
    enunciado: data.enunciado || '',
    A: data.A || '',
    B: data.B || '',
    C: data.C || '',
    D: data.D,
    E: data.E,
    resposta_correta: data.resposta_correta || '',
    alternativa_correta: data.alternativa_correta || '',
    justificativa: data.justificativa || '',
    aplicada_em: data.aplicada_em || '',
    numero_questao: data.numero_questao || 0,
    opcoes,
    hasAlternativeD: Boolean(data.D && data.D.trim() !== ''),
    hasAlternativeE: Boolean(data.E && data.E.trim() !== '')
  };
};

// Função para transformar arrays de dados do Supabase
export const transformSupabaseToQuestionsFinal = (dataArray: SupabaseQuestionFinalData[]): QuestionFinal[] => {
  return dataArray.map(transformSupabaseToQuestionFinal);
};
