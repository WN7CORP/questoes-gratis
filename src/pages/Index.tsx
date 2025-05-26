
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, BarChart3, User, BookOpen } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import WelcomeScreen from '@/components/WelcomeScreen';
import HomeSection from '@/components/HomeSection';
import StudyAreas from '@/components/StudyAreas';
import SearchSection from '@/components/SearchSection';
import PerformanceSection from '@/components/PerformanceSection';
import ProfileSection from '@/components/ProfileSection';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Tabs defaultValue="home" className="h-screen flex flex-col">
        {/* Top Navigation Tabs - Enhanced Responsiveness */}
        <TabsList className="bg-netflix-card border-b border-netflix-border rounded-none h-16 sm:h-20 lg:h-16 p-0 w-full grid grid-cols-5 fixed top-0 z-30 shadow-lg">
          <TabsTrigger 
            value="home" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95 lg:flex-row lg:gap-2 focus-visible-ring"
          >
            <Home size={20} className="sm:size-6 lg:size-5" />
            <span className="text-xs sm:text-sm lg:text-base font-medium">Início</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="areas" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95 lg:flex-row lg:gap-2 focus-visible-ring"
          >
            <BookOpen size={20} className="sm:size-6 lg:size-5" />
            <span className="text-xs sm:text-sm lg:text-base font-medium">Áreas</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="search" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95 lg:flex-row lg:gap-2 focus-visible-ring"
          >
            <Search size={20} className="sm:size-6 lg:size-5" />
            <span className="text-xs sm:text-sm lg:text-base font-medium">Buscar</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="performance" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95 lg:flex-row lg:gap-2 focus-visible-ring"
          >
            <BarChart3 size={20} className="sm:size-6 lg:size-5" />
            <span className="text-xs sm:text-sm lg:text-base font-medium">Progresso</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="profile" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95 lg:flex-row lg:gap-2 focus-visible-ring"
          >
            <User size={20} className="sm:size-6 lg:size-5" />
            <span className="text-xs sm:text-sm lg:text-base font-medium">Perfil</span>
          </TabsTrigger>
        </TabsList>

        {/* Main Content with responsive padding */}
        <div className="flex-1 overflow-hidden pt-16 sm:pt-20 lg:pt-16">
          <TabsContent value="home" className="h-full mt-0">
            <div className="h-full overflow-y-auto">
              <HomeSection />
            </div>
          </TabsContent>
          
          <TabsContent value="areas" className="h-full mt-0">
            <StudyAreas />
          </TabsContent>
          
          <TabsContent value="search" className="h-full mt-0">
            <SearchSection />
          </TabsContent>
          
          <TabsContent value="performance" className="h-full mt-0">
            <PerformanceSection />
          </TabsContent>
          
          <TabsContent value="profile" className="h-full mt-0">
            <ProfileSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
