
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, BarChart3, User, BookOpen, Target } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import WelcomeScreen from '@/components/WelcomeScreen';
import QuestionsHome from '@/components/QuestionsHome';
import StudyAreas from '@/components/StudyAreas';
import SearchSection from '@/components/SearchSection';
import PerformanceSection from '@/components/PerformanceSection';
import ProfileSection from '@/components/ProfileSection';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(null);
  const [hideNavigation, setHideNavigation] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Tabs defaultValue="home" className="h-screen flex flex-col">
        {/* Desktop Navigation - Horizontal Top Bar */}
        {!isMobile ? (
          <div className="bg-netflix-card border-b border-netflix-border px-6 py-4 fixed top-0 z-30 w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold text-netflix-red">Questões Comentadas</h1>
                <TabsList className="bg-transparent h-auto p-0 space-x-6">
                  <TabsTrigger 
                    value="home" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <Home size={18} className="mr-2" />
                    Início
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="practice" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <Target size={18} className="mr-2" />
                    Praticar
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="areas" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <BookOpen size={18} className="mr-2" />
                    Áreas
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="search" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <Search size={18} className="mr-2" />
                    Buscar
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="performance" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <BarChart3 size={18} className="mr-2" />
                    Progresso
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="profile" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <User size={18} className="mr-2" />
                    Perfil
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {user && (
                <div className="flex items-center gap-2 text-sm text-netflix-text-secondary">
                  <User size={16} />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile Navigation - Top Tabs - Hidden when hideNavigation is true */
          !hideNavigation && (
            <TabsList className="bg-netflix-card border-b border-netflix-border rounded-none h-16 sm:h-20 lg:h-16 p-0 w-full grid grid-cols-5 fixed top-0 z-30">
              <TabsTrigger value="home" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <Home size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Início</span>
              </TabsTrigger>
              
              <TabsTrigger value="practice" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <Target size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Praticar</span>
              </TabsTrigger>
              
              <TabsTrigger value="areas" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <BookOpen size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Áreas</span>
              </TabsTrigger>
              
              <TabsTrigger value="performance" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <BarChart3 size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Progresso</span>
              </TabsTrigger>
              
              <TabsTrigger value="profile" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <User size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Perfil</span>
              </TabsTrigger>
            </TabsList>
          )
        )}

        {/* Main Content with responsive padding */}
        <div className={`flex-1 overflow-hidden ${!isMobile ? 'pt-20' : hideNavigation ? 'pt-0' : 'pt-16 sm:pt-20'}`}>
          <TabsContent value="home" className="h-full mt-0">
            <div className="h-full overflow-y-auto">
              <QuestionsHome onHideNavigation={setHideNavigation} />
            </div>
          </TabsContent>
          
          <TabsContent value="practice" className="h-full mt-0">
            <QuestionsHome onHideNavigation={setHideNavigation} />
          </TabsContent>
          
          <TabsContent value="areas" className="h-full mt-0">
            <StudyAreas onHideNavigation={setHideNavigation} />
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
