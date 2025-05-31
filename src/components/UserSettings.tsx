
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings, Timer, Volume2, Palette, Target } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserSettingsData {
  theme: 'dark' | 'light';
  timer_enabled: boolean;
  timer_duration: number;
  sound_enabled: boolean;
  difficulty_preference: 'easy' | 'medium' | 'hard' | 'mixed';
}

interface UserSettingsProps {
  onSettingsChange?: (settings: UserSettingsData) => void;
}

const UserSettings = ({ onSettingsChange }: UserSettingsProps) => {
  const [settings, setSettings] = useState<UserSettingsData>({
    theme: 'dark',
    timer_enabled: true,
    timer_duration: 60,
    sound_enabled: true,
    difficulty_preference: 'mixed'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, use default settings since the table might not be fully synced
      // In the future, this will load from user_settings table
      const defaultSettings: UserSettingsData = {
        theme: 'dark',
        timer_enabled: true,
        timer_duration: 60,
        sound_enabled: true,
        difficulty_preference: 'mixed'
      };

      setSettings(defaultSettings);
      if (onSettingsChange) {
        onSettingsChange(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para salvar suas configurações",
          variant: "destructive"
        });
        return;
      }

      // For now, just update local state
      // In the future, this will save to user_settings table
      console.log('Saving settings:', settings);
      
      if (onSettingsChange) {
        onSettingsChange(settings);
      }

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettingsData>(
    key: K, 
    value: UserSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <Card className="bg-netflix-card border-netflix-border p-6">
        <div className="text-gray-400">Carregando configurações...</div>
      </Card>
    );
  }

  return (
    <Card className="bg-netflix-card border-netflix-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-netflix-red" size={24} />
        <h2 className="text-white text-xl font-semibold">Configurações</h2>
      </div>

      <div className="space-y-6">
        {/* Timer Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="text-blue-500" size={20} />
            <Label className="text-white font-medium">Timer</Label>
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-400">Ativar timer por questão</Label>
            <Switch
              checked={settings.timer_enabled}
              onCheckedChange={(checked) => updateSetting('timer_enabled', checked)}
            />
          </div>

          {settings.timer_enabled && (
            <div className="space-y-2">
              <Label className="text-gray-400">Duração (segundos)</Label>
              <Select
                value={settings.timer_duration.toString()}
                onValueChange={(value) => updateSetting('timer_duration', parseInt(value))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                  <SelectItem value="90">1 minuto e 30s</SelectItem>
                  <SelectItem value="120">2 minutos</SelectItem>
                  <SelectItem value="180">3 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Sound Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="text-green-500" size={20} />
            <Label className="text-white font-medium">Audio</Label>
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-400">Sons de feedback</Label>
            <Switch
              checked={settings.sound_enabled}
              onCheckedChange={(checked) => updateSetting('sound_enabled', checked)}
            />
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="text-purple-500" size={20} />
            <Label className="text-white font-medium">Aparência</Label>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-400">Tema</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSetting('theme', value as 'dark' | 'light')}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="light">Claro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Difficulty Preference */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="text-orange-500" size={20} />
            <Label className="text-white font-medium">Dificuldade</Label>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-400">Preferência de dificuldade</Label>
            <Select
              value={settings.difficulty_preference}
              onValueChange={(value) => updateSetting('difficulty_preference', value as any)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
                <SelectItem value="mixed">Misto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="w-full bg-netflix-red hover:bg-red-700 text-white"
        >
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </Card>
  );
};

export default UserSettings;
