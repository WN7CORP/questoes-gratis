
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DAILY_COMMENT_LIMIT = 3;

interface CommentUsage {
  comment_count: number;
  canViewMore: boolean;
  isPremium: boolean;
  remainingComments: number;
}

export const useCommentLimits = () => {
  const [usage, setUsage] = useState<CommentUsage>({
    comment_count: 0,
    canViewMore: true,
    isPremium: false,
    remainingComments: DAILY_COMMENT_LIMIT
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkCommentUsage();
  }, []);

  const checkCommentUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Verificar se é premium
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      const isPremium = profile?.is_premium || false;

      if (isPremium) {
        setUsage({
          comment_count: 0,
          canViewMore: true,
          isPremium: true,
          remainingComments: -1 // Ilimitado
        });
        setLoading(false);
        return;
      }

      // Verificar uso diário para usuários gratuitos
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyUsage } = await supabase
        .from('daily_comment_usage')
        .select('comment_count')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      const currentCount = dailyUsage?.comment_count || 0;
      const canViewMore = currentCount < DAILY_COMMENT_LIMIT;
      const remainingComments = Math.max(0, DAILY_COMMENT_LIMIT - currentCount);

      setUsage({
        comment_count: currentCount,
        canViewMore,
        isPremium: false,
        remainingComments
      });
    } catch (error) {
      console.error('Error checking comment usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementCommentCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || usage.isPremium) return true;

      if (!usage.canViewMore) {
        return false;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Usar upsert para criar ou atualizar o registro
      const { error } = await supabase
        .from('daily_comment_usage')
        .upsert({
          user_id: user.id,
          date: today,
          comment_count: usage.comment_count + 1
        }, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error('Error updating comment count:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o contador de comentários",
          variant: "destructive"
        });
        return false;
      }

      // Atualizar estado local
      const newCount = usage.comment_count + 1;
      const canViewMore = newCount < DAILY_COMMENT_LIMIT;
      
      setUsage(prev => ({
        ...prev,
        comment_count: newCount,
        canViewMore,
        remainingComments: Math.max(0, DAILY_COMMENT_LIMIT - newCount)
      }));

      return true;
    } catch (error) {
      console.error('Error incrementing comment count:', error);
      return false;
    }
  };

  return {
    usage,
    loading,
    incrementCommentCount,
    refreshUsage: checkCommentUsage
  };
};
