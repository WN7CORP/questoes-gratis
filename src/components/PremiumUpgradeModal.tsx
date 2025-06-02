
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Crown, CheckCircle, Smartphone, Globe } from 'lucide-react';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';

interface PremiumUpgradeModalProps {
  isVisible: boolean;
  onClose: () => void;
  remainingComments?: number;
}

const PremiumUpgradeModal = ({ isVisible, onClose, remainingComments = 0 }: PremiumUpgradeModalProps) => {
  const { isAndroid, isIOS, isMobile, premiumLink } = usePlatformDetection();

  if (!isVisible) return null;

  const benefits = [
    "Comentários ilimitados em todas as questões",
    "Acesso a todas as funcionalidades exclusivas",
    "Sem limitações de uso diário",
    "Suporte prioritário",
    "Conteúdo premium atualizado constantemente",
    "Estatísticas avançadas de desempenho"
  ];

  const handleUpgrade = () => {
    window.open(premiumLink, '_blank');
  };

  const getPlatformText = () => {
    if (isIOS) return "App Store";
    if (isAndroid) return "Google Play";
    return "loja de aplicativos";
  };

  const getPlatformIcon = () => {
    if (isMobile) return <Smartphone className="text-blue-500" size={20} />;
    return <Globe className="text-blue-500" size={20} />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-netflix-card border-netflix-border w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-netflix-border">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
              <Crown className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white text-lg sm:text-xl font-semibold">
                Upgrade para Premium
              </h3>
              <p className="text-gray-400 text-sm">
                Você atingiu o limite de {remainingComments === 0 ? '3' : `${3 - remainingComments}`} comentários diários
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mb-4">
              <h4 className="text-white text-lg font-semibold mb-2">
                🎯 Desbloqueie Todo o Potencial dos Seus Estudos!
              </h4>
              <p className="text-gray-300 text-sm">
                Com o plano Premium, você terá acesso ilimitado a todos os comentários e funcionalidades exclusivas.
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3 mb-6">
            <h5 className="text-white font-semibold text-base mb-3">
              ✨ Vantagens do Premium:
            </h5>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                <span className="text-gray-200 text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Platform Info */}
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              {getPlatformIcon()}
              <span className="text-blue-400 font-medium text-sm">
                Disponível na {getPlatformText()}
              </span>
            </div>
            <p className="text-gray-300 text-xs">
              {isMobile 
                ? `Você será redirecionado para a ${getPlatformText()} para completar a assinatura.`
                : "Acesse pelo seu dispositivo móvel para assinar o plano Premium."
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-netflix-border">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Continuar Grátis
          </Button>
          <Button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
          >
            <Crown className="mr-2" size={16} />
            Ser Premium Agora
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PremiumUpgradeModal;
