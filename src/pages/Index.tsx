
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, BarChart3, User, BookOpen } from 'lucide-react';
import WelcomeScreen from '@/components/WelcomeScreen';
import HomeSection from '@/components/HomeSection';
import StudyAreas from '@/components/StudyAreas';
import SearchSection from '@/components/SearchSection';
import PerformanceSection from '@/components/PerformanceSection';
import ProfileSection from '@/components/ProfileSection';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Tabs defaultValue="home" className="h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="home" className="h-full mt-0">
            <HomeSection />
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

        {/* Bottom Navigation */}
        <TabsList className="bg-netflix-card border-t border-netflix-border rounded-none h-16 p-0 w-full grid grid-cols-5">
          <TabsTrigger 
            value="home" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            <Home size={20} />
            <span className="text-xs">Início</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="areas" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            <BookOpen size={20} />
            <span className="text-xs">Áreas</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="search" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            <Search size={20} />
            <span className="text-xs">Buscar</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="performance" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            <BarChart3 size={20} />
            <span className="text-xs">Desempenho</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="profile" 
            className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            <User size={20} />
            <span className="text-xs">Perfil</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Index;
