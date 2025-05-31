
export interface Question {
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
  resposta: string;
  opcoes: string[];
  resposta_correta: string;
  justificativa: string;
  banca: string;
  questao: string; // Made this required again to fix the type error
}
