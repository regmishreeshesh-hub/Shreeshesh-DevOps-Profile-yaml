
import React, { useState, useEffect } from 'react';
import SkillCard from './components/SkillCard';
import ProjectCard from './components/ProjectCard';
import { SKILLS, PROJECTS, SOCIAL_LINKS } from './constants';

const App: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  // Particle Generation for atmospheric effect
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 6,
    }));
    setParticles(newParticles);
  }, []);

  const handleCardClick = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white selection:bg-orange-500/30 font-sans">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[#060918] -z-20" />
      
      {/* Atmospheric Glows */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-orange-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Vertical Floating Particles */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute bottom-0 w-[1px] h-20 bg-gradient-to-t from-transparent via-white/10 to-transparent"
            style={{
              left: `${p.left}%`,
              animation: `float-up ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-20vh); opacity: 0; }
        }
      `}</style>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl relative z-10">
        
        {/* Header Section */}
        <header className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 custom-glow drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] uppercase">
              Shreeshesh <span className="text-orange-500">Regmi</span>
            </h1>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10 font-mono-code text-sm md:text-base tracking-[0.2em] text-white/70">
            <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"/> STATUS: ONLINE</span>
            <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-blue-500"/> ROLE: DEVOPS_ENGINEER</span>
            <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-purple-500"/> Location: Kathmandu, Nepal</span>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="mailto:shreeshesh.regmi@gmail.com" 
              className="flex items-center gap-4 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-300 group text-lg md:text-xl font-semibold"
            >
              <span className="text-orange-400 group-hover:rotate-12 transition-transform text-2xl">📧</span>
              shreeshesh.regmi@gmail.com
            </a>
            <a 
              href="tel:+9779704556365" 
              className="flex items-center gap-4 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 group text-lg md:text-xl font-semibold"
            >
              <span className="text-blue-400 group-hover:scale-110 transition-transform text-2xl">📱</span>
              +977 9704556365
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group text-sm font-medium"
              >
                <span 
                  className={`transition-transform group-hover:scale-110 group-hover:rotate-5`}
                  dangerouslySetInnerHTML={{ __html: social.icon }}
                />
                <span className="uppercase tracking-wide">{social.name}</span>
              </a>
            ))}
          </div>
        </header>



        {/* 3x3 MATRIX GRID */}
        <div className="relative mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
              Technical <span className="text-orange-500">Skills</span>
            </h2>
            <div className="h-px w-32 md:w-48 mx-auto bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <p className="mt-4 text-white/60 text-sm md:text-base max-w-2xl mx-auto">
              My expertise in modern DevOps technologies and practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-6">
            {SKILLS.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                isExpanded={expandedId === skill.id}
                onClick={() => handleCardClick(skill.id)}
              />
            ))}
          </div>
          
          {/* Subtle Grid Lines Overlay for Matrix Aesthetic */}
          <div className="absolute -inset-8 pointer-events-none opacity-10 hidden md:block">
             <div className="h-full w-full border-x border-white/20 flex justify-evenly">
                <div className="w-px bg-white/20 h-full" />
                <div className="w-px bg-white/20 h-full" />
             </div>
             <div className="absolute inset-0 border-y border-white/20 flex flex-col justify-evenly">
                <div className="h-px bg-white/20 w-full" />
                <div className="h-px bg-white/20 w-full" />
             </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col items-center justify-center gap-6 text-white/60 text-sm font-mono-code uppercase tracking-widest text-center">
          <div className="flex gap-8 mb-2">
            <span className="hover:text-white transition-colors cursor-pointer">BUILD_LOGS</span>
            <span className="hover:text-white transition-colors cursor-pointer">SYSTEM_INFO</span>
            <span className="hover:text-white transition-colors cursor-pointer">DEPLOY_STATUS</span>
          </div>
          <div>
            © {new Date().getFullYear()} Shreeshesh Regmi • Built for Modern DevOps Landscapes
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
