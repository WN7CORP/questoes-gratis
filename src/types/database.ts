
// Interfaces temporárias para as novas tabelas até que os tipos do Supabase sejam atualizados
export interface UserQuestionFavorite {
  id: string;
  user_id: string;
  question_id: number;
  created_at: string;
  Questoes_Comentadas: {
    id: number;
    ano: string;
    exame: string;
    area: string;
    numero: string;
    questao: string;
    resposta_correta: string;
    alternativa_a?: string;
    alternativa_b?: string;
    alternativa_c?: string;
    alternativa_d?: string;
    justificativa?: string;
  };
}

export interface UserStudySession {
  id: string;
  user_id: string;
  area: string | null;
  questions_answered: number;
  correct_answers: number;
  total_time: number;
  mode: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserQuestionAttempt {
  id: string;
  user_id: string;
  question_id: number;
  selected_answer: string;
  is_correct: boolean;
  time_spent: number | null;
  created_at: string;
  session_id: string | null;
  Questoes_Comentadas?: {
    area: string;
    ano: string;
    exame: string;
  };
}

export interface UserPerformanceStats {
  id: string;
  user_id: string;
  area: string;
  total_questions: number;
  correct_answers: number;
  total_time: number;
  average_time_per_question: number;
  accuracy_percentage: number;
  last_studied: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  points: number;
  unlocked_at: string;
}
